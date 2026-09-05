import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";

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
      <body className="bg-nayo-white text-nayo-black antialiased">
        <Script
          id="nayo-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var p=location.pathname;if(p!=="/"&&p!=="")return;try{if(!sessionStorage.getItem("nayo_loader_seen")){document.documentElement.classList.add("nayo-loading")}}catch(e){document.documentElement.classList.add("nayo-loading")}})();`,
          }}
        />
        <noscript>
          <style>{`html.nayo-loading #nayo-boot-cover{display:none!important}html.nayo-loading .nayo-home{visibility:visible!important;pointer-events:auto}`}</style>
        </noscript>
        <div id="nayo-boot-cover" aria-hidden="true" />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
