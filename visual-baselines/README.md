# Visual Baselines

This directory contains baseline screenshots used for visual regression testing.

## Files

- `homepage-baseline.png` - Baseline screenshot of the homepage

## Usage

To update the visual baselines after making intentional visual changes:

```bash
npm run update-visual-baseline
```

This will:

1. Build the application
2. Start the server
3. Capture new screenshots
4. Save them as baselines

After running the command, commit the updated baseline files:

```bash
git add visual-baselines/
git commit -m "Update visual baseline"
git push
```

The GitHub Actions workflow will then use these baselines for comparison.
