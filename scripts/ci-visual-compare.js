import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const baselinePath = "baseline-screenshots/homepage-baseline.png";
const currentPath = "temp-screenshots/homepage-current.png";
const diffPath = "temp-screenshots/homepage-diff.png";

if (!fs.existsSync(baselinePath)) {
  console.log("ℹ️ No baseline - initial run");
  process.exit(0);
}

const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
const img2 = PNG.sync.read(fs.readFileSync(currentPath));

// Handle dimension mismatches more gracefully
if (img2.width !== img1.width || img2.height !== img1.height) {
  console.log(`⚠️ Image dimensions differ:`);
  console.log(`  Baseline: ${img1.width}x${img1.height}`);
  console.log(`  Current:  ${img2.width}x${img2.height}`);

  // Check if it's a reasonable difference (height changes are common due to content)
  const widthDiff = Math.abs(img2.width - img1.width);
  const heightDiff = Math.abs(img2.height - img1.height);

  // Allow width differences up to 10px and height differences up to 200px
  if (widthDiff > 10) {
    console.log(
      `❌ Width difference too large: ${widthDiff}px (max 10px allowed)`,
    );
    process.exit(1);
  }

  if (heightDiff > 200) {
    console.log(
      `❌ Height difference too large: ${heightDiff}px (max 200px allowed)`,
    );
    console.log(
      "📝 Significant layout changes detected. Update baseline if intentional:",
    );
    console.log("   npm run vis:update");
    process.exit(1);
  }

  console.log(
    `✅ Dimension difference acceptable (${widthDiff}px width, ${heightDiff}px height)`,
  );

  // Crop or pad images to same size for comparison
  const targetWidth = Math.max(img1.width, img2.width);
  const targetHeight = Math.max(img1.height, img2.height);

  // Create padded versions of both images
  const paddedImg1 = new PNG({ width: targetWidth, height: targetHeight });
  const paddedImg2 = new PNG({ width: targetWidth, height: targetHeight });

  // Fill with white background
  paddedImg1.data.fill(255);
  paddedImg2.data.fill(255);

  // Copy original images into padded versions
  PNG.bitblt(img1, paddedImg1, 0, 0, img1.width, img1.height, 0, 0);
  PNG.bitblt(img2, paddedImg2, 0, 0, img2.width, img2.height, 0, 0);

  // Use padded images for comparison
  img1.data = paddedImg1.data;
  img1.width = targetWidth;
  img1.height = targetHeight;
  img2.data = paddedImg2.data;
  img2.width = targetWidth;
  img2.height = targetHeight;
}

const diff = new PNG({ width: img1.width, height: img1.height });
const numDiffPixels = pixelmatch(
  img1.data,
  img2.data,
  diff.data,
  img1.width,
  img1.height,
  {
    threshold: 0.2,
    includeAA: false,
  },
);

fs.writeFileSync(diffPath, PNG.sync.write(diff));

const diffPercentage = (numDiffPixels / (img1.width * img1.height)) * 100;
console.log(`📊 Comparison complete:`);
console.log(`   Image size: ${img1.width}x${img1.height}`);
console.log(`   Different pixels: ${numDiffPixels.toLocaleString()}`);
console.log(`   Difference: ${diffPercentage.toFixed(2)}%`);

if (diffPercentage > 0.1) {
  console.log("❌ Visual changes detected");
  console.log("Run: npm run vis:update if this change was intentional");
  process.exit(1);
}

console.log("✅ Visual test passed");
