/**
 * Sistema de precios por región
 * Los precios internos están almacenados en centavos de USD.
 * Este módulo convierte al precio/moneda local del usuario.
 */

export interface CurrencyInfo {
  code: string;       // "DOP", "USD", "EUR", etc.
  symbol: string;     // "RD$", "$", "€"
  name: string;       // "Peso Dominicano"
  rate: number;       // tasa vs USD (1 USD = X moneda local)
  locale: string;     // para Intl.NumberFormat
}

// Tasas de cambio aproximadas (se actualizan dinámicamente si hay conexión)
// Base: 1 USD
export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  DO: { code: "DOP", symbol: "RD$", name: "Peso Dominicano",    rate: 59.5,  locale: "es-DO" },
  US: { code: "USD", symbol: "$",   name: "Dólar Americano",    rate: 1,     locale: "en-US" },
  PR: { code: "USD", symbol: "$",   name: "Dólar Americano",    rate: 1,     locale: "es-PR" },
  MX: { code: "MXN", symbol: "$",   name: "Peso Mexicano",      rate: 17.2,  locale: "es-MX" },
  CO: { code: "COP", symbol: "$",   name: "Peso Colombiano",    rate: 3950,  locale: "es-CO" },
  VE: { code: "USD", symbol: "$",   name: "Dólar Americano",    rate: 1,     locale: "es-VE" },
  GT: { code: "GTQ", symbol: "Q",   name: "Quetzal",            rate: 7.75,  locale: "es-GT" },
  PA: { code: "USD", symbol: "$",   name: "Balboa/USD",         rate: 1,     locale: "es-PA" },
  CR: { code: "CRC", symbol: "₡",   name: "Colón Costarricense",rate: 515,   locale: "es-CR" },
  HN: { code: "HNL", symbol: "L",   name: "Lempira",            rate: 24.7,  locale: "es-HN" },
  SV: { code: "USD", symbol: "$",   name: "Dólar Americano",    rate: 1,     locale: "es-SV" },
  NI: { code: "NIO", symbol: "C$",  name: "Córdoba",            rate: 36.5,  locale: "es-NI" },
  PE: { code: "PEN", symbol: "S/",  name: "Sol Peruano",        rate: 3.72,  locale: "es-PE" },
  CL: { code: "CLP", symbol: "$",   name: "Peso Chileno",       rate: 930,   locale: "es-CL" },
  AR: { code: "ARS", symbol: "$",   name: "Peso Argentino",     rate: 890,   locale: "es-AR" },
  EC: { code: "USD", symbol: "$",   name: "Dólar Americano",    rate: 1,     locale: "es-EC" },
  BO: { code: "BOB", symbol: "Bs.", name: "Boliviano",          rate: 6.91,  locale: "es-BO" },
  PY: { code: "PYG", symbol: "₲",   name: "Guaraní",            rate: 7300,  locale: "es-PY" },
  UY: { code: "UYU", symbol: "$",   name: "Peso Uruguayo",      rate: 39,    locale: "es-UY" },
  ES: { code: "EUR", symbol: "€",   name: "Euro",               rate: 0.92,  locale: "es-ES" },
  CA: { code: "CAD", symbol: "CA$", name: "Dólar Canadiense",   rate: 1.36,  locale: "en-CA" },
  GB: { code: "GBP", symbol: "£",   name: "Libra Esterlina",    rate: 0.79,  locale: "en-GB" },
};

export const DEFAULT_CURRENCY: CurrencyInfo = CURRENCY_MAP["DO"]; // Default RD (República Dominicana)

/** Convierte centavos USD al precio local formateado */
export function formatLocalPrice(cents: number, currency: CurrencyInfo): string {
  const usd = cents / 100;
  const localAmount = usd * currency.rate;

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: localAmount >= 100 ? 0 : 2,
      maximumFractionDigits: localAmount >= 100 ? 0 : 2,
    }).format(localAmount);
  } catch {
    // Fallback si el locale no está soportado
    return `${currency.symbol}${localAmount.toFixed(localAmount >= 100 ? 0 : 2)}`;
  }
}

/** Sincroniza los rates contra una API en tiempo real y suma 1 peso de comisión/arriba */
export async function syncLatestRates(): Promise<void> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(3000)
    });
    if (!res.ok) return;

    const data = await res.json();
    const rates = data?.rates;
    if (!rates) return;

    // Actualizamos el mapa en memoria
    for (const key of Object.keys(CURRENCY_MAP)) {
      const code = CURRENCY_MAP[key].code;
      if (code !== "USD" && rates[code]) {
        // REQUERIMIENTO: agregar 1 unidad de la moneda (ej: 1 DOP, 1 MXN) como margen
        // Esto es "un peso por arriba", no 1%
        CURRENCY_MAP[key].rate = rates[code] + 1;
      }
    }
  } catch {
    // Si falla, silenciosamente cae en los rates por defecto (fallback seguro)
  }
}

/** Detecta la moneda del usuario por su IP */
export async function detectUserCurrency(): Promise<CurrencyInfo> {
  // 1. Primero actualizamos los rates de todas las monedas + 1
  await syncLatestRates();

  try {
    // 2. Buscamos el país del usuario
    const res = await fetch("https://ipapi.co/json/", { 
      signal: AbortSignal.timeout(3000) // 3 segundos max
    });
    if (!res.ok) return { ...CURRENCY_MAP["DO"] };

    const data = await res.json();
    const countryCode: string = data?.country_code ?? "DO";
    
    // Retornamos un clon para forzar la actualización de estado en React/Zustand
    return { ...(CURRENCY_MAP[countryCode] ?? CURRENCY_MAP["DO"]) };
  } catch {
    return { ...CURRENCY_MAP["DO"] };
  }
}
