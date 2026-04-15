import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { CartSidebar } from "@/components/ui/CartSidebar";
import { CurrencyDetector } from "@/components/ui/CurrencyDetector";
import { Providers } from "@/components/providers/Providers";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inspire - Productos Naturales",
  description: "Tu tienda de productos naturales seleccionados con cuidado para tu bienestar y el del planeta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('[Layout] RootLayout rendered');
  return (
    <html lang="es" className={inter.variable}>
      <body 
        className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiosed"
        suppressHydrationWarning
      >
        <Providers>
          <CurrencyDetector />
          <Header />
          <main className="flex-1 pt-[72px] sm:pt-[104px]">
            {children}
          </main>
          <Footer />
          {/* <CartSidebar /> */}
        </Providers>
      </body>
    </html>
  );
}
