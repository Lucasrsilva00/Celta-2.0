"use client";

import Image from "next/image";
import { anuncio, sobreCarro } from "@/lib/conteudo";
import { LetrasAnimadas } from "@/components/letras-animadas";
import { useRevelar } from "@/lib/revelar";

/** Card "Sobre o carro" — a mesma composição do bloco "About" do template. */
export function SobreCarro() {
  const raiz = useRevelar<HTMLDivElement>();
  const { foto } = sobreCarro;

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div
          ref={raiz}
          className="cartao grid items-center gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:p-10 lg:p-12"
        >
          <div>
            <p className="rotulo" data-revelar>
              {sobreCarro.rotulo}
            </p>

            <h2
              id="titulo-sobre"
              className="display-forte mt-4 text-[clamp(30px,4vw,54px)]"
            >
              <LetrasAnimadas texto={sobreCarro.titulo} />
            </h2>

            <p className="corpo mt-5 max-w-[52ch]" data-revelar>
              {sobreCarro.texto}
            </p>

            <dl
              className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
              data-revelar
            >
              {sobreCarro.numeros.map((numero) => (
                <div key={numero.rotulo}>
                  <dd className="numerico text-[clamp(22px,2.6vw,32px)] font-semibold leading-none text-gelo">
                    {numero.valor}
                  </dd>
                  <dt className="mt-2 text-[10px] uppercase tracking-[0.18em] text-grafite">
                    {numero.rotulo}
                  </dt>
                </div>
              ))}
            </dl>

            <a
              href={anuncio.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="pill mt-8"
              data-revelar
            >
              {sobreCarro.botao}
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
          </div>

          <figure data-revelar>
            <div className="foto-moldura aspect-[1.93]">
              <div className="foto-corte">
                <Image
                  src={`/galeria/${foto.arquivo}`}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 768px) 88vw, 540px"
                  className="object-cover"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.16em] text-grafite">
              {foto.rotulo}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
