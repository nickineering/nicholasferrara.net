import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { ClientOnly } from "./components/ClientOnly";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Env } from "./types/Env";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.red.min.css",
  },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = ({
  context,
}: LoaderFunctionArgs & { context: { env: Env } }) => {
  return { gaTrackingId: context.env.GA_TRACKING_ID };
};

export default function App() {
  const { gaTrackingId } = useLoaderData<typeof loader>();

  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <GoogleAnalytics gaTrackingId={gaTrackingId} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <ClientOnly>
          <LiveReload />
        </ClientOnly>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  const title = notFound ? "Page not found" : "Something went wrong";

  if (!notFound) {
    console.error(error);
  }

  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${title} - Nicholas Ferrara`}</title>
        <meta name="robots" content="noindex" />
        <Links />
      </head>
      <body>
        <main className="container" style={{ paddingTop: "2rem" }}>
          <h1>{title}</h1>
          <p>
            {notFound
              ? "The page you are looking for does not exist."
              : "Please try again in a moment."}
          </p>
          <p>
            <a href="/">Go to the home page</a>
          </p>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
