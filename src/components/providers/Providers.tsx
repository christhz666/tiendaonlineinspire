"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ReactNode } from "react";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
  currency: "USD",
  intent: "capture",
};

export function Providers({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.error("CRITICAL: NEXT_PUBLIC_PAYPAL_CLIENT_ID is missing from environment variables.");
  }

  return (
    <PayPalScriptProvider 
      options={{
        clientId: clientId || "MISSING_CLIENT_ID",
        currency: "USD",
        intent: "capture",
        "data-sdk-integration-source": "button-factory",
        components: "buttons",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
