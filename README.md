# Celta 2.0 — anúncio do Chevrolet Celta LT 1.0 Flex 2012

Site publicitário de venda do **Chevrolet Celta LT 1.0 Flex 2012 preto**, anunciado pela
**Sanderscarr**. A página combina uma apresentação em canvas guiada pelo scroll com seções
convencionais de venda: dores de quem procura carro, motivos para escolher o LT, fotos,
preço/FIPE, calculadora de gasto, vídeo, checklist de test drive, quiz, perguntas e contato.

O objetivo editorial é vender sem pressão: segunda pessoa, frases curtas, nenhum dado
inventado, nenhum superlativo e nenhuma falsa escassez. O que ainda não foi confirmado pelo
vendedor aparece como **“Consultar”**, nunca como um número inventado.

## Rodar o projeto

```bash
npm install
npm run dev      # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm run start    # http://localhost:3000
npm run lint
```

Stack: **Next.js 16.4.2 (App Router) + React 19 + Tailwind CSS v4**, sem backend e sem banco
de dados.

## Ordem da página

1. **Abertura** — animação 3D controlada pelo scroll, título, versão, câmbio, cor, portas e valor.
2. **Dores** — “carro que dá dor de cabeça”, “medo de comprar errado”, “aperto no orçamento”.
3. **Por que o Celta LT** — quatro motivos concretos (mecânica, peças, consumo, seguro).
4. **Quatro números** — 3,79 m, 5 lugares, 260 L, 691 km de autonomia.
5. **Veja de perto** — galeria assimétrica + pasta clicável com as 15 fotos.
6. **O preço** — selo FIPE (out/2026, R$ 30.356, código `004321-4`) e calculadora cidade/estrada.
7. **Em movimento** — vídeo promocional de 10 s, com áudio e legendas.
8. **Compra sem susto** — o que está confirmado (hoje: nada além dos fatos do carro) e checklist de 10 itens.
9. **Quiz** — três perguntas para ver se o carro combina com o uso da pessoa.
10. **Perguntas** — FAQ com respostas confirmadas ou o fallback “Consultar” + WhatsApp.
11. **Chamada final** — contato, formulário e agendador de test drive.
12. **Rodapé** — dados da Sanderscarr, links e aviso legal.
13. **Barra fixa mobile** — valor + “Agendar test drive” apontando para o contato.

Os overlays 1–6 são visuais e cronometrados pelo scroll; a narrativa completa também existe
em um bloco `sr-only` para leitores de tela e para o caso de JavaScript desativado.

## Estrutura

```
app/
  layout.tsx                 fontes, metadata e idioma pt-BR
  page.tsx                   composição das seções + narrativa sr-only + barra mobile
  not-found.tsx              página 404 com a voz do anúncio
  globals.css                tokens, efeitos, formulários, FAQ, faróis, movimento reduzido
components/
  celta-scroll.tsx           motor de scroll (canvas, pausas, overlays, marcadores, loader)
  nav-topo.tsx               navegação fixa (desktop)
  barra-numeros.tsx          os quatro números do carro
  dores.tsx                  seção “dores”
  beneficios.tsx             seção “por que o Celta LT”
  galeria-assimetrica.tsx    três fotos em destaque
  pasta-fotos.tsx            pasta clicável com as 15 fotos
  preco-fipe.tsx             selo FIPE + calculadora
  calculadora-gasto.tsx      cálculo cidade/estrada e regra do etanol
  banner-video.tsx           player com play no clique e legendas
  compra-sem-susto.tsx       itens confirmados + checklist para download
  quiz-compatibilidade.tsx   quiz acessível de três perguntas
  perguntas.tsx              FAQ com fallback “Consultar”
  banner-cta.tsx             contato, formulário, agendador e WhatsApp
  contato-form.tsx           formulário que abre o WhatsApp (sem servidor)
  agendador-test-drive.tsx   dia/período que abre o WhatsApp
  rodape.tsx                 dados da empresa, links e marca d'água
  letras-animadas.tsx        título letra por letra
lib/
  conteudo.ts                adaptador tipado dos JSONs e formatadores
  animacao.ts                IntersectionObserver + preferência de movimento
  revelar.ts                 hook de revelação das seções
scripts/
  capturas.mjs               screenshots desktop/mobile por seção
  teste-interacoes.mjs       15 verificações funcionais no navegador
  teste-pasta.mjs            abrir/fechar, abas, setas, miniaturas e Esc
  teste-video.mjs            vídeo toca com áudio e legendas
  desempenho.mjs             fps, tarefas longas e memória no scroll
src/data/
  lt.json                    fatos do carro, números, FIPE e empresa
  conteudo.json              textos, fotos, FAQ, quiz, contato e checklist
public/
  quadros/                   quadros 3D da animação (desktop e mobile)
  galeria/                   15 fotos do carro
  videos/                    vídeo promocional, capa e legendas .vtt
  checklist-test-drive.txt   checklist para download
```

## Onde mexer nos dados

Todo o conteúdo fica em **`src/data/`**, não nos componentes:

| Arquivo | O que contém |
|---|---|
| `lt.json` | modelo, versão, ano, cor, portas, km, preço, itens de série, números, FIPE e dados da Sanderscarr |
| `conteudo.json` | navegação, textos das seções, fotos e legendas, vídeo, FAQ, quiz, formulário, checklist e rodapé |

`lib/conteudo.ts` transforma esses JSONs em exports tipados (`anuncio`, `carro`, `fipe`,
`preco`, `perguntas`, `quiz`, `empresa`, `whatsappLinks` etc.) e formata valores em reais.
Quando um campo é `null`, a interface mostra **“Consultar”** em vez de inventar o dado.

### Regras editoriais aplicadas

- Segunda pessoa e frases curtas; nada de “imperdível”, “único” ou “oportunidade”.
- Nenhuma ficha técnica completa na página principal; só os quatro números pedidos.
- Nenhuma placa publicada; nenhum dado de outro carro.
- `km`, itens de série, laudo, troca, financiamento, endereço, horário e respostas do FAQ
  permanecem `null` enquanto não forem confirmados.
- Fotos são do carro; **animação e vídeo** levam o selo “ilustrativo · IA”.
- O formulário não finge envio: ele monta a mensagem e abre o WhatsApp, deixando claro que
  nada é armazenado no site.

## Interativos

- **Calculadora** — km/mês, preço da gasolina e do etanol, divisão cidade/estrada, consumo do
  Celta e regra do etanol (0,71 na cidade e 0,68 na estrada ponderada).
- **Selo FIPE** — valor de referência, código, mês e comparação percentual quando houver preço.
- **Quiz** — três perguntas com resultado “combina muito / combina / talvez não” e CTA.
- **Pasta de fotos** — abas por região, foto grande, miniaturas, setas, `Esc` e foco devolvido.
- **Formulário e agendador** — validam no cliente e abrem o WhatsApp com a mensagem pronta.
- **FAQ** — `details/summary` nativo, acessível por teclado, com link de WhatsApp no fallback.

## Contato e limitações

- **WhatsApp:** `+55 (19) 99142-7358` (`5519991427358`). O número está marcado como
  **provisório** em `lt.json` (`whatsappConfirmado: false`) e precisa ser confirmado antes de
  publicar.
- **Sem backend:** o formulário e o agendador não enviam nada para servidor; apenas abrem o
  WhatsApp. Se o navegador bloquear a janela, a pessoa vê o número e o link manual.
- **Sem deploy:** o projeto está pronto para build local, mas não foi publicado. Publicação
  exige autorização.
- **FIPE:** referência de outubro/2026 (R$ 30.356), não garantia de preço de venda.
- **Autonomia:** 691 km = 54 L × 12,8 km/l (estrada, gasolina); é uma estimativa a partir do
  consumo informado, não uma medição do carro.

## Testes

Com o servidor rodando (`npm run start` ou `npm run dev`):

```bash
node scripts/teste-interacoes.mjs   # 15 verificações: h1, âncoras, foco em aria-hidden,
                                    # imagens, números finais, calculadora, quiz, FAQ, formulário,
                                    # agendador, vídeo, console, placeholders, 404 e barra
node scripts/teste-pasta.mjs        # pasta: abrir/fechar, abas, setas, miniaturas, Esc
node scripts/teste-video.mjs        # vídeo: áudio, controles, 1280×720, legendas
node scripts/desempenho.mjs         # fps, tarefas longas, memória e nós do DOM
node scripts/capturas.mjs           # screenshots em .capturas/ (ignorado pelo git)
```

Resultados da última verificação ficam registrados em `PROGRESS.md`.

## Acessibilidade

- Um único `h1` acessível; títulos de seção em `h2`.
- Skip link, foco visível em ouro e alvos de toque de pelo menos 44 px.
- Overlays visuais são `aria-hidden`; a narrativa completa fica em `sr-only` e os controles
  internos dos overlays ficam fora da ordem de tabulação (os mesmos CTAs existem nas seções).
- `prefers-reduced-motion` desliga animação, partículas, cursor customizado, revelações e
  abertura animada da pasta.
- Vídeo com legendas descritivas e sem autoplay; áudio só depois do clique.
- Contraste conferido para texto claro, cinza e ouro sobre o fundo preto.

## Antes de publicar

1. Confirmar o número de WhatsApp e trocar `whatsappConfirmado` para `true`.
2. Preencher km, itens de série, laudo, troca, financiamento, endereço e horário em `lt.json`.
3. Responder o FAQ em `conteudo.json` (enquanto `null`, o site mostra “Consultar”).
4. Definir o preço em `carro.preco`; o selo FIPE passa a comparar automaticamente.
5. Rodar `npm run build`, `npm run lint` e os quatro testes de navegador.
6. Só então autorizar o deploy.
