"use client";

import { useEffect, useRef } from "react";
import { movimentoReduzido, observar } from "@/lib/animacao";

type Props = {
  texto: string;
  className?: string;
  /** intervalo entre uma letra e a próxima (ms) */
  passo?: number;
};

/**
 * Título que entra letra por letra: cada letra sobe, aproxima (scale) e sai do
 * desfoque. O texto completo fica em `sr-only`, então leitores de tela leem a
 * frase inteira em vez de soletrar.
 *
 * Sem JavaScript o título aparece normal — a animação só é "armada" no cliente.
 */
export function LetrasAnimadas({ texto, className, passo = 26 }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const caixa = el.getBoundingClientRect();
    const jaNaTela = caixa.top < window.innerHeight * 0.92;

    el.classList.add("letras-armadas");

    if (jaNaTela || movimentoReduzido()) {
      el.classList.add("letras-visiveis");
      return;
    }

    observar(el, "letras-visiveis");
  }, []);

  // cada palavra guarda o índice global da primeira letra (para o escalonamento)
  const palavras = texto.split(" ").map((palavra, indice, todas) => ({
    palavra,
    base: todas.slice(0, indice).reduce((total, anterior) => total + anterior.length + 1, 0),
  }));

  return (
    <span ref={ref} className={`letras ${className ?? ""}`.trim()}>
      <span className="sr-only">{texto}</span>

      <span aria-hidden="true" className="letras-visual">
        {palavras.map(({ palavra, base }) => (
          <span key={`${palavra}-${base}`} className="letra-palavra">
            {Array.from(palavra).map((letra, indice) => (
              <span
                key={`${letra}-${indice}`}
                className="letra-animada"
                style={{ transitionDelay: `${(base + indice) * passo}ms` }}
              >
                {letra}
              </span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}
