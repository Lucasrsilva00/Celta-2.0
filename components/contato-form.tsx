"use client";

import { useState } from "react";
import { chamadaFinal, linkWhatsApp } from "@/lib/conteudo";

type Estado = "inicial" | "erro" | "enviado";

/**
 * Formulário sem backend: valida no cliente e abre o WhatsApp já com a mensagem.
 * Nada é armazenado no site — o texto abaixo do formulário diz isso.
 */
export function ContatoForm() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [estado, setEstado] = useState<Estado>("inicial");
  const [erro, setErro] = useState("");

  const enviar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    if (nome.trim().length < 2) {
      setErro(chamadaFinal.form.erroNome);
      setEstado("erro");
      return;
    }

    const digitos = telefone.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 13) {
      setErro(chamadaFinal.form.erroTelefone);
      setEstado("erro");
      return;
    }

    const texto = [
      "Olá! Vi o Celta LT 2012 no site.",
      `Meu nome é ${nome.trim()}.`,
      `Telefone: ${telefone.trim()}.`,
      mensagem.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    const link = linkWhatsApp(texto);
    if (!link) {
      setErro(chamadaFinal.form.erro);
      setEstado("erro");
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
    setErro("");
    setEstado("enviado");
  };

  return (
    <form
      onSubmit={enviar}
      className="rounded-[22px] border border-white/10 bg-preto/60 p-6 text-left backdrop-blur-md md:p-8"
    >
      <h3 className="text-[17px] font-semibold text-gelo">{chamadaFinal.principal}</h3>

      <div className="mt-5 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="rotulo">{chamadaFinal.form.nome}</span>
          <input
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            className="campo"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">{chamadaFinal.form.telefone}</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={telefone}
            onChange={(evento) => setTelefone(evento.target.value)}
            className="campo"
            required
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="rotulo">{chamadaFinal.form.mensagem}</span>
          <textarea
            rows={3}
            value={mensagem}
            onChange={(evento) => setMensagem(evento.target.value)}
            className="campo resize-none"
          />
        </label>
      </div>

      <button type="submit" className="pill pill-ouro mt-5 w-full">
        {chamadaFinal.form.enviar}
      </button>

      <p className="mt-3 text-[11px] leading-relaxed text-grafite">
        {chamadaFinal.form.nota}
      </p>

      <div aria-live="polite" className="text-sm">
        {estado === "erro" && <p className="mt-3 text-ouro">{erro}</p>}
        {estado === "enviado" && (
          <p className="mt-3 text-nevoa">{chamadaFinal.form.sucesso}</p>
        )}
      </div>
    </form>
  );
}
