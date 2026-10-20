import { BannerCta } from "@/components/banner-cta";
import { BannerVideo } from "@/components/banner-video";
import { BarraNumeros } from "@/components/barra-numeros";
import { Beneficios } from "@/components/beneficios";
import { CeltaScroll } from "@/components/celta-scroll";
import { CompraSemSusto } from "@/components/compra-sem-susto";
import { Dores } from "@/components/dores";
import { GaleriaAssimetrica } from "@/components/galeria-assimetrica";
import { NavTopo } from "@/components/nav-topo";
import { PastaFotos } from "@/components/pasta-fotos";
import { Perguntas } from "@/components/perguntas";
import { PrecoFipe } from "@/components/preco-fipe";
import { QuizCompatibilidade } from "@/components/quiz-compatibilidade";
import { Rodape } from "@/components/rodape";
import {
  anuncio,
  beneficios,
  carro,
  chamadaFinal,
  compraSemSusto,
  dores,
  empresa,
  fipe,
  fipeTexto,
  formatarMoeda,
  hero,
  perguntas,
  precoTexto,
  quiz,
  rotulos,
  videoPromocional,
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
        <h1 className="sr-only">
          {hero.titulo} {anuncio.modelo} {anuncio.ano}, {anuncio.versao}.
        </h1>
        <CeltaScroll />

        {/* Narrativa completa para leitores de tela: os overlays visuais são cronometrados
            pelo scroll e ficam ocultos para tecnologias assistivas. */}
        <section className="sr-only narrativa" aria-labelledby="titulo-resumo">
          <h2 id="titulo-resumo">
            {anuncio.modelo} {anuncio.ano} à venda — resumo do anúncio
          </h2>
          <p>
            {anuncio.versao}, {anuncio.cor.toLowerCase()}, {anuncio.portas}.
            Quilometragem: {anuncio.km}. Valor:{" "}
            {carro.preco ? formatarMoeda(carro.preco) : rotulos.consultar}.
          </p>

          <h3>{beneficios.titulo}</h3>
          <ul>
            {beneficios.itens.map((item) => (
              <li key={item.titulo}>
                {item.titulo} {item.texto}
              </li>
            ))}
          </ul>

          <h3>{dores.titulo}</h3>
          <ul>
            {dores.itens.map((item) => (
              <li key={item.texto}>{item.texto}</li>
            ))}
          </ul>

          <h3>Medidas do carro</h3>
          <ul>
            <li>3,79 metros de comprimento</li>
            <li>5 lugares</li>
            <li>260 litros de porta-malas</li>
            <li>691 quilômetros de autonomia na estrada com gasolina</li>
          </ul>

          <h3>Fotos</h3>
          <p>
            Quinze fotos do carro, por fora e por dentro, disponíveis na pasta de
            fotos. As fotos são do carro à venda; a animação e o vídeo são
            ilustrativos e gerados com inteligência artificial.
          </p>

          <h3>Preço e FIPE</h3>
          <p>
            Tabela FIPE de referência: {fipeTexto}, {fipe.referenciaLabel}, código{" "}
            {fipe.codigo}. Valor deste carro: {precoTexto}. A FIPE é referência de
            mercado, não garantia de preço.
          </p>

          <h3>{videoPromocional.titulo}</h3>
          <p>{videoPromocional.aviso}</p>

          <h3>{compraSemSusto.titulo}</h3>
          <p>{compraSemSusto.frase}</p>
          <ul>
            {compraSemSusto.checklist.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>{quiz.titulo}</h3>
          {quiz.perguntas.map((pergunta) => (
            <div key={pergunta.id}>
              <p>{pergunta.pergunta}</p>
              <ul>
                {pergunta.opcoes.map((opcao) => (
                  <li key={opcao.rotulo}>{opcao.rotulo}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3>{perguntas.titulo}</h3>
          <ul>
            {perguntas.itens.map((item) => (
              <li key={item.pergunta}>
                {item.pergunta} {item.resposta ?? rotulos.consultar}
              </li>
            ))}
          </ul>

          <h3>{chamadaFinal.titulo}</h3>
          <p>{chamadaFinal.texto}</p>
          <p>
            Contato direto com a {empresa.nome}: {anuncio.telefone ?? anuncio.whatsappVisivel}.
          </p>
        </section>

        <Dores />
        <Beneficios />
        <BarraNumeros />
        <GaleriaAssimetrica />
        <PastaFotos />
        <PrecoFipe />
        <BannerVideo />
        <CompraSemSusto />
        <QuizCompatibilidade />
        <Perguntas />
        <BannerCta />
      </main>

      {/* Barra fixa no celular: preço + um único pedido */}
      <div className="fixed inset-x-0 bottom-0 z-[60] flex items-center justify-between gap-3 border-t border-white/10 bg-preto/90 px-4 py-3 backdrop-blur-md md:hidden">
        <div>
          <p className="numerico text-[17px] font-semibold text-gelo">{precoTexto}</p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-grafite">
            {anuncio.ano} · {anuncio.versao}
          </p>
        </div>
        <a
          href="#contato"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-gelo px-5 text-sm font-semibold text-preto transition-colors duration-200 hover:bg-ouro active:scale-[0.98]"
        >
          {rotulos.agendar}
        </a>
      </div>

      <Rodape />
    </>
  );
}
