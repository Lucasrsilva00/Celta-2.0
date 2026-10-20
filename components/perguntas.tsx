"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { linkWhatsApp, perguntas } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Objeções em forma de perguntas. Resposta confirmada aparece; sem confirmação, "Consultar". */
export function Perguntas() {
  const raiz = useRevelar<HTMLDivElement>();

  return (
    <section
      id="perguntas"
      aria-labelledby="titulo-perguntas"
      className="secao scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-[980px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {perguntas.rotulo}
              </p>
              <h2
                id="titulo-perguntas"
                className="display-forte mt-4 text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={perguntas.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[42ch] md:text-right" data-revelar>
              {perguntas.descricao}
            </p>
          </header>

          <div className="mt-10 border-t border-white/10 md:mt-14" data-revelar>
            {perguntas.itens.map((item) => {
              const mensagem = `Olá! Sobre o Celta LT 2012: ${item.pergunta}`;
              const link = linkWhatsApp(mensagem);

              return (
                <details key={item.pergunta} className="pergunta group">
                  <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-4 text-left text-[16px] font-medium text-gelo">
                    {item.pergunta}
                    <span className="pergunta-icone shrink-0 text-ouro" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <div className="pb-5 pr-10 text-sm leading-relaxed text-nevoa">
                    <p>{item.resposta ?? "Consultar"}</p>
                    {!item.resposta && (
                      <p className="mt-2 text-grafite">{perguntas.fallback}</p>
                    )}
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-ouro underline-offset-4 hover:underline"
                      >
                        {perguntas.link}
                      </a>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
