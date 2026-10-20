"use client";

import Image from "next/image";
import { useState } from "react";
import { LetrasAnimadas } from "@/components/letras-animadas";
import { painelDestaque } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/**
 * Painel de destaque — o "carro grande no meio do painel claro" do template,
 * com a palavra vazada atrás, setas e a faixa de números embaixo.
 */
export function PainelDestaque() {
  const raiz = useRevelar<HTMLDivElement>();
  const [indice, setIndice] = useState(0);

  const total = painelDestaque.fotos.length;
  const foto = painelDestaque.fotos[indice];

  const ir = (passo: number) =>
    setIndice((atual) => (atual + passo + total) % total);

  return (
    <section
      id="destaque"
      aria-labelledby="titulo-destaque"
      className="secao scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {painelDestaque.rotulo}
              </p>
              <h2
                id="titulo-destaque"
                className="display-forte mt-4 max-w-[16ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={painelDestaque.titulo} />
              </h2>
            </div>
            <p
              className="corpo max-w-[44ch] md:text-right"
              data-revelar
            >
              {painelDestaque.descricao}
            </p>
          </header>

          <div className="painel mt-10 md:mt-14" data-revelar>
            <span className="painel-vazado display-forte" aria-hidden="true">
              {painelDestaque.palavra}
            </span>

            <div
              role="group"
              aria-roledescription="carrossel de fotos"
              aria-label="Fotos do carro no showroom"
              tabIndex={0}
              onKeyDown={(evento) => {
                if (evento.key === "ArrowLeft") {
                  evento.preventDefault();
                  ir(-1);
                }
                if (evento.key === "ArrowRight") {
                  evento.preventDefault();
                  ir(1);
                }
              }}
              className="relative rounded-[18px] outline-offset-4"
            >
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[720px] overflow-hidden rounded-[18px] border border-white/10 bg-preto">
                <Image
                  key={foto.arquivo}
                  src={`/galeria/${foto.arquivo}`}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 768px) 88vw, 720px"
                  className="object-cover"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-4">
                <button
                  type="button"
                  onClick={() => ir(-1)}
                  aria-label="Foto anterior"
                  className="seta-carrossel pointer-events-auto"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                    className="h-4 w-4"
                  >
                    <path d="M14.5 6l-6 6 6 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => ir(1)}
                  aria-label="Próxima foto"
                  className="seta-carrossel pointer-events-auto"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                    className="h-4 w-4"
                  >
                    <path d="M9.5 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>

            <p
              aria-live="polite"
              className="relative mx-auto mt-5 max-w-[720px] text-center text-[11px] uppercase tracking-[0.18em] text-grafite"
            >
              <span className="numerico text-gelo">
                {String(indice + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(total).padStart(2, "0")} · {foto.rotulo}
            </p>

            <dl className="relative mx-auto mt-7 grid max-w-[720px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
              {painelDestaque.faixa.map((item) => (
                <div key={item.chave} className="bg-preto/70 px-4 py-4 md:px-5">
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-grafite">
                    {item.chave}
                  </dt>
                  <dd className="mt-1 text-sm text-gelo">{item.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
