import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: { default: "WallDecor99 — Premium Wallpapers & Custom Murals", template: "%s | WallDecor99" },
  description: "Shop premium wallpaper rolls, create made-to-measure murals, calculate quantities and visualize your wall with WallDecor99.",
  metadataBase: new URL("https://walldecor99.in"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
