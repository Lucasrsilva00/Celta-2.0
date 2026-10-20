"use client";

import { LetrasAnimadas } from "@/components/letras-animadas";
import { quiz, rotulos, whatsappLinks } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";
import { useState } from "react";

/** Quiz honesto de 3 perguntas: o resultado sempre termina no test drive. */
export function QuizCompatibilidade() {
  const raiz = useRevelar<HTMLDivElement>();
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [enviado, setEnviado] = useState(false);

  const completo = quiz.perguntas.every(
    (pergunta) => respostas[pergunta.id] !== undefined,
  );

  const pontos = quiz.perguntas.reduce((total, pergunta) => {
    const indice = respostas[pergunta.id];
    if (indice === undefined) return total;
    return total + pergunta.opcoes[indice].pontos;
  }, 0);

  const resultado =
    quiz.resultados.find((opcao) => pontos >= opcao.minimo) ??
    quiz.resultados[quiz.resultados.length - 1];

  const responder = (id: string, indice: number) => {
    setRespostas((anteriores) => ({ ...anteriores, [id]: indice }));
    setEnviado(false);
  };

  return (
    <section id="quiz" aria-labelledby="titulo-quiz" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[980px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {quiz.rotulo}
              </p>
              <h2
                id="titulo-quiz"
                className="display-forte mt-4 text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={quiz.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[42ch] md:text-right" data-revelar>
              {quiz.descricao}
            </p>
          </header>

          <form
            className="mt-10 space-y-6 rounded-[22px] border border-white/10 bg-fumaca p-6 md:mt-14 md:p-8"
            data-revelar
            onSubmit={(evento) => {
              evento.preventDefault();
              if (completo) setEnviado(true);
            }}
          >
            {quiz.perguntas.map((pergunta) => (
              <fieldset key={pergunta.id}>
                <legend className="text-[16px] font-medium text-gelo">
                  {pergunta.pergunta}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {pergunta.opcoes.map((opcao, indice) => {
                    const marcada = respostas[pergunta.id] === indice;
                    return (
                      <label
                        key={opcao.rotulo}
                        className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-sm transition-colors duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-ouro ${
                          marcada
                            ? "border-ouro bg-ouro/15 text-gelo"
                            : "border-white/15 text-nevoa hover:border-ouro/50 hover:text-gelo"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${pergunta.id}`}
                          value={indice}
                          checked={marcada}
                          onChange={() => responder(pergunta.id, indice)}
                          className="sr-only"
                        />
                        {opcao.rotulo}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <button
                type="submit"
                disabled={!completo}
                className="pill pill-ouro disabled:cursor-not-allowed disabled:opacity-40"
              >
                {quiz.botao}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRespostas({});
                  setEnviado(false);
                }}
                className="pill"
              >
                {quiz.refazer}
              </button>
            </div>

            <div aria-live="polite" className="min-h-[1px]">
              {enviado && (
                <div className="rounded-[16px] border border-ouro/40 bg-ouro/[0.07] p-5 md:p-6">
                  <p className="display-forte text-[clamp(22px,3vw,32px)] text-ouro">
                    {resultado.titulo}
                  </p>
                  <p className="corpo mt-2">{resultado.texto}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="#contato" className="pill pill-ouro">
                      {rotulos.agendar}
                    </a>
                    {whatsappLinks.testDrive && (
                      <a
                        href={whatsappLinks.testDrive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill"
                      >
                        {rotulos.falarWhatsapp}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
