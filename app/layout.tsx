import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nayo — Wear It. Taste It. Love It.",
  description:
    "A luxury lifestyle brand celebrating African heritage through fashion, food, and culture. Wear it. Taste it. Love it.",
  keywords: "Nayo, luxury fashion, African food, cultural accessories, lifestyle brand",
  openGraph: {
    title: "Nayo — Wear It. Taste It. Love It.",
    description:
      "A luxury lifestyle brand celebrating African heritage through fashion, food, and culture. Wear it. Taste it. Love it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${inter.variable}`}>
      <body className="bg-nayo-black text-nayo-white antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
