#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import * as playwright from "playwright";

const isCI = process.env.CI === "true";
const mode = process.argv[2] || "test"; // 'test' or 'update'

console.log(`🎯 Visual Regression Tool ${isCI ? "(CI Mode)" : "(Local Mode)"}`);
console.log("===============================================");

// Centralized configuration - all values in one place for easy tuning
const CONFIG = {
  server: {
    url: "http://localhost:8788/",
    port: 8788,
    startCommand: ["npm", "run", "dev"],
    pidFile: "server.pid",
    spawnOptions: {
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    },
  },

  timing: {
    serverStartupMs: 5000, // Initial wait after spawning server process
    serverStabilityMs: 5000, // Additional wait for server to stabilize
    pageStabilizationMs: 3000, // Wait for page content to settle before screenshot
    serverCheckIntervalMs: 2000,
    serverShutdownMs: 2000,
  },

  retries: {
    maxServerStartupAttempts: 15,
    maxBaselineDownloadAttempts: 3,
  },

  paths: {
    baselineDir: "visual-baselines",
    tempDir: "current-screenshots",
    currentScreenshot: "visual-baselines/homepage-current.png",
    baselineScreenshot: "visual-baselines/homepage-baseline.png",
    ciCurrentScreenshot: "current-screenshots/homepage-current.png",
    ciBaselineScreenshot: "baseline-screenshots/homepage-baseline.png",
    diffScreenshot: "visual-baselines/homepage-diff.png",
    ciDiffScreenshot: "current-screenshots/homepage-diff.png",
  },

  playwright: {
    launchOptions: { headless: true },
    viewport: { width: 1280, height: 1080 },
    targetUrl: "http://localhost:8788",
    navigationOptions: { waitUntil: "networkidle" },
    screenshotOptions: { fullPage: true },
  },

  comparison: {
    pixelThresholdPercent: 0.5, // Max allowed visual difference percentage
    dimensionTolerance: 50, // Allow small dimension changes (e.g., scrollbars)
    pixelmatchOptions: { threshold: 0.1 },
  },

  github: {
    baselineEndpoint: (repo) =>
      `https://api.github.com/repos/${repo}/contents/visual-baselines/homepage-baseline.png?ref=main`,
    headers: {
      Accept: "application/vnd.github.v3.raw",
    },
  },
};

async function waitForServer(url, maxAttempts, interval) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log("✅ Server is responding");
        return true;
      }
    } catch (error) {
      // Expected during startup - server not ready yet
      if (i === maxAttempts - 1) {
        console.log(`⚠️ Server never responded. Last error: ${error.message}`);
      }
    }

    console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  return false;
}

async function checkExistingServer() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(CONFIG.server.url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log(
        "🔍 Detected server already running on port",
        CONFIG.server.port,
      );
      return true;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("⚠️ Server check timed out");
    } else if (error.code === "ECONNREFUSED") {
      // Expected when no server is running
    } else {
      console.log(`⚠️ Server check failed: ${error.message}`);
    }
  }
  return false;
}

async function startServer() {
  // Check if a dev server is already running (common during development)
  const serverExists = await checkExistingServer();

  if (serverExists) {
    console.log("✅ Using existing server (dev server detected)");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(CONFIG.server.url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Existing server not responding properly");
      }
      console.log("✅ Existing server verified and ready");
      return null;
    } catch (error) {
      console.log("⚠️ Existing server verification failed:", error.message);
      console.log("🚀 Will start new server instead");
    }
  } else {
    console.log("🚀 Starting new server...");
  }

  // Ensure required directories exist
  if (!fs.existsSync("node_modules")) {
    throw new Error("node_modules not found. Run 'npm install' first.");
  }

  const server = spawn(
    CONFIG.server.startCommand[0],
    CONFIG.server.startCommand.slice(1),
    CONFIG.server.spawnOptions,
  );

  // Handle spawn errors immediately
  server.on("error", (error) => {
    throw new Error(`Failed to start server process: ${error.message}`);
  });

  // Monitor for immediate crashes
  server.on("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      throw new Error(`Server exited with code ${code}`);
    }
    if (signal) {
      throw new Error(`Server killed with signal ${signal}`);
    }
  });

  // Store PID for cleanup
  fs.writeFileSync(CONFIG.server.pidFile, server.pid.toString());

  await new Promise((resolve) =>
    setTimeout(resolve, CONFIG.timing.serverStartupMs),
  );

  const ready = await waitForServer(
    CONFIG.server.url,
    CONFIG.retries.maxServerStartupAttempts,
    CONFIG.timing.serverCheckIntervalMs,
  );
  if (!ready) {
    throw new Error("Server failed to start within timeout period");
  }

  // Additional stability verification for newly started servers
  console.log("🔍 Checking server stability...");
  await new Promise((resolve) =>
    setTimeout(resolve, CONFIG.timing.serverStabilityMs),
  );

  if (!fs.existsSync(CONFIG.server.pidFile)) {
    throw new Error("Server PID file missing - server may have crashed");
  }

  const pid = parseInt(fs.readFileSync(CONFIG.server.pidFile, "utf8"));
  try {
    process.kill(pid, 0);
  } catch {
    throw new Error("Server process died after initial startup");
  }

  try {
    const response = await fetch(CONFIG.server.url);
    if (!response.ok) {
      throw new Error(`Server responding with status ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Server connectivity check failed: ${error.message}`);
  }

  console.log("✅ Server is stable and ready");
  return server;
}

async function downloadBaseline() {
  if (!isCI) {
    // Local mode - baseline should already exist from previous runs
    return fs.existsSync(CONFIG.paths.baselineScreenshot);
  }

  // CI mode - download baseline from GitHub repository
  console.log("📥 Downloading baseline from repository...");

  if (!fs.existsSync("baseline-screenshots")) {
    fs.mkdirSync("baseline-screenshots");
  }

  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPOSITORY;

    if (!token || !repo) {
      console.log("ℹ️ No GitHub token/repo - treating as initial run");
      return false;
    }

    const response = await fetch(CONFIG.github.baselineEndpoint(repo), {
      headers: {
        Authorization: `token ${token}`,
        ...CONFIG.github.headers,
      },
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(CONFIG.paths.ciBaselineScreenshot, Buffer.from(buffer));
      console.log("✅ Downloaded baseline");
      return true;
    } else if (response.status === 404) {
      console.log(
        "ℹ️ No baseline found in repository - treating as initial run",
      );
      return false;
    } else {
      console.log(
        `⚠️ GitHub API error: ${response.status} ${response.statusText}`,
      );
      return false;
    }
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.log(
        "⚠️ Network error downloading baseline - check internet connection",
      );
    } else {
      console.log(`⚠️ Failed to download baseline: ${error.message}`);
    }
    return false;
  }
}

async function captureScreenshot() {
  console.log("📸 Capturing homepage screenshot...");

  let browser;
  try {
    browser = await playwright.chromium.launch(CONFIG.playwright.launchOptions);
  } catch (error) {
    throw new Error(
      `Failed to launch browser: ${error.message}. Try 'npx playwright install chromium'`,
    );
  }

  const page = await browser.newPage();

  try {
    await page.setViewportSize(CONFIG.playwright.viewport);

    try {
      await page.goto(
        CONFIG.playwright.targetUrl,
        CONFIG.playwright.navigationOptions,
      );
    } catch (error) {
      throw new Error(
        `Failed to load page: ${error.message}. Is the server running?`,
      );
    }

    // Wait for page content to stabilize (animations, fonts, etc.)
    await page.waitForTimeout(CONFIG.timing.pageStabilizationMs);

    const currentPath = isCI
      ? CONFIG.paths.ciCurrentScreenshot
      : CONFIG.paths.currentScreenshot;

    // Ensure screenshot directory exists
    const dir = currentPath.substring(0, currentPath.lastIndexOf("/"));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({
      path: currentPath,
      ...CONFIG.playwright.screenshotOptions,
    });

    console.log(`✅ Screenshot saved to ${currentPath}`);
    return currentPath;
  } finally {
    await browser.close();
  }
}

async function compareImages(currentPath) {
  const baselinePath = isCI
    ? CONFIG.paths.ciBaselineScreenshot
    : CONFIG.paths.baselineScreenshot;

  if (!fs.existsSync(baselinePath)) {
    console.log("ℹ️ No baseline found - copying current as new baseline");

    // First run: establish the baseline for future comparisons
    if (isCI) {
      fs.copyFileSync(currentPath, CONFIG.paths.ciBaselineScreenshot);
    } else {
      fs.copyFileSync(currentPath, CONFIG.paths.baselineScreenshot);
    }
    return { isFirstRun: true };
  }

  console.log("🔍 Comparing with baseline...");

  let baselineImg, currentImg;
  try {
    baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
    currentImg = PNG.sync.read(fs.readFileSync(currentPath));
  } catch (error) {
    throw new Error(
      `Failed to read images: ${error.message}. Images may be corrupted.`,
    );
  }

  // Graceful handling of dimension differences
  if (
    baselineImg.width !== currentImg.width ||
    baselineImg.height !== currentImg.height
  ) {
    console.log(
      `⚠️ Image dimensions differ: baseline ${baselineImg.width}x${baselineImg.height} vs current ${currentImg.width}x${currentImg.height}`,
    );

    const widthDiff = Math.abs(baselineImg.width - currentImg.width);
    const heightDiff = Math.abs(baselineImg.height - currentImg.height);

    if (
      widthDiff <= CONFIG.comparison.dimensionTolerance &&
      heightDiff <= CONFIG.comparison.dimensionTolerance
    ) {
      console.log(
        `✅ Dimension difference within tolerance (${CONFIG.comparison.dimensionTolerance}px)`,
      );
      return { passed: true, dimensionChange: true };
    } else {
      console.log(
        `❌ Dimension difference too large (tolerance: ${CONFIG.comparison.dimensionTolerance}px)`,
      );
      return { passed: false, dimensionMismatch: true };
    }
  }

  const diff = new PNG({
    width: baselineImg.width,
    height: baselineImg.height,
  });

  let numDiffPixels;
  try {
    numDiffPixels = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      baselineImg.width,
      baselineImg.height,
      CONFIG.comparison.pixelmatchOptions,
    );
  } catch (error) {
    throw new Error(`Pixel comparison failed: ${error.message}`);
  }

  const totalPixels = baselineImg.width * baselineImg.height;
  const diffPercentage = (numDiffPixels / totalPixels) * 100;

  console.log(
    `📊 Pixel differences: ${numDiffPixels} / ${totalPixels} (${diffPercentage.toFixed(2)}%)`,
  );

  if (diffPercentage <= CONFIG.comparison.pixelThresholdPercent) {
    console.log(
      `✅ Visual test passed! (threshold: ${CONFIG.comparison.pixelThresholdPercent}%)`,
    );
    return { passed: true };
  } else {
    console.log(
      `❌ Visual test failed! Exceeds threshold of ${CONFIG.comparison.pixelThresholdPercent}%`,
    );

    const diffPath = isCI
      ? CONFIG.paths.ciDiffScreenshot
      : CONFIG.paths.diffScreenshot;

    try {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
      console.log(`💾 Diff image saved to ${diffPath}`);
    } catch (error) {
      console.log(`⚠️ Failed to save diff image: ${error.message}`);
    }

    return { passed: false, diffPercentage, diffPath };
  }
}

async function cleanupServer(server) {
  if (server && server.kill) {
    console.log("🧹 Stopping server...");
    server.kill();
    await new Promise((resolve) =>
      setTimeout(resolve, CONFIG.timing.serverShutdownMs),
    );
  }

  // Clean up PID file regardless of server process state
  if (fs.existsSync(CONFIG.server.pidFile)) {
    try {
      fs.unlinkSync(CONFIG.server.pidFile);
    } catch (error) {
      console.log(`⚠️ Failed to clean up PID file: ${error.message}`);
    }
  }
}

async function main() {
  let server;

  try {
    console.log(`🚀 Starting visual regression test (mode: ${mode})`);

    if (mode === "update") {
      console.log("🔄 Update mode: Creating new baseline...");

      server = await startServer();
      const currentPath = await captureScreenshot();

      if (isCI) {
        console.log("✅ New baseline captured in CI");
      } else {
        fs.copyFileSync(currentPath, CONFIG.paths.baselineScreenshot);
        console.log("✅ Baseline updated successfully");
      }

      await cleanupServer(server);
      return;
    }

    console.log("🧪 Test mode: Running visual regression test...");

    server = await startServer();

    try {
      await downloadBaseline();
      const currentPath = await captureScreenshot();
      const result = await compareImages(currentPath);

      if (result.isFirstRun) {
        console.log("🎉 First run completed - baseline established");
        process.exit(0);
      }

      if (result.passed) {
        console.log("🎉 Visual regression test passed!");
        process.exit(0);
      } else {
        console.log("💥 Visual regression test failed!");
        if (result.diffPercentage) {
          console.log(`   Difference: ${result.diffPercentage.toFixed(2)}%`);
        }
        if (result.diffPath) {
          console.log(`   Diff image: ${result.diffPath}`);
        }
        process.exit(1);
      }
    } finally {
      await cleanupServer(server);
    }
  } catch (error) {
    console.error("💥 Error:", error.message);

    // Provide helpful hints for common issues
    if (error.message.includes("node_modules")) {
      console.error("💡 Hint: Run 'npm install' to install dependencies");
    } else if (error.message.includes("Server failed to start")) {
      console.error(
        "💡 Hint: Check if port 8788 is available or another dev server is running",
      );
    } else if (error.message.includes("Failed to launch browser")) {
      console.error(
        "💡 Hint: Install Playwright browsers with 'npx playwright install chromium'",
      );
    } else if (error.message.includes("Failed to load page")) {
      console.error(
        "💡 Hint: Ensure your development server starts successfully",
      );
    }

    // Ensure cleanup even on error
    if (server) {
      await cleanupServer(server);
    }

    process.exit(1);
  }
}

main();
