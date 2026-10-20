import {
  chamadaFinal,
  contatoTexto,
  empresa,
  navegacao,
  rodapeInfo,
  rodapeTexto,
  rotulos,
  site,
  whatsappLinks,
} from "@/lib/conteudo";

/** Rodapé: marca do site, dados da Sanderscarr, links e a marca d'água gigante. */
export function Rodape() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-fumaca">
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-[6%] pb-28 pt-14 md:pb-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="display text-xl tracking-[0.32em] text-gelo">{site.nome}</p>
            <p className="mt-2 text-sm text-nevoa">
              {empresa.nome} · <span className="numerico">{contatoTexto}</span>
            </p>
            <p className="mt-4 max-w-[58ch] text-xs leading-relaxed text-grafite">
              {rodapeTexto}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-grafite">
              {empresa.endereco ?? rodapeInfo.enderecoFallback}
              <br />
              {empresa.horario ?? rodapeInfo.horarioFallback}
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
              {whatsappLinks.geral && (
                <li>
                  <a
                    href={whatsappLinks.geral}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] uppercase tracking-[0.2em] text-nevoa transition-colors duration-200 hover:text-ouro"
                  >
                    {rotulos.rotuloWhatsapp}
                    <span className="sr-only">{rotulos.abreNovaAba}</span>
                  </a>
                </li>
              )}
            </ul>

            <p className="mt-6 text-xs text-grafite">
              {chamadaFinal.principal} — <a href="#contato" className="underline-offset-4 hover:text-ouro hover:underline">ir ao formulário</a>
            </p>
            <p className="mt-2 text-[11px] text-grafite">{rodapeInfo.creditos}</p>
          </nav>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="rodape-marca display pointer-events-none select-none"
      >
        {site.marca}
      </p>
    </footer>
  );
}
