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

if (img2.width !== img1.width || img2.height !== img1.height) {
  console.log("❌ Image dimensions mismatch");
  process.exit(1);
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
console.log(`📊 Difference: ${diffPercentage.toFixed(2)}%`);

if (diffPercentage > 0.1) {
  console.log("❌ Visual changes detected");
  console.log("Run: npm run vis:update if this change was intentional");
  process.exit(1);
}

console.log("✅ Visual test passed");
