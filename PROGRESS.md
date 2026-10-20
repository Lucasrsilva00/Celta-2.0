# PROGRESS — Celta 2.0

Plano de referência: documento **“SITE PUBLICITÁRIO | CHEVROLET CELTA 2012 LT 1.0 FLEX”**
(seções 0–8) + decisões aprovadas na sessão.

**Última atualização:** 20/10/2026
**Estado:** site implementado, testado e documentado; **não publicado**.

## Etapas

- [x] **Etapa 0 — Baseline:** restyling pendente commitado, `main` estável.
- [x] **Etapa 1 — Dados:** `src/data/lt.json` e `src/data/conteudo.json`; FIPE out/2026,
  fatos do carro, empresa e WhatsApp; `lib/conteudo.ts` tipado.
- [x] **Etapa 2 — Conteúdo persuasivo:** abertura, dores, “por que o Celta LT”, quatro
  números, preço, compra sem susto, perguntas e chamada final na voz do documento.
- [x] **Etapa 3 — Abertura:** hero com animação de scroll, título acessível, barra fixa
  mobile, loader e selo de IA na animação.
- [x] **Etapa 4 — Seções:** `dores`, `beneficios`, `barra-numeros`, `compra-sem-susto`,
  `perguntas`; componentes antigos (`sobre-carro`, `painel-destaque`, `fatos-cards`) removidos.
- [x] **Etapa 5 — Galeria e vídeo:** galeria assimétrica, pasta com 15 fotos, legendas,
  aviso “Vídeo ilustrativo · IA”, legenda descritiva `.vtt`.
- [x] **Etapa 6 — Interativos:** calculadora cidade/estrada, selo FIPE e quiz de três
  perguntas; pontos clicáveis nas fotos ficaram fora (sem coordenadas reais confiáveis).
- [x] **Etapa 7 — Contato:** formulário sem backend (valida e abre WhatsApp), agendador de
  test drive, links condicionais e mensagens de fallback.
- [x] **Etapa 8 — Polimento:** 404 própria, metadados, README, PROGRESS, scripts de teste,
  revisão visual desktop/mobile e auditoria de requisitos.

## Verificações executadas

| Teste | Resultado |
|---|---|
| `npm run build` | passou (Next.js 16.4.2, rotas `/` e `/_not-found` estáticas) |
| `npm run lint` | passou, sem avisos |
| `node scripts/teste-interacoes.mjs` | **15/15** — h1 único, âncoras, foco fora de `aria-hidden`, 23/23 imagens, números finais (3,79 m · 5 · 260 L · 691 km), calculadora, quiz, FAQ, formulário, agendador, vídeo, console limpo, sem placeholders, 404 e barra mobile |
| `node scripts/teste-pasta.mjs` | abrir/fechar, abas, setas, miniaturas, `Esc`, foco devolvido e movimento reduzido |
| `node scripts/teste-video.mjs` | toca com áudio, 1280×720, 10,08 s, H.264, controles nativos e legenda pt-BR |
| `node scripts/desempenho.mjs` | 59,9 fps, 0 tarefas longas, 3,7 MB de heap, 2.219 nós, primeiro quadro em 0,73 s |
| `node scripts/capturas.mjs` | capturas desktop/mobile de todas as seções em `.capturas/` |

## Dados confirmados

- Chevrolet Celta LT 1.0 Flex, ano/modelo 2012, preto, 4 portas + porta-malas.
- 3,79 m de comprimento, 5 lugares, 260 L de porta-malas, tanque de 54 L.
- Consumo: cidade 10,7/7,6 e estrada 12,8/8,7 (gasolina/etanol).
- FIPE out/2026: R$ 30.356, código `004321-4`.
- Empresa: Sanderscarr.

## Aguardando confirmação do vendedor (`[CONFIRMAR]`)

- Quilometragem real (CRLV).
- Itens de série (ar, direção, vidros/travas, som, alarme).
- Laudo cautelar, troca e financiamento.
- Endereço e horário da Sanderscarr.
- Respostas do FAQ.
- **WhatsApp provisório:** `+55 (19) 99142-7358`; `whatsappConfirmado: false`.
- Preço de venda (`carro.preco` está `null`).

Enquanto esses campos forem `null`, a interface mostra **“Consultar”** e o WhatsApp; nenhum
valor foi inventado.

## Decisões

- Site com a marca **“Celta 2.0”**; vendedor **Sanderscarr**.
- Fotos tratadas como reais; **animação e vídeo** recebem aviso de IA.
- Formulário não simula sucesso de servidor: abre o WhatsApp e explica o que aconteceu.
- FAQ usa `details/summary` nativo e link de WhatsApp quando a resposta é `null`.
- “Compra sem susto” só afirma itens confirmados; o checklist de 10 itens é o material
  prático para a visita.
- Barra mobile tem um único pedido: **Agendar test drive** → `#contato`.
- Overlays são `aria-hidden` por design; seus CTAs ficam com `tabIndex={-1}` e os mesmos
  caminhos existem nas seções visíveis, evitando foco em conteúdo escondido de leitores de tela.
- Pontos clicáveis nas fotos foram adiados por falta de coordenadas reais confiáveis.

## Git

- Commits anteriores: `4dd5caf`, `53566a7` (base), `58f21e2` e `62a20ca` (dados/FIPE).
- Trabalho das Etapas 2–8 nesta sessão: ver histórico `git log` (commits `feat/*` e `docs/*`).
- Tags previstas/atribuídas: `v0.3`, `v0.6`, `v1.0.0`.
- **Nada foi enviado para `origin`.** Push e deploy exigem autorização.

## Bloqueios e limitações

- **Deploy não realizado** — publicação só com autorização.
- WhatsApp provisório e demais dados `[CONFIRMAR]` acima.
- Sem backend: contato e agendamento dependem do WhatsApp.
- Vídeo e animação são ilustrativos (IA); as fotos são do carro.
- FIPE é referência de mercado, não preço de venda.
- Autonomia de 691 km é estimativa (54 L × 12,8 km/l), não medição.

## Próximos passos

1. Confirmar os dados `[CONFIRMAR]` com a Sanderscarr.
2. Atualizar `src/data/lt.json` e `src/data/conteudo.json`.
3. Rodar build, lint e os quatro testes de navegador.
4. Autorizar push/deploy.
