"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { Icone } from "@/components/icone";
import { dores } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Seção de identificação: as quatro dores de quem procura um carro simples. */
export function Dores() {
  const raiz = useRevelar<HTMLDivElement>();

  return (
    <section id="dores" aria-labelledby="titulo-dores" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {dores.rotulo}
              </p>
              <h2
                id="titulo-dores"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={dores.titulo} />
              </h2>
            </div>
          </header>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4">
            {dores.itens.map((item) => (
              <li
                key={item.texto}
                className="flex items-start gap-4 rounded-[18px] border border-white/10 bg-fumaca p-5 md:p-6"
                data-revelar
              >
                <Icone nome={item.icone} className="mt-0.5 h-6 w-6 shrink-0 text-ouro" />
                <p className="text-[15px] leading-relaxed text-nevoa">{item.texto}</p>
              </li>
            ))}
          </ul>

          <p
            className="display-forte mt-10 text-center text-[clamp(22px,3vw,34px)]"
            data-revelar
          >
            {dores.fecho}
          </p>
        </div>
      </div>
    </section>
  );
}
