"use client";

import Image from "next/image";
import { AgendadorTestDrive } from "@/components/agendador-test-drive";
import { ContatoForm } from "@/components/contato-form";
import { LetrasAnimadas } from "@/components/letras-animadas";
import {
  bannerContato,
  chamadaFinal,
  contatoTexto,
  empresa,
  rodapeInfo,
  rotulos,
  whatsappLinks,
} from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Chamada final: formulário, agendador e WhatsApp — um único pedido repetido. */
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
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-preto via-preto/85 to-preto/50" />

          <div className="farois" aria-hidden="true">
            <span className="farol farol-esquerdo" />
            <span className="farol farol-direito" />
          </div>

          <div className="relative px-6 py-16 text-center md:px-16 md:py-20">
            <p className="rotulo">{chamadaFinal.rotulo}</p>

            <h2
              id="titulo-contato"
              className="reflexo display-forte mx-auto mt-4 inline-block max-w-[16ch] text-[clamp(34px,5.4vw,76px)]"
            >
              <LetrasAnimadas texto={chamadaFinal.titulo} />
            </h2>

            <p className="corpo mx-auto mt-5 max-w-[48ch]" data-revelar>
              {chamadaFinal.texto}
            </p>

            {whatsappLinks.testDrive && (
              <div className="mt-7 flex justify-center" data-revelar>
                <a
                  href={whatsappLinks.testDrive}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill pill-ouro"
                >
                  {chamadaFinal.whatsapp}
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
            )}
          </div>

          <div className="relative grid gap-4 px-6 pb-10 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:pb-12">
            {whatsappLinks.geral ? (
              <ContatoForm />
            ) : (
              <div className="rounded-[22px] border border-white/10 bg-preto/60 p-6 text-left backdrop-blur-md">
                <p className="corpo">{chamadaFinal.semWhatsapp}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <AgendadorTestDrive />

              <div className="rounded-[22px] border border-white/10 bg-preto/60 p-6 text-left backdrop-blur-md">
                <p className="rotulo">{rotulos.contatoDono}</p>
                <p className="mt-2 text-[17px] font-semibold text-gelo">
                  {empresa.nome}
                </p>
                <p className="numerico mt-1 text-sm text-nevoa">{contatoTexto}</p>
                <p className="mt-3 text-xs leading-relaxed text-grafite">
                  {empresa.endereco ?? rodapeInfo.enderecoFallback}
                  <br />
                  {empresa.horario ?? rodapeInfo.horarioFallback}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
