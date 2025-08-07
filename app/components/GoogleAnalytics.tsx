import { useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import * as gtag from "~/util/gtags.client";

interface GoogleAnalyticsProps {
  gaTrackingId?: string;
}

export default function GoogleAnalytics({
  gaTrackingId,
}: GoogleAnalyticsProps) {
  return (
    <ClientOnly>
      <GoogleAnalyticsClient gaTrackingId={gaTrackingId} />
    </ClientOnly>
  );
}

function GoogleAnalyticsClient({ gaTrackingId }: GoogleAnalyticsProps) {
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsDisabled(params.has("disableAnalytics"));
  }, [location.search]);

  useEffect(() => {
    if (gaTrackingId && !isDisabled) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId, isDisabled]);

  if (!gaTrackingId || isDisabled) {
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
