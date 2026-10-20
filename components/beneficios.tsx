"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { Icone } from "@/components/icone";
import { beneficios } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Os quatro benefícios que resolvem as dores da seção anterior. */
export function Beneficios() {
  const raiz = useRevelar<HTMLDivElement>();

  return (
    <section
      id="beneficios"
      aria-labelledby="titulo-beneficios"
      className="secao scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {beneficios.rotulo}
              </p>
              <h2
                id="titulo-beneficios"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={beneficios.titulo} />
              </h2>
            </div>
            <a
              href="#preco"
              className="pill shrink-0 md:mb-1"
              data-revelar
            >
              Ver o preço
            </a>
          </header>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4">
            {beneficios.itens.map((item) => (
              <li key={item.titulo}>
                <article
                  className="group flex h-full items-start gap-4 rounded-[22px] border border-white/10 bg-fumaca p-6 transition-colors duration-300 hover:border-ouro/45 md:p-7"
                  data-revelar
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-ouro">
                    <Icone nome={item.icone} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold leading-snug text-gelo">
                      {item.titulo}
                    </h3>
                    <p className="corpo mt-2">{item.texto}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
