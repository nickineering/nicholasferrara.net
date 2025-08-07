import type { ReactNode } from "react";
import { useIsClient } from "~/hooks/useIsClient";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client-side.
 * This helps prevent hydration mismatches for components that
 * behave differently on server vs client.
 *
 * @param children - The content to render only on client-side
 * @param fallback - Optional fallback content to render on server-side
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useIsClient();

  return isClient ? children : fallback;
}
