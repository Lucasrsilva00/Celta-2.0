/**
 * Teste de interações reais no navegador (só desenvolvimento).
 *
 * Uso:
 *   node scripts/teste-interacoes.mjs [url]
 *
 * Requer o Chrome instalado e o servidor do Next rodando.
 */

import puppeteer from "puppeteer-core";

const URL_BASE = process.argv[2] ?? "http://localhost:3000";

const CHROMES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
];

async function acharNavegador() {
  const { access } = await import("node:fs/promises");
  for (const caminho of CHROMES) {
    try {
      await access(caminho);
      return caminho;
    } catch {
      /* segue procurando */
    }
  }
  throw new Error("Nenhum Chrome/Edge encontrado. Ajuste a lista CHROMES.");
}

const falhas = [];
const ok = [];

function verificar(condicao, mensagem) {
  if (condicao) {
    ok.push(mensagem);
    console.log(`OK  ${mensagem}`);
  } else {
    falhas.push(mensagem);
    console.error(`FALHA  ${mensagem}`);
  }
}

const navegador = await puppeteer.launch({
  executablePath: await acharNavegador(),
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--no-sandbox"],
});

try {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const erros = [];
  pagina.on("console", (mensagem) => {
    if (mensagem.type() === "error") erros.push(mensagem.text());
  });
  pagina.on("pageerror", (erro) => erros.push(String(erro)));

  await pagina.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await pagina.waitForFunction(
    () => {
      const loader = document.querySelector(".loader");
      return !loader || getComputedStyle(loader).display === "none";
    },
    { timeout: 30_000 },
  );
  await new Promise((r) => setTimeout(r, 1200));

  // 1. Um único h1 acessível
  const h1s = await pagina.$$eval("h1", (nos) =>
    nos.map((no) => ({ texto: no.textContent?.trim(), oculto: no.closest('[aria-hidden="true"]') !== null })),
  );
  verificar(
    h1s.length === 1 && !h1s[0].oculto && (h1s[0].texto ?? "").includes("Celta"),
    `h1 acessível único (${JSON.stringify(h1s)})`,
  );

  // 2. Âncoras internas apontam para IDs existentes
  const ancoras = await pagina.$$eval('a[href^="#"]', (links) =>
    links.map((link) => link.getAttribute("href")),
  );
  const faltando = await pagina.evaluate(
    (lista) => lista.filter((href) => href !== "#" && !document.querySelector(href)),
    ancoras,
  );
  verificar(faltando.length === 0, `âncoras internas existem (${faltando.join(", ") || "todas"})`);

  // 3. Nada focável escondido de leitores de tela
  const focaveisOcultos = await pagina.$$eval(
    '[aria-hidden="true"] a[href], [aria-hidden="true"] button, [aria-hidden="true"] input, [aria-hidden="true"] select, [aria-hidden="true"] textarea',
    (nos) => nos.filter((no) => no.tabIndex >= 0).length,
  );
  verificar(focaveisOcultos === 0, `sem foco dentro de aria-hidden (${focaveisOcultos})`);

  // 4. Imagens carregadas
  await pagina.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
  await new Promise((r) => setTimeout(r, 2500));
  const imagens = await pagina.$$eval("img", (nos) =>
    nos.map((no) => ({ src: no.getAttribute("src"), largura: no.naturalWidth })),
  );
  const imagensQuebradas = imagens.filter((imagem) => imagem.largura === 0);
  verificar(
    imagensQuebradas.length === 0,
    `imagens carregadas (${imagens.length - imagensQuebradas.length}/${imagens.length})`,
  );

  // 4b. Números do carro chegam aos valores finais (sem arredondar decimais)
  await pagina.evaluate(() => {
    document
      .querySelector('section[aria-label="Números do anúncio"]')
      ?.scrollIntoView({ block: "center" });
  });
  await pagina.waitForFunction(
    () => {
      const primeiro = document.querySelector(
        'section[aria-label="Números do anúncio"] dd p.numerico span[aria-hidden="true"]',
      );
      return primeiro?.textContent?.trim() === "3,79 m";
    },
    { timeout: 6_000 },
  );
  const numerosBarra = await pagina.$$eval(
    'section[aria-label="Números do anúncio"] dd p.numerico span[aria-hidden="true"]',
    (nos) => nos.map((no) => no.textContent?.trim()),
  );
  verificar(
    JSON.stringify(numerosBarra) ===
      JSON.stringify(["3,79 m", "5", "260 L", "691 km"]),
    `números finais corretos (${numerosBarra.join(" · ")})`,
  );

  // 5. Calculadora reage à quilometragem
  await pagina.evaluate(() => {
    const secao = document.getElementById("preco");
    window.scrollTo({ top: secao.getBoundingClientRect().top + window.scrollY - 90 });
  });
  await new Promise((r) => setTimeout(r, 800));
  const resultadoAntes = await pagina.$eval("#preco p[aria-live='polite']", (no) =>
    no.textContent?.trim(),
  );
  await pagina.evaluate(() => {
    const campo = document.querySelector("#preco input[type='number']");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter.call(campo, "2000");
    campo.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 500));
  const resultadoDepois = await pagina.$eval("#preco p[aria-live='polite']", (no) =>
    no.textContent?.trim(),
  );
  verificar(
    resultadoAntes !== resultadoDepois && /R\$/.test(resultadoDepois ?? ""),
    `calculadora recalcula (${resultadoAntes} → ${resultadoDepois})`,
  );

  // 6. Quiz
  await pagina.evaluate(() => {
    const secao = document.getElementById("quiz");
    window.scrollTo({ top: secao.getBoundingClientRect().top + window.scrollY - 90 });
  });
  await new Promise((r) => setTimeout(r, 600));
  await pagina.evaluate(() => {
    const grupos = Array.from(document.querySelectorAll("#quiz fieldset"));
    grupos.forEach((grupo) => grupo.querySelector("label")?.click());
    document.querySelector("#quiz button[type='submit']")?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const resultadoQuiz = await pagina.$eval("#quiz [aria-live='polite']", (no) =>
    no.textContent?.trim(),
  );
  verificar(
    (resultadoQuiz ?? "").includes("Combina"),
    `quiz mostra resultado (${resultadoQuiz?.slice(0, 40)}…)`,
  );

  // 7. FAQ abre e mostra "Consultar" + link de WhatsApp
  await pagina.evaluate(() => {
    const secao = document.getElementById("perguntas");
    window.scrollTo({ top: secao.getBoundingClientRect().top + window.scrollY - 90 });
  });
  await new Promise((r) => setTimeout(r, 700));
  await pagina.evaluate(() => {
    document.querySelector("#perguntas details summary")?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const faq = await pagina.evaluate(() => {
    const detalhe = document.querySelector("#perguntas details");
    const link = detalhe?.querySelector("a[href^='https://wa.me/']");
    return {
      aberto: detalhe?.hasAttribute("open") ?? false,
      texto: detalhe?.textContent?.trim() ?? "",
      link: link?.getAttribute("href") ?? "",
    };
  });
  verificar(
    faq.aberto && faq.texto.includes("Consultar") && faq.link.includes("wa.me"),
    "FAQ abre com resposta Consultar e link de WhatsApp",
  );

  // 8. Formulário abre o WhatsApp com os dados (window.open interceptado)
  await pagina.evaluate(() => {
    window.__linkAberto = null;
    window.open = (url) => {
      window.__linkAberto = url;
      return null;
    };
  });
  await pagina.evaluate(() => {
    const formulario = document.querySelector("#contato form");
    const preencher = (elemento, valor) => {
      const proto =
        elemento instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
      setter.call(elemento, valor);
      elemento.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const campos = formulario.querySelectorAll("input, textarea");
    preencher(campos[0], "Ana Souza");
    preencher(campos[1], "(19) 99999-1111");
    preencher(campos[2], "Quero ver o carro no sábado.");
    formulario.querySelector("button[type='submit']")?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const formulario = await pagina.evaluate(() => ({
    link: window.__linkAberto ?? "",
    texto: document.querySelector("#contato form [aria-live='polite']")?.textContent?.trim() ?? "",
  }));
  verificar(
    formulario.link.startsWith("https://wa.me/5519991427358") &&
      decodeURIComponent(formulario.link).includes("Ana Souza") &&
      formulario.texto.includes("Abrimos o WhatsApp"),
    "formulário abre WhatsApp com nome e mostra retorno honesto",
  );

  // 9. Agendador monta mensagem com data e período
  await pagina.evaluate(() => {
    window.__linkAberto = null;
    const formularios = document.querySelectorAll("#contato form");
    const agendador = formularios[1];
    const data = agendador.querySelector("input[type='date']");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter.call(data, "2026-10-25");
    data.dispatchEvent(new Event("input", { bubbles: true }));
    agendador.querySelector("button[type='submit']")?.click();
  });
  await new Promise((r) => setTimeout(r, 600));
  const agendamento = await pagina.evaluate(() => window.__linkAberto ?? "");
  verificar(
    agendamento.startsWith("https://wa.me/5519991427358") &&
      decodeURIComponent(agendamento).includes("25/10/2026") &&
      decodeURIComponent(agendamento).includes("manhã"),
    "agendador monta mensagem com dia e período",
  );

  // 10. Vídeo não baixa antes do clique
  const video = await pagina.evaluate(() => {
    const elemento = document.querySelector("#video video");
    return {
      preload: elemento?.getAttribute("preload"),
      poster: elemento?.getAttribute("poster"),
      fonte: elemento?.querySelector("source")?.getAttribute("src"),
    };
  });
  verificar(
    video.preload === "none" && Boolean(video.poster) && Boolean(video.fonte),
    `vídeo configurado (${video.fonte})`,
  );

  // 11. Sem erros no console
  verificar(erros.length === 0, `console sem erros (${erros.join(" | ") || "limpo"})`);

  // 12. Nenhum "null", "undefined" ou "[CONFIRMAR]" visível na página
  const textoPagina = await pagina.evaluate(() => document.body.innerText);
  const vazamentos = ["null", "undefined", "[CONFIRMAR]"].filter((palavra) =>
    textoPagina.toLowerCase().includes(palavra.toLowerCase()),
  );
  verificar(vazamentos.length === 0, `sem placeholders visíveis (${vazamentos.join(", ") || "nenhum"})`);

  // 13. Página 404 com a voz do Celta
  const perdida = await navegador.newPage();
  const resposta404 = await perdida.goto(`${URL_BASE}/pagina-que-nao-existe`, {
    waitUntil: "networkidle2",
    timeout: 60_000,
  });
  const texto404 = await perdida.evaluate(() => document.body.innerText);
  verificar(
    resposta404?.status() === 404 &&
      texto404.toLowerCase().includes("caminho sem saída"),
    "página 404 responde com a mensagem própria",
  );
  await perdida.close();

  // 14. Barra fixa mobile leva ao contato
  const celular = await navegador.newPage();
  await celular.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await celular.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 2500));
  const barra = await celular.evaluate(() => {
    const barras = Array.from(document.querySelectorAll("div.fixed"));
    const visivel = barras.find((el) => getComputedStyle(el).display !== "none" && el.querySelector("a[href='#contato']"));
    return {
      visivel: Boolean(visivel),
      href: visivel?.querySelector("a")?.getAttribute("href") ?? "",
      altura: visivel?.getBoundingClientRect().height ?? 0,
    };
  });
  verificar(
    barra.visivel && barra.href === "#contato" && barra.altura >= 44,
    `barra fixa mobile presente (${Math.round(barra.altura)} px)`,
  );

  console.log(`\n${ok.length} verificações OK, ${falhas.length} falha(s).`);
  if (falhas.length > 0) process.exitCode = 1;
} finally {
  await navegador.close();
}
