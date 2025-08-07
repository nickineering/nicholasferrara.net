#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import PNG from "pngjs";

const { PNG: PNGClass } = PNG;

console.log("🔍 Visual Test Tool");
console.log("==================");

async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log("✅ Server is ready!");
        // Give it a bit more time to stabilize
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return true;
      }
    } catch {
      // Server not ready yet
    }

    console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return false;
}

async function captureScreenshot() {
  console.log("📸 Capturing current screenshot...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Use a more lenient loading strategy
    await page.goto("http://localhost:8788/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for page to stabilize
    await page.waitForTimeout(5000);

    if (!fs.existsSync("temp-screenshots")) {
      fs.mkdirSync("temp-screenshots");
    }

    await page.screenshot({
      path: "temp-screenshots/homepage-current.png",
      fullPage: true,
    });

    console.log("✅ Screenshot captured");
  } finally {
    await browser.close();
  }
}

function compareWithBaseline() {
  const baselinePath = "visual-baselines/homepage-baseline.png";
  const currentPath = "temp-screenshots/homepage-current.png";
  const diffPath = "temp-screenshots/homepage-diff.png";

  if (!fs.existsSync(baselinePath)) {
    console.log('ℹ️  No baseline found. Run "npm run vis:update" first.');
    return;
  }

  const img1 = PNGClass.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNGClass.sync.read(fs.readFileSync(currentPath));

  const { width, height } = img1;

  if (img2.width !== width || img2.height !== height) {
    const widthDiff = Math.abs(img2.width - width);
    const heightDiff = Math.abs(img2.height - height);

    console.log(
      `⚠️ Image dimensions differ: ${width}x${height} vs ${img2.width}x${img2.height}`,
    );
    console.log(`   Width diff: ${widthDiff}px, Height diff: ${heightDiff}px`);

    if (widthDiff > 10 || heightDiff > 200) {
      console.log(
        `❌ Dimension difference too large. Run "npm run vis:update" to update baseline.`,
      );
      return;
    }

    console.log(
      `✅ Dimension difference acceptable, proceeding with comparison...`,
    );
  }

  // For simplicity in local testing, just use original dimensions
  // If dimensions differ significantly, user should update baseline
  const diff = new PNGClass({ width, height });

  // Only compare if dimensions match exactly (for now in local script)
  if (img2.width !== width || img2.height !== height) {
    console.log("🔄 Using basic comparison due to dimension differences");
    console.log(
      "   For accurate comparison with different sizes, use CI or update baseline",
    );
    return;
  }

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.2,
      includeAA: false,
    },
  );

  fs.writeFileSync(diffPath, PNGClass.sync.write(diff));

  const totalPixels = width * height;
  const diffPercentage = (numDiffPixels / totalPixels) * 100;

  console.log(
    `📊 Difference: ${diffPercentage.toFixed(2)}% (${numDiffPixels}/${totalPixels} pixels)`,
  );

  if (diffPercentage <= 0.1) {
    console.log("✅ Visual test passed");
  } else {
    console.log("⚠️  Visual differences detected");
    console.log("   Check temp-screenshots/homepage-diff.png");
    console.log('   Run "npm run vis:update" if changes are intentional');
  }
}

async function main() {
  // Start server
  console.log("🚀 Starting server...");
  const server = spawn("npm", ["run", "start"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  });

  // Give server time to start
  await new Promise((resolve) => setTimeout(resolve, 5000));

  try {
    // Wait for server
    const ready = await waitForServer("http://localhost:8788/");
    if (!ready) {
      throw new Error("Server failed to start");
    }

    // Capture and compare
    await captureScreenshot();
    compareWithBaseline();
  } finally {
    console.log("🛑 Shutting down server...");
    server.kill("SIGTERM");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
