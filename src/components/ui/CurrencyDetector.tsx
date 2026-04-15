"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/stores/currencyStore";

/** Componente invisible — detecta la moneda del usuario al montar la app */
export function CurrencyDetector() {
  const detect = useCurrencyStore((state) => state.detect);

  useEffect(() => {
    detect();
  }, [detect]);

  return null;
}
