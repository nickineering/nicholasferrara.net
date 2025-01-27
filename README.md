# [nicholasferrara.net](nicholasferrara.net) source code

Sending email locally requires adding a Resend API key to a file at root called
`dev.vars`. An example is available in `dev-example.vars`. The key deployed in
Cloudflare can be updated via `npx wrangler secret put RESEND_API_KEY` once
`dev.vars` has the new key.
