import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { WalletModalProvider } from "@/components/wallet/WalletButton";
import { ChainPulseProvider } from "@/lib/chain";

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-spacemono", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-inter-var", display: "swap" });

const title = `${BRAND.name} (${BRAND.symbol}) — ${BRAND.slogan}`;

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: { default: title, template: `%s · ${BRAND.name}` },
  description: BRAND.description,
  keywords: ["Nearduck", BRAND.symbol, "Robinhood Chain", "meme token", "duck"],
  openGraph: {
    type: "website",
    url: BRAND.url,
    siteName: BRAND.name,
    title,
    description: BRAND.description,
    images: [{ url: "/brand/og.webp", width: 1200, height: 630, alt: `${BRAND.name} banner` }],
  },
  twitter: {
    card: "summary_large_image",
    site: BRAND.xHandle,
    title,
    description: BRAND.description,
    images: ["/brand/og.webp"],
  },
};

export const viewport: Viewport = { themeColor: "#0b0806" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${grotesk.variable} ${mono.variable} ${inter.variable}`}>
      <body className="min-h-dvh overflow-x-hidden font-sans antialiased">
        <ChainPulseProvider>
          <WalletProvider>
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ChainPulseProvider>
      </body>
    </html>
  );
}
