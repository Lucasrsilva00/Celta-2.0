"use client";

import { useState } from "react";
import { chamadaFinal, linkWhatsApp } from "@/lib/conteudo";

/** Monta a mensagem de test drive com dia e período — sem agenda falsa. */
export function AgendadorTestDrive() {
  const cfg = chamadaFinal.agendador;
  const [dia, setDia] = useState("");
  const [periodo, setPeriodo] = useState(cfg.periodos[0]);
  const [erro, setErro] = useState("");

  const enviar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (!dia) {
      setErro(cfg.erroDia);
      return;
    }

    const data = new Date(`${dia}T12:00:00`);
    const dataFormatada = data.toLocaleDateString("pt-BR");
    const texto = cfg.mensagem
      .replace("{dia}", dataFormatada)
      .replace("{periodo}", periodo.toLowerCase());

    const link = linkWhatsApp(texto);
    if (!link) {
      setErro(cfg.erroWhatsapp);
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
    setErro("");
  };

  return (
    <form
      onSubmit={enviar}
      className="rounded-[22px] border border-white/10 bg-preto/60 p-6 text-left backdrop-blur-md md:p-8"
    >
      <h3 className="text-[17px] font-semibold text-gelo">{cfg.titulo}</h3>
      <p className="corpo mt-2">{cfg.texto}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="rotulo">{cfg.dia}</span>
          <input
            type="date"
            value={dia}
            onChange={(evento) => setDia(evento.target.value)}
            className="campo"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">{cfg.periodo}</span>
          <select
            value={periodo}
            onChange={(evento) => setPeriodo(evento.target.value)}
            className="campo"
          >
            {cfg.periodos.map((opcao) => (
              <option key={opcao} value={opcao} className="bg-preto">
                {opcao}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="pill mt-5 w-full">
        {cfg.botao}
      </button>

      <p aria-live="polite" className="mt-3 text-sm text-ouro">
        {erro}
      </p>
    </form>
  );
}
