import { createRequestHandler, logDevReady } from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";
import { handleContactForm } from "~/server/contactForm";
import { Env } from "~/types/Env";
import { withSecurityHeaders } from "~/server/securityHeaders";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

const handleRemixRequest = createRequestHandler(build, build.mode);

// Static files in ./public (including /build/*) are served by Workers static
// assets before this Worker runs, so only dynamic requests reach here.
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact_form") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "POST" },
        });
      }
      return withSecurityHeaders(await handleContactForm(request, env));
    }

    const response = await handleRemixRequest(request, { env });
    return withSecurityHeaders(response);
  },
};
