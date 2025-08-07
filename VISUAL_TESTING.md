# Visual Regression Testing

Prevents UI regressions by comparing screenshots with baseline images.

## Quick Usage

```bash
# Test changes locally
npm run vis

# Approve intentional changes
npm run vis:update
git add visual-baselines/ && git commit -m "Update visual baseline"
```

## How It Works

1. Takes screenshot of homepage (1280x720, full page)
2. Compares with baseline image pixel-by-pixel
3. Fails if difference > 0.1% of pixels

## CI Behavior

- **✅ Pass**: Visual changes < 0.1%
- **❌ Fail**: Visual changes > 0.1%
- **📦 Artifacts**: Screenshots and diff images uploaded

## When CI Fails

1. Download artifacts from failed GitHub Action
2. Review `homepage-diff.png` to see changes
3. Fix bugs OR approve changes locally with `npm run vis:update`

## Configuration

- **Threshold**: 0.1% pixel difference
- **Viewport**: 1280x720 pixels
- **Anti-aliasing**: Ignored to reduce flakiness
- **Files**: `visual-baselines/homepage-baseline.png` (committed to git)
