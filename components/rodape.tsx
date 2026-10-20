import { anuncio, chamadaFinal, navegacao } from "@/lib/conteudo";

/** Rodapé do template: links, linha legal e a marca gigante de marca d'água. */
export function Rodape() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-fumaca">
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-[6%] pb-28 pt-14 md:pb-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display text-xl tracking-[0.32em] text-gelo">
              {anuncio.modelo} {anuncio.ano}
            </p>
            <p className="mt-4 max-w-[58ch] text-xs leading-relaxed text-grafite">
              Anúncio particular de {anuncio.versao}. {anuncio.documento}. Valores
              e condições sujeitos a negociação presencial. Página de demonstração:
              os dados de contato e a quilometragem são exemplos.
            </p>
          </div>

          <nav aria-label="Links do rodapé">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {navegacao.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[10px] uppercase tracking-[0.2em] text-nevoa transition-colors duration-200 hover:text-ouro"
                  >
                    {link.rotulo}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={anuncio.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.2em] text-nevoa transition-colors duration-200 hover:text-ouro"
                >
                  WhatsApp
                  <span className="sr-only"> — abre conversa em nova aba</span>
                </a>
              </li>
            </ul>

            <p className="mt-6 text-xs text-grafite">
              {anuncio.telefone} · {anuncio.cidade}
            </p>
            <p className="mt-1 text-xs text-grafite">{chamadaFinal.principal}</p>
          </nav>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="rodape-marca display pointer-events-none select-none"
      >
        {anuncio.modelo}
      </p>
    </footer>
  );
}
