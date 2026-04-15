import { NextResponse } from "next/server";

// Arreglamos el error de sintaxis y dejamos el endpoint listo por si se necesita en el futuro.
// Si vas a usar Stripe, recordá configurar la KEY en .env.local
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Checkout request received", body);

    return NextResponse.json({ 
      message: "PayPal es el método de pago activo actualmente. Esta ruta está reservada para integraciones futuras.",
      status: "placeholder" 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
