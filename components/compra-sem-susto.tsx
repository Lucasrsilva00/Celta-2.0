"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { compraSemSusto, rotulos } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/**
 * Redução de risco: só afirma o que foi confirmado pelo vendedor.
 * O checklist de test drive fica disponível para levar na visita.
 */
export function CompraSemSusto() {
  const raiz = useRevelar<HTMLDivElement>();
  const confirmados = compraSemSusto.itens.filter((item) => item.confirmado);
  const { checklist } = compraSemSusto;

  return (
    <section id="compra" aria-labelledby="titulo-compra" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {compraSemSusto.rotulo}
              </p>
              <h2
                id="titulo-compra"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={compraSemSusto.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[46ch] md:text-right" data-revelar>
              {compraSemSusto.frase}
            </p>
          </header>

          <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[1fr_1fr] md:gap-4">
            <div
              className="rounded-[22px] border border-white/10 bg-fumaca p-6 md:p-8"
              data-revelar
            >
              <h3 className="text-[17px] font-semibold text-gelo">
                {checklist.titulo}
              </h3>
              <p className="corpo mt-2">{checklist.descricao}</p>

              <details className="pergunta mt-5 border-t border-white/10 pt-4">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 text-sm font-medium text-gelo">
                  {checklist.verItens}
                  <span className="pergunta-icone text-ouro" aria-hidden="true">
                    +
                  </span>
                </summary>
                <ol className="mt-3 space-y-2 pl-5 text-sm leading-relaxed text-nevoa">
                  {checklist.itens.map((item) => (
                    <li key={item} className="list-decimal">
                      {item}
                    </li>
                  ))}
                </ol>
              </details>

              <a
                href={checklist.arquivo}
                download
                className="pill mt-5 w-full sm:w-auto"
              >
                {checklist.baixar}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                >
                  <path d="M12 4v11" />
                  <path d="M7.5 10.5L12 15l4.5-4.5" />
                  <path d="M5 20h14" />
                </svg>
              </a>
            </div>

            <div
              className="flex flex-col justify-between rounded-[22px] border border-white/10 bg-fumaca p-6 md:p-8"
              data-revelar
            >
              <div>
                <h3 className="text-[17px] font-semibold text-gelo">
                  {compraSemSusto.combinacoesTitulo}
                </h3>
                <p className="corpo mt-2">{compraSemSusto.observacao}</p>

                {confirmados.length > 0 && (
                  <ul className="mt-5 space-y-3 border-t border-white/10 pt-5">
                    {confirmados.map((item) => (
                      <li key={item.id} className="flex items-start gap-3 text-sm text-nevoa">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          focusable="false"
                          className="mt-0.5 h-4 w-4 shrink-0 text-ouro"
                        >
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                        {item.texto}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <a href="#contato" className="pill pill-ouro mt-6 w-full sm:w-auto">
                {rotulos.agendar}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
