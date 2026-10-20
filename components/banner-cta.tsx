"use client";

import Image from "next/image";
import { LetrasAnimadas } from "@/components/letras-animadas";
import {
  anuncio,
  bannerContato,
  chamadaFinal,
  contatoTexto,
  rotulos,
} from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Banner de encerramento — o "Be Part of the Nio Community" do template. */
export function BannerCta() {
  const raiz = useRevelar<HTMLDivElement>();

  return (
    <section id="contato" aria-labelledby="titulo-contato" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div
          ref={raiz}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-fumaca"
        >
          <Image
            src={bannerContato.foto}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1240px"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-preto via-preto/80 to-preto/40" />

          <div className="relative px-6 py-16 text-center md:px-16 md:py-24">
            <p className="rotulo">{bannerContato.rotulo}</p>

            <h2
              id="titulo-contato"
              className="display-forte mx-auto mt-4 max-w-[14ch] text-[clamp(34px,5.4vw,76px)]"
            >
              <LetrasAnimadas texto={chamadaFinal.titulo} />
            </h2>

            <p className="corpo mx-auto mt-5 max-w-[46ch]" data-revelar>
              {chamadaFinal.subtitulo}
            </p>

            <div className="mt-8 flex justify-center" data-revelar>
              <a
                href={anuncio.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-ouro"
              >
                {chamadaFinal.principal}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                >
                  <path d="M5 12h13" />
                  <path d="M12.5 6l6 6-6 6" />
                </svg>
                <span className="sr-only">{rotulos.abreWhatsApp}</span>
              </a>
            </div>

            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-grafite">
              {contatoTexto}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
