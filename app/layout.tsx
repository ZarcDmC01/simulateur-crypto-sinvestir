import type { Metadata } from "next";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Simulateur Crypto | S'investir",
  description:
    "Simulez vos investissements en crypto-monnaie (DCA, one-shot) sur données historiques. Bitcoin, Ethereum et +7000 cryptos.",
  openGraph: {
    title: "Simulateur Crypto | S'investir",
    description: "Calculez vos gains potentiels sur des cryptomonnaies avec notre simulateur DCA.",
    siteName: "S'investir Simulateurs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${lexend.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
