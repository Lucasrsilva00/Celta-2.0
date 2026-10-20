/**
 * Teste da pasta de fotos (só desenvolvimento).
 *
 * Confere o comportamento que o CSS sozinho não prova: abrir/fechar, abas por
 * região, setas do teclado e do mouse, miniaturas, `inert` fora de vista, foco
 * devolvido para o botão de abrir no Esc e o estado com movimento reduzido.
 *
 * Uso: node scripts/teste-pasta.mjs [url]
 * Requer o Chrome instalado e o servidor do Next rodando.
 */

import path from "node:path";
import puppeteer from "puppeteer-core";

const URL_BASE = process.argv[2] ?? "http://localhost:3000";
const SAIDA = process.env.SAIDA_CAPTURAS ?? ".capturas";

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

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lê o estado da pasta direto do DOM. */
const lerEstado = () => {
  const pasta = document.querySelector(".pasta");

  return {
    aberta: pasta?.dataset.aberta,
    capaInerte: document.querySelector(".pasta-capa")?.inert,
    interiorInerte: document.querySelector("#conteudo-pasta")?.inert,
    botaoExpandido: document
      .querySelector("#fotos .pill-ouro")
      ?.getAttribute("aria-expanded"),
    foco:
      document.activeElement?.textContent?.trim().replace(/\s+/g, " ").slice(0, 40) ??
      "",
    abaAtiva:
      document.querySelector("#conteudo-pasta .aba-ativa")?.textContent?.trim() ??
      "",
    contador:
      document.querySelector("#conteudo-pasta [aria-live]")?.textContent?.trim() ??
      "",
    legenda:
      document
        .querySelector("#conteudo-pasta .pasta-legenda")
        ?.textContent?.trim()
        .replace(/\s+/g, " ")
        .slice(0, 70) ?? "",
    miniaturas: document.querySelectorAll("#conteudo-pasta .miniatura").length,
    foto: document.querySelector("#conteudo-pasta img")?.getAttribute("src") ?? "",
    altAtual: document.querySelector("#conteudo-pasta img")?.getAttribute("alt") ?? "",
  };
};

const navegador = await puppeteer.launch({
  executablePath: await acharNavegador(),
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--no-sandbox"],
});

try {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await pagina.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await pagina.waitForFunction(
    () => {
      const loader = document.querySelector(".loader");
      return !loader || getComputedStyle(loader).display === "none";
    },
    { timeout: 30_000 },
  );

  await pagina.evaluate(() => {
    document.getElementById("fotos")?.scrollIntoView({ block: "start" });
  });
  await espera(1500);

  console.log("FECHADA:", JSON.stringify(await pagina.evaluate(lerEstado), null, 2));

  await pagina.click("#fotos .pill-ouro");
  await espera(1400);
  console.log("ABERTA:", JSON.stringify(await pagina.evaluate(lerEstado), null, 2));

  // abas por região
  const clicarAba = (rotulo) =>
    pagina.evaluate((alvo) => {
      const abas = Array.from(
        document.querySelectorAll("#conteudo-pasta .aba"),
      );
      const botao = abas.find((aba) => aba.textContent?.trim() === alvo);
      if (botao instanceof HTMLElement) botao.click();
    }, rotulo);

  await clicarAba("Motor");
  await espera(400);
  console.log("ABA MOTOR:", JSON.stringify(await pagina.evaluate(lerEstado), null, 2));

  await clicarAba("Detalhes");
  await espera(400);

  // seta do mouse e seta do teclado
  await pagina.click('#conteudo-pasta [aria-label="Próxima foto"]');
  await espera(300);
  await pagina.click('#conteudo-pasta [aria-label="Próxima foto"]');
  await espera(300);
  console.log("APÓS 2 SETAS:", JSON.stringify(await pagina.evaluate(lerEstado), null, 2));

  await pagina.evaluate(() => {
    const alvo = document.querySelector("#conteudo-pasta [aria-roledescription='foto em destaque']");
    if (alvo instanceof HTMLElement) alvo.focus();
  });
  await pagina.keyboard.press("ArrowRight");
  await espera(300);
  console.log(
    "APÓS ARROW RIGHT:",
    JSON.stringify(await pagina.evaluate(lerEstado), null, 2),
  );

  // miniatura
  await pagina.evaluate(() => {
    const miniaturas = document.querySelectorAll("#conteudo-pasta .miniatura");
    if (miniaturas[0] instanceof HTMLElement) miniaturas[0].click();
  });
  await espera(400);
  console.log(
    "APÓS MINIATURA:",
    JSON.stringify(await pagina.evaluate(lerEstado), null, 2),
  );

  await pagina.screenshot({ path: path.join(SAIDA, "teste-pasta-aberta.png") });

  // Esc fecha e devolve o foco
  await pagina.keyboard.press("Escape");
  await espera(1200);
  console.log("APÓS ESC:", JSON.stringify(await pagina.evaluate(lerEstado), null, 2));

  await pagina.screenshot({ path: path.join(SAIDA, "teste-pasta-fechada.png") });

  // movimento reduzido: tudo pronto, sem transição
  const calmo = await navegador.newPage();
  await calmo.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await calmo.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await calmo.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await espera(2500);

  const semMovimento = await calmo.evaluate(() => {
    const letras = Array.from(document.querySelectorAll(".letra-animada"));
    const pasta = document.querySelector(".pasta");
    return {
      letrasEscondidas: letras.filter(
        (letra) => getComputedStyle(letra).opacity !== "1",
      ).length,
      totalDeLetras: letras.length,
      transicaoTitulo: letras[0]
        ? getComputedStyle(letras[0]).transitionDuration
        : "sem título",
      transicaoPasta: pasta
        ? getComputedStyle(pasta.querySelector(".pasta-interior")).transitionDuration
        : "sem pasta",
    };
  });
  console.log("MOVIMENTO REDUZIDO:", JSON.stringify(semMovimento, null, 2));

  await calmo.evaluate(() => {
    document.getElementById("fotos")?.scrollIntoView({ block: "start" });
  });
  await espera(900);
  await calmo.click("#fotos .pill-ouro");
  await espera(500);
  const pastaCalma = await calmo.evaluate(() => ({
    aberta: document.querySelector(".pasta").dataset.aberta,
    alturaInterior: document
      .querySelector(".pasta-interior")
      .getBoundingClientRect().height.toFixed(0),
  }));
  console.log("PASTA SEM MOVIMENTO:", JSON.stringify(pastaCalma, null, 2));
} finally {
  await navegador.close();
}
