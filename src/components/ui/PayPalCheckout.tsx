"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  totalUSD: string;
  onSuccess: () => void;
  onError?: (err: unknown) => void;
}

export function PayPalCheckout({ totalUSD, onSuccess, onError }: PayPalCheckoutProps) {
  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "blue", shape: "rect", label: "checkout" }}
      createOrder={(_data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          application_context: {
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
          },
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: totalUSD,
              },
              description: "Compra en Tienda Inspire",
            },
          ],
        });
      }}
      onApprove={async (_data, actions) => {
        if (actions.order) {
          await actions.order.capture();
          onSuccess();
        }
      }}
      onError={(err) => {
        console.error("PayPal Error:", err);
        if (onError) onError(err);
        else alert("Hubo un error con el pago de PayPal. Por favor intenta de nuevo.");
      }}
    />
  );
}
