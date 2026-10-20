import { navegacao, rotulos, site, whatsappLinks } from "@/lib/conteudo";

/**
 * Navegação fina no topo (só desktop): links das seções e a marca ao centro.
 * No celular a barra fixa de contato no rodapé já cumpre esse papel.
 */
export function NavTopo() {
  const esquerda = navegacao.slice(0, 2);
  const direita = navegacao.slice(2);

  return (
    <nav
      aria-label="Seções do anúncio"
      className="fixed inset-x-0 top-0 z-[70] hidden border-b border-white/[0.06] bg-preto/55 backdrop-blur-md md:block"
    >
      <div className="mx-auto flex h-12 w-full max-w-[1240px] items-center justify-between px-[6%]">
        <ul className="flex items-center gap-7">
          {esquerda.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[10px] uppercase tracking-[0.22em] text-nevoa transition-colors duration-200 hover:text-gelo"
              >
                {link.rotulo}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#conteudo"
          aria-label={`${site.nome} — voltar ao início`}
          className="display text-[15px] tracking-[0.42em] text-gelo transition-colors duration-200 hover:text-ouro"
        >
          {site.nome}
        </a>

        <ul className="flex items-center gap-7">
          {direita.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[10px] uppercase tracking-[0.22em] text-nevoa transition-colors duration-200 hover:text-gelo"
              >
                {link.rotulo}
              </a>
            </li>
          ))}
          {whatsappLinks.geral && (
            <li>
              <a
                href={whatsappLinks.geral}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.18em] text-gelo transition-colors duration-200 hover:border-ouro/60 hover:text-ouro"
              >
                {rotulos.rotuloWhatsapp}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                  className="h-3 w-3"
                >
                  <path d="M5 12h13" />
                  <path d="M12.5 6l6 6-6 6" />
                </svg>
                <span className="sr-only">{rotulos.abreNovaAba}</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
