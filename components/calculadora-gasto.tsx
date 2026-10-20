"use client";

import { useState } from "react";
import { formatarMoeda, numerosCarro, preco } from "@/lib/conteudo";

const cfg = preco.calculadora;

function paraNumero(texto: string): number {
  const valor = Number(texto.replace(",", "."));
  return Number.isFinite(valor) ? valor : 0;
}

/**
 * Calculadora de gasto mensal com os consumos da ficha técnica.
 * Regra do etanol: compensa quando preço do etanol ÷ gasolina fica abaixo de
 * 0,71 (cidade) ou 0,68 (estrada) — aqui ponderado pela % de cidade.
 */
export function CalculadoraGasto() {
  const [km, setKm] = useState(1000);
  const [gasolina, setGasolina] = useState(6.19);
  const [etanol, setEtanol] = useState(4.29);
  const [cidade, setCidade] = useState(70);

  const fracCidade = Math.min(100, Math.max(0, cidade)) / 100;

  const consumo = (combustivel: "gasolina" | "etanol") => {
    const { cidade: cidadeConsumo, estrada } = numerosCarro.consumo;
    return (
      1 /
      (fracCidade / cidadeConsumo[combustivel] +
        (1 - fracCidade) / estrada[combustivel])
    );
  };

  const valido = km > 0 && gasolina > 0 && etanol > 0;
  const custoGasolina = valido ? (km / consumo("gasolina")) * gasolina : 0;
  const custoEtanol = valido ? (km / consumo("etanol")) * etanol : 0;
  const limite = fracCidade * 0.71 + (1 - fracCidade) * 0.68;
  const compensa = etanol <= gasolina * limite ? "etanol" : "gasolina";

  const resultado = cfg.resultado
    .replace("{gasolina}", formatarMoeda(custoGasolina))
    .replace("{etanol}", formatarMoeda(custoEtanol))
    .replace("{combustivel}", compensa);

  return (
    <div className="mt-10 rounded-[22px] border border-white/10 bg-fumaca p-6 md:mt-12 md:p-8">
      <h3 className="display-forte text-[clamp(22px,2.6vw,32px)]">{cfg.titulo}</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-2">
          <span className="rotulo">{cfg.km}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={km}
            onChange={(evento) => setKm(paraNumero(evento.target.value))}
            className="campo"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">{cfg.gasolina}</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={gasolina}
            onChange={(evento) => setGasolina(paraNumero(evento.target.value))}
            className="campo"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">{cfg.etanol}</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step={0.01}
            value={etanol}
            onChange={(evento) => setEtanol(paraNumero(evento.target.value))}
            className="campo"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">
            {cfg.cidade}: <span className="numerico text-gelo">{cidade}%</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={cidade}
            onChange={(evento) => setCidade(paraNumero(evento.target.value))}
            className="range-ouro mt-3"
          />
        </label>
      </div>

      <p
        aria-live="polite"
        className="mt-6 text-[15px] leading-relaxed text-gelo md:text-base"
      >
        {valido
          ? resultado
          : cfg.incompleto}
      </p>

      <p className="mt-3 text-xs text-grafite">{cfg.aviso}</p>
    </div>
  );
}
