# Visual Regression Testing Setup

This project now includes comprehensive visual regression testing to catch
unintended UI changes.

## How it Works

### 🤖 Automated Testing (GitHub Actions)

- **Startup Test**: Verifies the app starts without errors
- **Visual Regression Test**: Compares homepage screenshots with baselines
- **Runs on**: Every push and pull request

### 📸 Visual Comparison Process

1. Takes a screenshot of the homepage (1280x720, full page)
2. Compares with the stored baseline using pixel-perfect matching
3. Fails if differences exceed 0.1% of pixels
4. Creates a diff image showing the changes

### ✅ Approving Visual Changes

When you make **intentional** visual changes:

1. **Test your changes locally** (optional but recommended):

   ```bash
   npm run visual-test
   ```

2. **Update the baseline**:

   ```bash
   npm run update-visual-baseline
   ```

3. **Review the new baseline**:
   - Check `visual-baselines/homepage-baseline.png`
   - Ensure it looks correct

4. **Commit and push**:
   ```bash
   git add visual-baselines/
   git commit -m "Update visual baseline after [description of changes]"
   git push
   ```

### 🛠️ Development Workflow

- **`npm run visual-test`** - Quick visual check during development
  - Builds app, takes screenshot, compares with baseline
  - Shows differences without updating baseline
  - Creates temp files in `temp-screenshots/` for review

- **`npm run update-visual-baseline`** - Update official baseline
  - Use when you're ready to approve visual changes
  - Updates the git-tracked baseline files

### 🔍 When Tests Fail

If the visual test fails unexpectedly:

1. **Download the artifacts** from the failed GitHub Action
2. **Review the diff image** to see what changed
3. **If changes are intentional**: Run `npm run update-visual-baseline`
4. **If changes are bugs**: Fix the issue and test again

### 📁 File Structure

```
visual-baselines/           # Baseline screenshots (tracked in git)
├── homepage-baseline.png   # Homepage baseline
└── README.md              # Documentation

scripts/
└── update-visual-baseline.js  # Local baseline update tool

.github/workflows/
└── startup-test.yml        # CI workflow with visual testing
```

### ⚙️ Configuration

- **Sensitivity**: 0.1% pixel difference threshold
- **Viewport**: 1280x720 pixels
- **Anti-aliasing**: Ignored to reduce flaky tests
- **Full Page**: Captures entire page, not just viewport

### 🚀 Benefits

- **Catch regressions**: Automatically detect unintended visual changes
- **Safe deployment**: Prevent broken UI from reaching production
- **Change tracking**: Visual history of your application
- **Fast feedback**: Know immediately if something looks wrong
