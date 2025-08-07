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
        return true;
      }
    } catch {
      // Continue trying
    }

    console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return false;
}

async function captureScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("http://localhost:8788/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

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
    console.log(
      'ℹ️  No baseline found. Run "npm run update-visual-baseline" first.',
    );
    return;
  }

  const img1 = PNGClass.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNGClass.sync.read(fs.readFileSync(currentPath));

  const { width, height } = img1;

  if (img2.width !== width || img2.height !== height) {
    console.log(
      `❌ Image dimensions don't match: ${width}x${height} vs ${img2.width}x${img2.height}`,
    );
    return;
  }

  const diff = new PNGClass({ width, height });
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
    console.log(
      '   Run "npm run update-visual-baseline" if changes are intentional',
    );
  }
}

async function main() {
  // Start server
  console.log("🚀 Starting server...");
  const server = spawn("npm", ["run", "start"], { stdio: "pipe" });

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
    server.kill();
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
