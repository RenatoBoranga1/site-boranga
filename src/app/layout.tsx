import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "BORANGA | Licor Extra Luxo de Jabuticaba",
  description:
    "Descubra a experiência BORANGA: história, ritual, harmonização e detalhes de uma edição especial de licor de jabuticaba.",
  applicationName: "BORANGA",
  keywords: [
    "BORANGA",
    "licor de jabuticaba",
    "licor extra luxo",
    "jabuticaba",
    "edição especial",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "BORANGA",
    title: "BORANGA | Licor Extra Luxo de Jabuticaba",
    description:
      "História, ritual e detalhes de uma edição especial criada para momentos extraordinários.",
    images: [
      {
        url: "/images/og-boranga.jpg",
        width: 1200,
        height: 630,
        alt: "Garrafa BORANGA — Licor Extra Luxo de Jabuticaba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BORANGA | Licor Extra Luxo de Jabuticaba",
    description: "Mais que um licor. Uma experiência.",
    images: ["/images/og-boranga.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070504",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
