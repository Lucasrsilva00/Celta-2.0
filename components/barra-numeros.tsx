"use client";

import { useEffect, useRef, useState } from "react";
import { movimentoReduzido } from "@/lib/animacao";
import { barraNumeros, type NumeroBarra } from "@/lib/conteudo";

function formatar(valor: number, formato: NumeroBarra["formato"]) {
  if (formato === "moeda") return `R$ ${valor.toLocaleString("pt-BR")}`;
  if (formato === "milhar") return valor.toLocaleString("pt-BR");
  if (formato === "decimal") {
    return valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return String(valor);
}

function Numero({ item, ativo }: { item: NumeroBarra; ativo: boolean }) {
  const [valor, setValor] = useState(item.numero ?? 0);

  useEffect(() => {
    const alvo = item.numero;
    if (!ativo || alvo === undefined) return;

    if (movimentoReduzido()) return;

    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const tempo = Math.min(1, (agora - inicio) / 1200);
      const aliviado = 1 - Math.pow(1 - tempo, 3);
      const bruto = alvo * aliviado;
      setValor(
        item.formato === "decimal"
          ? Math.round(bruto * 100) / 100
          : Math.round(bruto),
      );
      if (tempo < 1) quadro = requestAnimationFrame(passo);
    };

    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [ativo, item.numero, item.formato]);

  const texto =
    item.numero === undefined
      ? item.valor
      : `${formatar(valor, item.formato)}${item.sufixo ?? ""}`;

  return (
    <p className="numerico text-[clamp(24px,3.2vw,38px)] font-semibold leading-none tracking-[-0.02em] text-gelo">
      {item.numero === undefined ? texto : <span aria-hidden="true">{texto}</span>}
      {item.numero !== undefined && <span className="sr-only">{item.valor}</span>}
    </p>
  );
}

/**
 * Barra com os quatro números do carro, com contadores que sobem quando ela
 * entra na tela.
 */
export function BarraNumeros() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setAtivo(true);
          observador.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <section aria-label="Números do anúncio" className="pb-10 pt-4 md:pb-14">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={ref} className="relative">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.06] md:grid-cols-4">
            {barraNumeros.map((item) => (
              <div key={item.rotulo} className="bg-fumaca px-5 py-6 md:px-7 md:py-7">
                <dt className="sr-only">{item.rotulo}</dt>
                <dd>
                  <Numero item={item} ativo={ativo} />
                  <p
                    aria-hidden="true"
                    className="mt-2 text-[10px] uppercase tracking-[0.2em] text-grafite"
                  >
                    {item.rotulo}
                  </p>
                </dd>
              </div>
            ))}
          </dl>

          <a
            href="#galeria"
            aria-label="Descer para as fotos"
            className="chevron-baixo"
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
              <path d="M12 5v13" />
              <path d="M6 12.5l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
