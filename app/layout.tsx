import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
