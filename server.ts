import { logDevReady } from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  getLoadContext: (context) => ({ env: context.env }),
  mode: build.mode,
});
