"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LetrasAnimadas } from "@/components/letras-animadas";
import { fotosDoCarro, pastaFotos } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/**
 * A pasta de fotos: fechada mostra só uma prévia; ao abrir, a tampa sobe e as
 * 15 fotos ficam disponíveis em uma foto grande por vez, com abas por região.
 *
 * Assim a página não vira um mural de fotos — e as partes do carro continuam
 * todas acessíveis, com foco no que está sendo olhado.
 */
export function PastaFotos() {
  const raiz = useRevelar<HTMLDivElement>();
  const [aberta, setAberta] = useState(false);
  const [aba, setAba] = useState<(typeof pastaFotos.abas)[number]>("Todas");
  const [indice, setIndice] = useState(0);

  const botaoAbrirRef = useRef<HTMLButtonElement | null>(null);
  const interiorRef = useRef<HTMLDivElement | null>(null);
  const primeiraRenderizacao = useRef(true);

  const filtradas =
    aba === "Todas"
      ? fotosDoCarro
      : fotosDoCarro.filter((foto) => foto.regiao === aba);

  const total = filtradas.length;
  const atual = filtradas[Math.min(indice, total - 1)] ?? fotosDoCarro[0];

  useEffect(() => {
    if (!aberta) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAberta(false);
    };

    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberta]);

  // leva o foco para dentro da pasta ao abrir e o devolve ao botão ao fechar —
  // depois do React tirar/colocar o `inert`, senão o foco é recusado
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }

    if (aberta) interiorRef.current?.focus({ preventScroll: true });
    else botaoAbrirRef.current?.focus();
  }, [aberta]);

  const abrir = () => setAberta(true);

  const fechar = () => setAberta(false);

  const ir = (passo: number) =>
    setIndice((anterior) => (anterior + passo + total) % total);

  const escolherAba = (nova: (typeof pastaFotos.abas)[number]) => {
    setAba(nova);
    setIndice(0);
  };

  const previas = [fotosDoCarro[1], fotosDoCarro[8], fotosDoCarro[10]];

  return (
    <section
      id="fotos"
      aria-labelledby="titulo-pasta"
      className="secao scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {pastaFotos.rotulo}
              </p>
              <h2
                id="titulo-pasta"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={pastaFotos.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[46ch] md:text-right" data-revelar>
              {pastaFotos.descricao}
            </p>
          </header>

          <div className="pasta mt-12 md:mt-16" data-revelar data-aberta={aberta}>
            <div className="pasta-aba" aria-hidden="true">
              <span className="text-[10px] uppercase tracking-[0.28em] text-grafite">
                {pastaFotos.aba}
              </span>
            </div>

            <div className="pasta-corpo">
              {/* tampa: só a prévia e o botão de abrir */}
              <div className="pasta-capa" inert={aberta}>
                <div>
                  <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:p-10">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-grafite">
                        Exterior · Interior · Motor · Detalhes
                      </p>
                      <p className="display-forte mt-3 text-[clamp(24px,3vw,40px)]">
                        {pastaFotos.capaTitulo}
                      </p>
                      <p className="corpo mt-3 max-w-[44ch]">
                        {pastaFotos.capaTexto}
                      </p>

                      <button
                        ref={botaoAbrirRef}
                        type="button"
                        onClick={abrir}
                        aria-expanded={aberta}
                        aria-controls="conteudo-pasta"
                        className="pill pill-ouro mt-6"
                      >
                        {pastaFotos.abrir}
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
                      </button>
                    </div>

                    <div className="relative aspect-[16/10] w-full">
                      {previas.map((foto, posicao) => (
                        <div
                          key={foto.arquivo}
                          className="absolute left-1/2 top-1/2 w-[64%] overflow-hidden rounded-xl border border-white/15 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
                          style={{
                            transform: `translate(-50%, -50%) rotate(${(posicao - 1) * 7}deg) translateX(${(posicao - 1) * 26}%)`,
                            zIndex: posicao === 1 ? 3 : 1,
                          }}
                        >
                          <div className="relative aspect-[16/10]">
                            <Image
                              src={`/galeria/${foto.arquivo}`}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 46vw, 240px"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* interior: a pasta aberta */}
              <div
                id="conteudo-pasta"
                ref={interiorRef}
                tabIndex={-1}
                role="region"
                aria-label="Fotos do carro"
                inert={!aberta}
                className="pasta-interior"
              >
                <div>
                  <div className="border-t border-white/10 p-5 md:p-8">
                    <div className="flex items-center gap-3">
                      <div
                        role="group"
                        aria-label="Filtrar as fotos por parte do carro"
                        className="abas-rolagem flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0"
                      >
                        {pastaFotos.abas.map((opcao) => {
                          const ativa = opcao === aba;
                          return (
                            <button
                              key={opcao}
                              type="button"
                              onClick={() => escolherAba(opcao)}
                              aria-pressed={ativa}
                              className={`aba shrink-0 ${ativa ? "aba-ativa" : ""}`}
                            >
                              {opcao}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={fechar}
                        aria-label={pastaFotos.fechar}
                        className="pill pill-compacto shrink-0"
                      >
                        <span className="hidden md:inline">{pastaFotos.fechar}</span>
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
                          <path d="M6 6l12 12" />
                          <path d="M18 6L6 18" />
                        </svg>
                      </button>
                    </div>

                    <div
                      role="group"
                      aria-roledescription="foto em destaque"
                      aria-label="Foto escolhida"
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
                      className="relative mt-6 rounded-2xl outline-offset-4"
                    >
                      <div className="relative mx-auto aspect-[4/3] w-full max-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-preto md:aspect-[16/9]">
                        <Image
                          key={atual.arquivo}
                          src={`/galeria/${atual.arquivo}`}
                          alt={atual.alt}
                          fill
                          sizes="(max-width: 768px) 88vw, 760px"
                          className="object-contain"
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:-inset-x-3 md:px-0">
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

                    <div className="pasta-legenda mx-auto mt-5 flex max-w-[760px] flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-gelo">
                          {atual.rotulo}
                          <span className="text-grafite"> · {atual.regiao}</span>
                        </p>
                        <p className="mt-1 max-w-[52ch] text-[13px] leading-snug text-nevoa">
                          {atual.nota}
                        </p>
                      </div>
                      <p
                        aria-live="polite"
                        className="numerico shrink-0 text-[11px] uppercase tracking-[0.18em] text-grafite"
                      >
                        {String(Math.min(indice, total - 1) + 1).padStart(2, "0")}
                        {" / "}
                        {String(total).padStart(2, "0")}
                      </p>
                    </div>

                    <ul
                      aria-label="Todas as fotos desta parte"
                      className="mt-5 flex gap-2 overflow-x-auto pb-2"
                    >
                      {filtradas.map((foto, posicao) => (
                        <li key={foto.arquivo} className="shrink-0">
                          <button
                            type="button"
                            onClick={() => setIndice(posicao)}
                            aria-label={`Ver ${foto.rotulo}`}
                            aria-current={posicao === indice ? "true" : undefined}
                            className={`miniatura ${posicao === indice ? "miniatura-ativa" : ""}`}
                          >
                            <Image
                              src={`/galeria/${foto.arquivo}`}
                              alt=""
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
