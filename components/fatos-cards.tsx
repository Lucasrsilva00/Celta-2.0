"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { fatosDestaque } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Os três cards escuros do template — aqui com os fatos que decidem a compra. */
export function FatosCards() {
  const raiz = useRevelar<HTMLDivElement>();

  return (
    <section id="fatos" aria-labelledby="titulo-fatos" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {fatosDestaque.rotulo}
              </p>
              <h2
                id="titulo-fatos"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={fatosDestaque.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[46ch] md:text-right" data-revelar>
              {fatosDestaque.descricao}
            </p>
          </header>

          <ul className="mt-10 grid gap-3 md:mt-14 md:grid-cols-3 md:gap-4">
            {fatosDestaque.itens.map((item) => (
              <li key={item.etiqueta}>
                <article
                  className="group flex h-full flex-col rounded-[22px] border border-white/10 bg-fumaca p-6 transition-colors duration-300 hover:border-ouro/45 md:p-7"
                  data-revelar
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-grafite">
                    {item.etiqueta}
                  </p>
                  <h3 className="mt-4 text-[19px] font-semibold leading-snug text-gelo">
                    {item.titulo}
                  </h3>
                  <p className="corpo mt-3">{item.texto}</p>

                  <span
                    aria-hidden="true"
                    className="mt-auto inline-grid h-10 w-10 translate-y-1 place-items-center self-end rounded-full border border-white/15 text-gelo transition-all duration-300 group-hover:translate-y-0 group-hover:border-ouro/60 group-hover:text-ouro"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      focusable="false"
                      className="h-4 w-4"
                    >
                      <path d="M5 12h13" />
                      <path d="M12.5 6l6 6-6 6" />
                    </svg>
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
