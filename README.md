# Celta 2012 — landing page de venda (scroll animado)

Landing page de venda particular do **Chevrolet Celta 2012**, construída em **Next.js 16 (App Router) + Tailwind CSS v4**, com um motor de animação em canvas guiado pelo scroll: o vídeo 3D do carro é tocado quadro a quadro conforme a página rola, com "quase-paradas" em cada bloco de texto.

## Rodar o projeto

```bash
npm install
npm run dev     # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## Estrutura

```
app/
  layout.tsx           fontes (Bebas Neue + Archivo), metadata em pt-BR
  globals.css          tokens do Tailwind (@theme), efeitos, loader, seções, pasta, movimento reduzido
  page.tsx             composição da página + narrativa sr-only + barra fixa mobile
components/
  celta-scroll.tsx     motor de scroll (canvas, remap de pausas, overlays, marcadores, loader, cursor)
  nav-topo.tsx         navegação fina fixa (só desktop) com as âncoras das seções
  barra-numeros.tsx    barra ano/km/preço/motor com contadores + chevron para a seção seguinte
  sobre-carro.tsx      card "Sobre o carro" (texto, 3 números e foto real)
  painel-destaque.tsx  painel grande com a palavra CELTA vazada, carrossel de fotos e faixa técnica
  galeria-assimetrica.tsx  galeria assimétrica (1 foto grande + 2 laterais, com legenda sobre a foto)
  pasta-fotos.tsx      a pasta clicável com as 15 fotos (abas por região, foto grande, miniaturas)
  banner-video.tsx     faixa de vídeo promocional (play no clique, com áudio, depois controles nativos)
  fatos-cards.tsx      três cards escuros com os fatos que decidem a compra
  banner-cta.tsx       banner final de contato (estilo "Be Part of the Nio Community")
  rodape.tsx           rodapé com links, linha legal e a marca CELTA gigante de marca d'água
  letras-animadas.tsx  título que entra letra por letra (zoom + aproximação + desfoque)
lib/
  conteudo.ts          TODO o texto do anúncio + dados do carro (placeholders a revisar)
  animacao.ts          IntersectionObserver único (revelação) + preferência de movimento
  revelar.ts           hook que liga a revelação aos filhos com data-revelar
public/quadros/
  desktop/frame-0001..0119.webp   quadros 1280x720 (5,6 MB)
  mobile/frame-0001..0119.webp    quadros 854x480 (3,5 MB)
  manifest.json                    metadados da extração
public/videos/
  celta-promocional.mp4            H.264 1280x720 + áudio AAC (2,7 MB)
  celta-promocional-capa.webp      capa 1280x720 (poster do player e fundo do banner final)
  celta-promocional.vtt            legendas descritivas do vídeo
public/galeria/
  01-vista-frontal.webp .. 15-detalhe-traseiro.webp   fotos reais do carro
```

A ordem da página segue o template de referência: navegação fina → animação de scroll
→ barra de números → "Sobre o carro" → painel em destaque → galeria assimétrica →
**pasta com as 15 fotos** → faixa de vídeo → fatos da compra → banner de contato →
rodapé.

Os quadros 3D continuam em `public/quadros/` porque são o motor da animação do topo;
a antiga seção "O carro por todos os ângulos" foi removida (as fotos reais ocupam esse
papel, agora dentro da pasta).

## Antes de publicar — trocar os placeholders

Tudo em `lib/conteudo.ts`:

| Campo | Valor atual (exemplo) |
|---|---|
| `anuncio.preco` | R$ 32.900 |
| `anuncio.cidade` | Campinas — SP |
| `anuncio.km` | 95.000 km |
| `anuncio.telefone` | +55 (11) 99999-9999 |
| `anuncio.whatsapp` | `https://wa.me/5511999999999` |
| `barraNumeros` | ano, km, preço e motor da barra abaixo da animação |
| `sobreCarro` | título, texto, os 3 números e a foto do card |
| `painelDestaque` | fotos do carrossel e a faixa técnica (motor, câmbio, portas, combustível) |
| `galeriaAssimetrica` | as 3 fotos em destaque e suas legendas |
| `pastaFotos.capaTitulo` / `capaTexto` | texto da pasta fechada |
| `fatosDestaque.itens` | os 3 cards de revisão, pneus e documentação |
| `estadoDoCarro.fatos` | revisão, pneus, aceita troca |
| `fotosDoCarro[].nota` | observações de cada foto (as legendas são placeholders) |
| `regiaoPorArquivo` | a região de cada foto (Exterior / Interior / Motor / Detalhes), usada pelas abas da pasta |
| `videoPromocional.legenda` | texto abaixo do vídeo |

O elenco de fotos da pasta vem de `fotosDoCarro`, montado a partir de
`fotosDoAnuncio.grupos` + `regiaoPorArquivo`: para trocar uma foto, basta mudar o
arquivo em `lib/conteudo.ts` (não há lista duplicada nas seções).

Os quadros da animação vieram de `Vídeo Celta 3D.mp4` (12s, 1280×720, 24fps) extraídos com `extrair_quadros.py`.

## Ajustes rápidos

| Quero | Onde mexer |
|---|---|
| Scroll mais lento/rápido | `--altura-animacao` em `app/globals.css` (650vh padrão) |
| Animação mais suave | `LERP` em `components/celta-scroll.tsx` (0.09) |
| Pausa mais longa nas seções | `DWELL_PICO` / `DWELL_LARGURA` em `components/celta-scroll.tsx` |
| Trocar textos | `lib/conteudo.ts` |
| Mudar cores | bloco `@theme` em `app/globals.css` |
| Quadros diferentes (outro vídeo) | rodar `extrair_quadros.py` e ajustar `TOTAL_QUADROS` |
| Velocidade das letras | prop `passo` (ms) em `components/letras-animadas.tsx` |
| Ritmo vertical das seções | classe `.secao` (padding-block) em `app/globals.css` |
| Tamanho da palavra vazada do painel | `.painel-vazado` em `app/globals.css` |
| Tamanho do "CELTA" do rodapé | `.rodape-marca` em `app/globals.css` |
| Abas da pasta (regiões) | `pastaFotos.abas` + `regiaoPorArquivo` em `lib/conteudo.ts` |

## A pasta de fotos

As 15 fotos ficam dentro de uma pasta que **abre ao clique** (não é um mural na
página): fechada mostra só uma prévia em leque; aberta, a tampa recolhe e aparece uma
foto grande por vez, com abas por região (Todas / Exterior / Interior / Motor /
Detalhes), setas, contador e uma faixa de miniaturas. `Esc` fecha a pasta e o foco
volta para o botão de abrir. A tampa e o interior animam juntos com
`grid-template-rows` (0fr → 1fr, CSS puro, sem biblioteca). Quando a pasta está
fechada o interior recebe `inert` (e vice-versa), então nada fora de vista recebe Tab.

## Letras animadas nos títulos

`components/letras-animadas.tsx` divide o título em palavras (cada palavra é
`inline-block` + `nowrap`, para a linha quebrar entre palavras e não entre letras) e
cada letra entra com `opacity`, `translateY` e `scale` (0,72 → 1) com um atraso de 30
ms por letra, saindo de um leve `blur`. O texto completo fica em `sr-only`, então o
leitor de tela lê a frase inteira. A animação só é "armada" no cliente: sem JavaScript
o título aparece normal, e títulos já visíveis na primeira dobra não piscam. Com
`prefers-reduced-motion` a classe entra na hora e nada anima.

## Scripts de desenvolvimento

```bash
node scripts/capturas.mjs      # screenshots em .capturas/ (desktop, mobile e por seção)
node scripts/desempenho.mjs    # mede fps, tarefas longas e memória durante o scroll
node scripts/teste-video.mjs   # confere que o vídeo toca com áudio depois do clique
node scripts/teste-pasta.mjs   # abre/fecha a pasta, testa abas, setas, miniaturas e Esc
```

Os quatro usam `puppeteer-core` com o Chrome já instalado na máquina.

## Sobre os quadros do vídeo

O `Vídeo Celta 3D.mp4` tem uma faixa de legenda e a marca d'água "Dola AI" gravadas no
rodapé. Em vez de recortar os quadros (o que cortaria o carro nos enquadramentos
abertos), a faixa é apagada no próprio canvas pelo véu em gradiente de `desenhar()` em
`components/celta-scroll.tsx`. Alguns quadros também trazem o texto "CHEVROLET CELTA
2012" no meio do enquadramento — esse é da peça original e fica como está.

## Sobre o vídeo promocional e as fotos reais

`public/videos/celta-promocional.mp4` veio de `Vídeo Celta 2012.mp4` (10,08s, 1280×720,
HEVC + AAC). Ele foi convertido para **H.264** (perfil que Chrome e Firefox tocam de
forma confiável) com `-crf 25 -preset veryslow -movflags +faststart` e o áudio foi
copiado sem recodificar (`-c:a copy`). A marca d'água "Dola AI" foi apagada no próprio
arquivo com o filtro `delogo` (não com um véu em CSS, que atrapalharia os controles
nativos):

```bash
ffmpeg -i "Vídeo Celta 2012.mp4" \
  -vf "delogo=x=1118:y=660:w=135:h=34" \
  -c:v libx264 -crf 25 -preset veryslow -pix_fmt yuv420p \
  -c:a copy -movflags +faststart public/videos/celta-promocional.mp4
```

A capa (`celta-promocional-capa.webp`) é o quadro de 6,8s, também sem a marca d'água.
O vídeo não tem autoplay: `preload="none"` e um botão de play cobre o quadro; no clique
o `play()` sai do mesmo gesto do usuário — é isso que libera o **áudio**. Depois disso os
controles nativos aparecem e o botão sai do caminho.

As 15 fotos de `public/galeria/` foram recortadas de `Galeria Premium Chevrolet Celta
2012.png` (colagem 1536×1024). Cada tile foi cortado acima da legenda gravada na colagem
(a legenda que aparece no site é HTML) e salvo em WebP — o conjunto todo dá ~206 KB. As
fotos têm baixa resolução (353–559 px de largura), por isso a pasta mostra uma **foto
grande por vez** em vez de um mural ampliado, e as molduras mantêm a proporção natural
de cada foto. As notas de cada foto vivem em `fotosDoCarro[].nota` (mesma fonte usada
pelas seções da página).

## Acessibilidade

- Contraste verificado (branco 20:1, cinza claro 5.9:1, ouro 9.1:1 sobre o fundo).
- `prefers-reduced-motion` desliga o motor, as partículas e o cursor: fica o primeiro quadro estático. Também caem o pulsar do botão de play, o zoom das fotos no hover, o parallax, a revelação das seções, o carrossel de letras e a abertura da pasta (tampa e interior aparecem prontos).
- O botão de play tem 64px (76px no desktop); os selos de duração e áudio ficam `aria-hidden` para não poluir o nome acessível do botão.
- O vídeo tem faixa de legendas descritivas (`celta-promocional.vtt`), disponível pelos controles nativos.
- As fotos têm `alt` descritivo, `sizes` por moldura e carregamento preguiçoso.
- Os títulos com letras animadas expõem o texto completo em `sr-only` (o leitor de tela lê a frase, não as letras).
- A pasta de fotos usa `aria-expanded` + `aria-controls` no botão de abrir, `aria-pressed` nas abas, `aria-live` no contador de fotos, setas de 40px (52px no desktop) e `Esc` fecha devolvendo o foco ao botão de abrir.
- Narrativa completa em bloco `sr-only` (os overlays cronometrados são `aria-hidden` e ficam `inert` quando inativos).
- Marcadores de capítulo são botões de 44px com `aria-current`; foco visível em ouro, nunca removido.
