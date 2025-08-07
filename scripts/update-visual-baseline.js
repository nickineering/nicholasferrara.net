#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import { chromium } from "playwright";

console.log("🎨 Visual Baseline Update Tool");
console.log("===============================");

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

async function captureBaseline() {
  console.log("📸 Capturing baseline screenshot...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("http://localhost:8788/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    if (!fs.existsSync("visual-baselines")) {
      fs.mkdirSync("visual-baselines");
    }

    await page.screenshot({
      path: "visual-baselines/homepage-baseline.png",
      fullPage: true,
    });

    console.log("✅ Baseline screenshot captured");
  } finally {
    await browser.close();
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

    // Capture baseline
    await captureBaseline();

    console.log("");
    console.log("✅ Baseline updated! Commit with:");
    console.log(
      '   git add visual-baselines/ && git commit -m "Update visual baseline"',
    );
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
