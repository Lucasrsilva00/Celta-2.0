"use client";

import { CalculadoraGasto } from "@/components/calculadora-gasto";
import { LetrasAnimadas } from "@/components/letras-animadas";
import {
  carro,
  fipe,
  fipeTexto,
  formatarMoeda,
  percentualAbaixoDaFipe,
  preco,
  rotulos,
  whatsappLinks,
} from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Seção de preço: selo FIPE honesto + calculadora de gasto mensal. */
export function PrecoFipe() {
  const raiz = useRevelar<HTMLDivElement>();

  const selo = carro.preco
    ? (() => {
        const percentual = percentualAbaixoDaFipe(carro.preco);
        if (percentual > 0) {
          return preco.selo.abaixo.replace("{percentual}", String(percentual));
        }
        if (percentual === 0) return preco.selo.igual;
        return null;
      })()
    : null;

  const linkWhats = whatsappLinks.testDrive;

  return (
    <section id="preco" aria-labelledby="titulo-preco" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {preco.rotulo}
              </p>
              <h2
                id="titulo-preco"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={preco.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[48ch] md:text-right" data-revelar>
              {preco.texto}
            </p>
          </header>

          <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-4">
            <div
              className="relative overflow-hidden rounded-[22px] border border-ouro/35 bg-fumaca p-6 md:p-8"
              data-revelar
            >
              <p className="rotulo text-ouro">{rotulos.fipe}</p>
              <p className="numerico mt-3 text-[clamp(38px,5vw,64px)] font-semibold leading-none text-gelo">
                {fipeTexto}
              </p>
              <p className="mt-3 text-sm text-nevoa">
                {fipe.versao} · código {fipe.codigo}
              </p>
              <p className="mt-1 text-xs text-grafite">
                Referência de {fipe.referenciaLabel}.
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="rotulo">Valor deste carro</p>
                <p className="display-forte mt-1 text-[clamp(24px,3vw,36px)]">
                  {carro.preco ? formatarMoeda(carro.preco) : rotulos.consultar}
                </p>
                {selo && (
                  <p className="mt-2 text-sm font-medium text-ouro">{selo}</p>
                )}
              </div>
            </div>

            <div
              className="flex flex-col justify-between gap-6 rounded-[22px] border border-white/10 bg-fumaca p-6 md:p-8"
              data-revelar
            >
              <p className="corpo">
                {carro.preco ? preco.comPrecoTexto : preco.semPrecoTexto}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                {linkWhats && (
                  <a
                    href={linkWhats}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill pill-ouro"
                  >
                    {rotulos.falarWhatsapp}
                  </a>
                )}
                <a href="#contato" className="pill">
                  {rotulos.agendar}
                </a>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-grafite" data-revelar>
            {preco.nota}
          </p>

          <CalculadoraGasto />
        </div>
      </div>
    </section>
  );
}
