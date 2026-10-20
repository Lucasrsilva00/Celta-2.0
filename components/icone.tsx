import type { ReactNode } from "react";

/**
 * Ícones de linha do site (nunca emoji). O nome vem do conteúdo em JSON;
 * um nome desconhecido cai no ícone de motor.
 */
const CAMINHOS: Record<string, ReactNode> = {
  economia: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16" />
      <path d="M4 21h10" />
      <path d="M7 8h4" />
      <path d="M13 10h3a2 2 0 0 1 2 2v5.5a1.75 1.75 0 0 0 3.5 0V10l-2-3" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  compacto: (
    <>
      <path d="M3 13l1.7-4.3A2 2 0 0 1 6.6 7.4h10.8a2 2 0 0 1 1.9 1.3L21 13v5h-3" />
      <path d="M6 18H3v-5h18" />
      <circle cx="7.6" cy="18.2" r="1.6" />
      <circle cx="16.4" cy="18.2" r="1.6" />
    </>
  ),
  dia: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3.2v3.4" />
      <path d="M16 3.2v3.4" />
      <path d="M8 14h3" />
    </>
  ),
  revenda: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.5 4v4.5H16" />
    </>
  ),
  imposto: (
    <>
      <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <path d="M14 3.5v5h5" />
      <path d="M9.5 13h5" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  motor: (
    <>
      <path d="M4 10h8.5v6.5H4z" />
      <path d="M12.5 12h3l2.5 2.4v2.1h-5.5z" />
      <path d="M6.5 10V6.8h5.5V10" />
      <path d="M3 20h18" />
    </>
  ),
  local: (
    <>
      <path d="M12 21.5s6.5-5.9 6.5-10.7a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21.5 12 21.5z" />
      <circle cx="12" cy="10.7" r="2.4" />
    </>
  ),
  marcha: (
    <>
      <path d="M7 5.5v13" />
      <path d="M7 12h9" />
      <path d="M16 12V7" />
      <circle cx="7" cy="4.5" r="1.6" />
      <circle cx="7" cy="19.5" r="1.6" />
      <circle cx="16" cy="6" r="1.6" />
      <circle cx="16" cy="12" r="1.6" />
    </>
  ),
};

export function Icone({
  nome,
  className,
}: {
  nome: string;
  className?: string;
}) {
  const caminho = CAMINHOS[nome] ?? CAMINHOS.motor;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {caminho}
    </svg>
  );
}
