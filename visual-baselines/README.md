# Visual Test Baselines

This directory contains reference screenshots used for visual regression
testing.

## 📸 Current Baselines

- `homepage-baseline.png` - Reference image for homepage appearance (tracked in
  git)

## 🗂️ Temporary Files (Not Tracked)

- `homepage-current.png` - Current screenshot during testing
- `homepage-diff.png` - Difference visualization when tests fail

## 🔄 Updating Baselines

When you make intentional visual changes:

```bash
# Update the reference images
npm run vis:update

# Commit the changes
git add visual-baselines/
git commit -m "Update visual baseline after design changes"
```

## ⚠️ Important

- **These files are tracked in git** - they represent the "correct" appearance
- **Don't edit manually** - always use the npm script to update
- **Review carefully** - these become the new standard for comparison
