# Copilot Instructions

This is Nicholas Ferrara's personal portfolio site built with Remix and deployed
on Cloudflare Workers.

## Architecture Overview

**Deployment Pattern**: The app is a single Cloudflare Worker with static
assets, where:

- Main app renders at the edge via `server.ts` using `createRequestHandler` from
  `@remix-run/cloudflare`
- `/api/contact_form` is handled in `server.ts` before Remix, by
  `app/server/contactForm.tsx`
- Static assets in `public/` are served by Workers static assets before the
  Worker runs (`public/_headers` sets their headers)
- Environment-specific bindings are injected via the `Env` type

**Key Files**:

- `server.ts` - Worker entry point
- `remix.config.js` - Configures edge-compatible build settings
- `wrangler.toml` - Cloudflare deployment configuration
- `app/server/contactForm.tsx` - Contact form handler
- `app/server/securityHeaders.ts` - CSP and other headers for Worker responses

## Development Workflow

**Server Commands**:

- `npm run dev` - Starts Remix in manual mode + `wrangler dev` on port 8788
- `npm run start` - Production preview via Wrangler only
- Visual testing: `npm run vis` (test) / `npm run vis:update` (approve changes)

**Critical Dependencies**:

- Environment variables in `.dev.vars` (copy from `.dev-example.vars`)
- Playwright browsers: `npx playwright install chromium` for visual tests
- Node 18+ required for Cloudflare Workers compatibility

## Project-Specific Patterns

**Environment Context Pattern**:

```tsx
// Loaders receive Cloudflare bindings via context
export const loader = ({ context }: LoaderFunctionArgs) => {
  return { apiKey: (context.env as Env).SOME_API_KEY };
};
```

**Client-Only Hydration**: Use `<ClientOnly>` wrapper for browser-only
components to prevent SSR mismatches.

**Form Handling**: Contact form uses native HTML forms with Turnstile CAPTCHA,
posting to `/api/contact_form` serverless function.

**Email Architecture**: Uses React Email templates with Resend API, with
development mode defaulting to safe test addresses.

## Visual Regression Testing

**Critical Workflow**: This project has comprehensive visual testing that runs
on every PR:

- Baseline images stored in `visual-baselines/` directory (git-tracked)
- `scripts/visual-regression.js` handles both local and CI testing with unified
  logic
- Updates require explicit approval via `npm run vis:update`
- CI downloads baselines from GitHub, compares screenshots, uploads artifacts

**Configuration**: All visual test settings centralized in `CONFIG` object in
the script.

## Cloudflare-Specific Considerations

**Build Configuration**: `remix.config.js` includes Cloudflare-specific
settings:

- `serverConditions: ["workerd", "worker", "browser"]` for edge compatibility
- `serverDependenciesToBundle: "all"` to include all deps in edge bundle
- Output goes to `build/worker/index.js`, the `main` in `wrangler.toml`

**Styling**: Uses Pico CSS framework with dark theme, CSS modules for component
styles.

## Code Standards

**Philosophy**: Prioritize simplicity and maintainability over complexity.
Refactor continuously to avoid technical debt. Adjust project-wide configs
rather than adding ignore patterns.

**Comments**: Only add comments that explain non-obvious context or complex
business logic - avoid restating what code already makes clear.
