import { BannerCta } from "@/components/banner-cta";
import { BannerVideo } from "@/components/banner-video";
import { BarraNumeros } from "@/components/barra-numeros";
import { CeltaScroll } from "@/components/celta-scroll";
import { FatosCards } from "@/components/fatos-cards";
import { GaleriaAssimetrica } from "@/components/galeria-assimetrica";
import { NavTopo } from "@/components/nav-topo";
import { PainelDestaque } from "@/components/painel-destaque";
import { PastaFotos } from "@/components/pasta-fotos";
import { Rodape } from "@/components/rodape";
import { SobreCarro } from "@/components/sobre-carro";
import {
  anuncio,
  chamadaFinal,
  detalhesMotor,
  diferenciais,
  diferenciaisTitulo,
  estadoDoCarro,
  precoTexto,
  rotulos,
  stats,
  visao,
} from "@/lib/conteudo";

export default function Home() {
  return (
    <>
      <a className="pular-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      {/* Sem JavaScript: esconde a animação e mostra a narrativa completa como página */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              #apresentacao, .loader, .marcadores { display: none !important; }
              .narrativa {
                position: static !important;
                width: auto !important;
                height: auto !important;
                margin: 0 !important;
                padding: 72px 6% !important;
                overflow: visible !important;
                clip: auto !important;
                white-space: normal !important;
              }
              .narrativa h2 { font-family: var(--font-display); font-size: clamp(32px, 5vw, 56px); margin-bottom: 16px; text-transform: uppercase; }
              .narrativa h3 { font-family: var(--font-display); font-size: 24px; margin: 28px 0 8px; }
              .narrativa p, .narrativa li, .narrativa dd, .narrativa dt { color: #c7c7cc; line-height: 1.65; }
              .narrativa ul { list-style: disc; padding-left: 22px; margin-top: 8px; }
            `,
          }}
        />
      </noscript>

      <NavTopo />

      <main id="conteudo" tabIndex={-1}>
        <CeltaScroll />

        {/* Narrativa completa para leitores de tela: os overlays visuais são cronometrados
            pelo scroll e ficam ocultos para tecnologias assistivas. */}
        <section className="sr-only narrativa" aria-labelledby="titulo-resumo">
          <h2 id="titulo-resumo">
            {anuncio.modelo} {anuncio.ano} à venda — resumo do anúncio
          </h2>
          <p>
            {anuncio.versao}, {anuncio.cor.toLowerCase()}.{" "}
            {anuncio.preco ? `Valor: ${anuncio.preco}.` : rotulos.valorAConsultar + "."}{" "}
            {anuncio.km}. {anuncio.documento}.
          </p>
          <ul>
            {stats.map((item) => (
              <li key={item.rotulo}>
                {item.rotulo}: {item.valor}
              </li>
            ))}
          </ul>
          <h3>Por que esse carro</h3>
          <p>{visao.citacao}</p>
          <h3>{detalhesMotor.titulo}</h3>
          <p>{detalhesMotor.corpo}</p>
          <ul>
            {detalhesMotor.itens.map((item) => (
              <li key={item.texto}>{item.texto}</li>
            ))}
          </ul>
          <h3>{diferenciaisTitulo}</h3>
          <ul>
            {diferenciais.map((item) => (
              <li key={item.titulo}>
                {item.titulo}: {item.texto}
              </li>
            ))}
          </ul>
          <h3>{estadoDoCarro.titulo}</h3>
          <p>{estadoDoCarro.corpo}</p>
          <dl>
            {estadoDoCarro.fatos.map((fato) => (
              <div key={fato.chave}>
                <dt>{fato.chave}</dt>
                <dd>{fato.valor}</dd>
              </div>
            ))}
          </dl>
          <h3>{chamadaFinal.titulo}</h3>
          <p>{chamadaFinal.subtitulo}</p>
          <p>
            Contato direto com o vendedor: {anuncio.telefone ?? anuncio.whatsappVisivel}.
          </p>
        </section>

        {/* Barra de números e o restante da página na linguagem do template */}
        <BarraNumeros />
        <SobreCarro />
        <PainelDestaque />
        <GaleriaAssimetrica />
        <PastaFotos />
        <BannerVideo />
        <FatosCards />
        <BannerCta />
      </main>

      {/* Barra de contato fixa no celular */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-between gap-3 border-t border-white/10 bg-preto/90 px-4 py-3 backdrop-blur-md md:hidden">
        <div>
          <p className="numerico text-[17px] font-semibold text-gelo">{precoTexto}</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-grafite">
            {anuncio.ano} · {anuncio.km}
          </p>
        </div>
        <a
          href={anuncio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gelo px-5 text-sm font-semibold text-preto transition-colors duration-200 hover:bg-ouro active:scale-[0.98]"
        >
          {chamadaFinal.principal}
        </a>
      </div>

      <Rodape />
    </>
  );
}
