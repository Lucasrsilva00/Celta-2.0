import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* Publicação estática no Netlify: gera /out com HTML/CSS/JS puros. */
  output: "export",
  /* O loader padrão de imagens exige servidor; usar <img> otimizado pelo código. */
  images: { unoptimized: true },
  /* cacheComponents e partialPrefetching exigem servidor (PPR) e são
     incompatíveis com output: "export" — devem voltar se sair do modo export. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
