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

export const metadata: Metadata = {
  title: "Celta 2012 à venda — 1.0 Flex, 4 portas",
  description:
    "Celta 2012 LT 1.0 Flex, 4 portas, com documentação em dia. Anúncio particular: fotos, estado do carro, valor e contato direto no WhatsApp.",
  openGraph: {
    title: "Celta 2012 à venda — 1.0 Flex, 4 portas",
    description:
      "Compacto econômico e confiável, pronto para o dia a dia. Veja o estado, os detalhes e fale direto com o dono.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${archivo.variable}`}>
      <body className="bg-preto text-gelo antialiased">{children}</body>
    </html>
  );
}
