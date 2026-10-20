import type { Metadata } from "next";
import { Archivo, Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/* Endereço final do site: o Vercel injeta VERCEL_URL no build. */
const enderecoSite = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://celta-2-0.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(enderecoSite),
  title: "Celta 2.0 | Chevrolet Celta LT 1.0 Flex 2012 preto — Sanderscarr",
  description:
    "Celta LT 1.0 Flex 2012 preto, 4 portas, com 15 fotos reais, tabela FIPE, calculadora de gasto e checklist de test drive. Agende seu test drive com a Sanderscarr.",
  applicationName: "Celta 2.0",
  authors: [{ name: "Sanderscarr" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Celta 2.0 | Celta LT 1.0 Flex 2012 preto — Sanderscarr",
    description:
      "Compacto, flex e fácil de manter. Veja as 15 fotos, compare com a FIPE e agende um test drive sem compromisso.",
    locale: "pt_BR",
    type: "website",
    url: enderecoSite,
    images: [
      {
        url: "/videos/celta-promocional-capa.webp",
        width: 1280,
        height: 720,
        alt: "Chevrolet Celta LT 1.0 Flex 2012 preto — capa do vídeo do anúncio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celta 2.0 | Celta LT 1.0 Flex 2012 preto — Sanderscarr",
    description:
      "Compacto, flex e fácil de manter. Veja as 15 fotos, compare com a FIPE e agende um test drive sem compromisso.",
    images: ["/videos/celta-promocional-capa.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${archivo.variable}`}>
      <body className="bg-preto text-gelo antialiased">{children}</body>
    </html>
  );
}
