import { useEffect, useState } from "react";

/**
 * Custom hook to determine if we're on the client-side.
 * Returns false during SSR and the first render on client,
 * then true after hydration completes.
 *
 * This helps prevent hydration mismatches for components
 * that behave differently on server vs client.
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
