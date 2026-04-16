"use client";

import { ReactNode } from "react";

/**
 * App-wide providers wrapper.
 * Previously included PayPalScriptProvider — removed when the platform
 * pivoted from direct checkout to an affiliate marketplace model.
 * Kept as a thin wrapper so future providers (theme, toasts, etc.) can plug in.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
