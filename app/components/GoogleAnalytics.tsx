import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import * as gtag from "~/util/gtags.client";

interface GoogleAnalyticsProps {
  gaTrackingId?: string;
}

export default function GoogleAnalytics({
  gaTrackingId,
}: GoogleAnalyticsProps) {
  const location = useLocation();

  useEffect(() => {
    if (gaTrackingId) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  const params = new URLSearchParams(location.search);
  const isDisabled = params.has("disableAnalytics");

  if (process.env.NODE_ENV === "development" || !gaTrackingId || isDisabled) {
    console.warn("Analytics are disabled");
    return null;
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
      />
      <script
        async
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaTrackingId}', {
                page_path: window.location.pathname,
            });
            `,
        }}
      />
    </>
  );
}
