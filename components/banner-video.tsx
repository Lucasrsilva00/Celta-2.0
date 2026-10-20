"use client";

import { useCallback, useRef, useState } from "react";
import { LetrasAnimadas } from "@/components/letras-animadas";
import { anuncio, rotulos, videoPromocional } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/**
 * Faixa de vídeo promocional (o "NIO Power Swap" do template).
 *
 * - O arquivo fica em public/videos (H.264 + áudio, com a marca d'água de
 *   terceiros removida e uma faixa de legendas descritivas ao lado).
 * - `preload="none"`: nada é baixado até a pessoa tocar no play.
 * - Sem autoplay: áudio só toca com a interação dela.
 */
export function BannerVideo() {
  const raiz = useRevelar<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [tocando, setTocando] = useState(false);

  const iniciar = useCallback(() => {
    setTocando(true);
    // o play precisa sair do mesmo gesto do usuário para o áudio ser liberado
    void videoRef.current?.play().catch(() => undefined);
  }, []);

  return (
    <section
      ref={raiz}
      id="video"
      aria-labelledby="titulo-video"
      className="secao scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <header
          data-revelar
          className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <div>
            <p className="rotulo">
              {rotulos.videoPromocional} · {videoPromocional.duracao} ·{" "}
              {rotulos.comSom.toLowerCase()}
            </p>
            <h2
              id="titulo-video"
              className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
            >
              <LetrasAnimadas texto={videoPromocional.titulo} />
            </h2>
          </div>
          <p className="corpo max-w-[44ch] md:text-right">
            {videoPromocional.subtitulo}
          </p>
        </header>

        <figure data-revelar className="mt-10 md:mt-14">
          <div className="banner-moldura aspect-video">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              controls={tocando}
              preload="none"
              playsInline
              poster={videoPromocional.capa}
              aria-label={`${rotulos.assistirVideo} do Chevrolet ${anuncio.modelo} ${anuncio.ano}, ${videoPromocional.duracao}, ${rotulos.comSom.toLowerCase()}`}
            >
              <source src={videoPromocional.arquivo} type="video/mp4" />
              <track
                kind="captions"
                src="/videos/celta-promocional.vtt"
                srcLang="pt-BR"
                label="Descrição do vídeo"
              />
              Seu navegador não reproduz vídeo.{" "}
              <a href={videoPromocional.arquivo}>Abrir o arquivo do vídeo</a>.
            </video>

            {!tocando && (
              <button
                type="button"
                onClick={iniciar}
                className="banner-clique absolute inset-0 z-10 flex items-center justify-center"
              >
                <span className="banner-veu" aria-hidden="true" />

                <span className="relative block">
                  <span className="play-halo" aria-hidden="true" />
                  <span className="play-botao">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      className="h-6 w-6 translate-x-[2px] md:h-7 md:w-7"
                    >
                      <path d="M8.2 4.9v14.2L19.4 12z" />
                    </svg>
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 md:inset-x-6 md:bottom-6"
                >
                  <span className="rounded-full border border-white/15 bg-preto/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gelo backdrop-blur-sm">
                    {videoPromocional.duracao}
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-white/15 bg-preto/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-gelo backdrop-blur-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                      className="h-3.5 w-3.5 text-ouro"
                    >
                      <path d="M4 9.5h3l4.5-3.6v12.2L7 14.5H4z" />
                      <path d="M15.5 9.4a3.6 3.6 0 0 1 0 5.2" />
                      <path d="M18 6.8a7.2 7.2 0 0 1 0 10.4" />
                    </svg>
                    {rotulos.comSom}
                  </span>
                </span>

                <span className="sr-only">
                  Assistir ao vídeo promocional do {anuncio.modelo} {anuncio.ano} —{" "}
                  {videoPromocional.duracao}, com áudio
                </span>
              </button>
            )}
          </div>

          <figcaption className="mt-5 flex flex-col gap-6 md:mt-6 md:flex-row md:items-start md:justify-between md:gap-12">
            <div className="max-w-[62ch]">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-gelo">
                {videoPromocional.legendaTitulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-nevoa">
                {videoPromocional.legenda}
              </p>
            </div>

            <a
              href={anuncio.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="pill shrink-0"
            >
              {videoPromocional.botao}
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
              <span className="sr-only"> — abre conversa no WhatsApp</span>
            </a>
          </figcaption>

          <noscript>
            <p className="mt-4 text-sm text-nevoa">
              <a href={videoPromocional.arquivo} className="underline">
                Abrir o vídeo promocional do {anuncio.modelo} {anuncio.ano} (MP4,{" "}
                {videoPromocional.duracao})
              </a>
            </p>
          </noscript>
        </figure>
      </div>
    </section>
  );
}
