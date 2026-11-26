# Nicholas Ferrara's Personal Website

Personal portfolio and contact site built with Remix and deployed on Cloudflare
Workers. The main branch is deployed to
[nicholasferrara.net](https://nicholasferrara.net).

## Quick Setup

```bash
git clone https://github.com/nickineering/nicholasferrara.net.git
cd nicholasferrara.net
npm install
npm run dev
```

Visit [localhost:8788](http://localhost:8788)

## Tech Stack

- **Remix** - Full-stack React framework with server-side rendering
- **Cloudflare Workers** - Server-side rendering at the edge, with static assets
  served by Workers static assets
- **TypeScript** - Type safety and better developer experience
- **Resend** - Email API for contact form

## Development

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Development server       |
| `npm run build` | Production build         |
| `npm run start` | Preview production build |
| `npm run lint`  | Fix formatting/linting   |
| `npm run types` | Check TypeScript errors  |

## Environment Variables

For contact form functionality:

```bash
cp .dev-example.vars .dev.vars
# Add RESEND_API_KEY for email sending
```

## Deployment

- **Main branch** → Auto-deploys to production via Cloudflare Workers Builds
  (`npm run build`, then `npx wrangler deploy`)
- **Other branches** → Preview versions with their own preview URL
- Manual deploy: `npm run deploy`

## Contributing

### Setup

```bash
git clone https://github.com/nickineering/nicholasferrara.net.git
npm install
npm run dev  # localhost:8788
```

### Visual Testing

For UI changes, the project includes visual regression testing:

```bash
npm run vis          # Test for visual changes
npm run vis:update   # Approve changes if intentional
```

See [VISUAL_TESTING.md](./VISUAL_TESTING.md) for details.
