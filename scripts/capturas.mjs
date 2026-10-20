/**
 * Capturas de revisão visual do site (só desenvolvimento).
 *
 * Uso:
 *   node scripts/capturas.mjs [url] [pasta-de-saida]
 *
 * Requer o Chrome instalado e o servidor do Next rodando.
 */

import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const URL_BASE = process.argv[2] ?? "http://localhost:3000";
const SAIDA = process.argv[3] ?? ".capturas";

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

const PROGRESSOS = [0, 0.06, 0.14, 0.21, 0.3, 0.365, 0.45, 0.525, 0.62, 0.685, 0.8, 0.885, 0.97];

const navegador = await puppeteer.launch({
  executablePath: await acharNavegador(),
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--no-sandbox"],
});

try {
  await mkdir(SAIDA, { recursive: true });

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
  await new Promise((r) => setTimeout(r, 800));

  const recorte = await pagina.evaluate(() => {
    const secao = document.getElementById("apresentacao");
    if (!secao) return { topo: 0, alturaRolavel: 1 };
    const rect = secao.getBoundingClientRect();
    return {
      topo: rect.top + window.scrollY,
      alturaRolavel: Math.max(1, rect.height - window.innerHeight),
    };
  });

  for (const progresso of PROGRESSOS) {
    const y = Math.round(recorte.topo + recorte.alturaRolavel * progresso);
    await pagina.evaluate((alvo) => window.scrollTo({ top: alvo }), y);
    await new Promise((r) => setTimeout(r, 700));
    const nome = `scroll-${String(Math.round(progresso * 100)).padStart(2, "0")}pct.png`;
    await pagina.screenshot({ path: path.join(SAIDA, nome) });
    console.log(`salvo: ${nome}`);
  }

  // seções na ordem da página
  async function irPara(alvo, id, desconto = 90) {
    await alvo.evaluate(
      ({ alvoId, alvoDesconto }) => {
        const el = document.getElementById(alvoId);
        window.scrollTo({
          top: el ? el.getBoundingClientRect().top + window.scrollY - alvoDesconto : 0,
        });
      },
      { alvoId: id, alvoDesconto: desconto },
    );
    await new Promise((r) => setTimeout(r, 1300));
  }

  for (const [id, nome] of [
    ["sobre", "sobre.png"],
    ["destaque", "destaque.png"],
    ["galeria", "galeria.png"],
    ["fotos", "pasta-fechada.png"],
  ]) {
    await irPara(pagina, id);
    await pagina.screenshot({ path: path.join(SAIDA, nome) });
    console.log(`salvo: ${nome}`);
  }

  // a pasta aberta: foto grande, abas e miniaturas
  await pagina.click("#fotos .pill-ouro");
  await new Promise((r) => setTimeout(r, 1400));
  await pagina.screenshot({ path: path.join(SAIDA, "pasta-aberta.png") });
  console.log("salvo: pasta-aberta.png");

  await pagina.evaluate(() => {
    const abas = Array.from(document.querySelectorAll("#conteudo-pasta .aba"));
    const interior = abas.find((botao) => botao.textContent?.trim() === "Interior");
    if (interior instanceof HTMLElement) interior.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await pagina.screenshot({ path: path.join(SAIDA, "pasta-interior.png") });
  console.log("salvo: pasta-interior.png");

  for (const [id, nome] of [
    ["video", "video.png"],
    ["fatos", "fatos.png"],
    ["contato", "contato.png"],
  ]) {
    await irPara(pagina, id);
    await pagina.screenshot({ path: path.join(SAIDA, nome) });
    console.log(`salvo: ${nome}`);
  }

  await pagina.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
  await new Promise((r) => setTimeout(r, 1200));
  await pagina.screenshot({ path: path.join(SAIDA, "rodape.png") });
  console.log("salvo: rodape.png");

  // mobile
  const celular = await navegador.newPage();
  await celular.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await celular.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 3000));
  await celular.screenshot({ path: path.join(SAIDA, "mobile-topo.png") });
  await celular.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.4 }));
  await new Promise((r) => setTimeout(r, 900));
  await celular.screenshot({ path: path.join(SAIDA, "mobile-meio.png") });

  const recorteMobile = await celular.evaluate(() => {
    const secao = document.getElementById("apresentacao");
    if (!secao) return { topo: 0, alturaRolavel: 1 };
    const rect = secao.getBoundingClientRect();
    return {
      topo: rect.top + window.scrollY,
      alturaRolavel: Math.max(1, rect.height - window.innerHeight),
    };
  });
  for (const progresso of [0.525, 0.685, 0.885]) {
    await celular.evaluate(
      (alvo) => window.scrollTo({ top: alvo }),
      Math.round(recorteMobile.topo + recorteMobile.alturaRolavel * progresso),
    );
    await new Promise((r) => setTimeout(r, 900));
    await celular.screenshot({
      path: path.join(SAIDA, `mobile-${Math.round(progresso * 100)}pct.png`),
    });
  }

  for (const [id, nome] of [
    ["sobre", "mobile-sobre.png"],
    ["destaque", "mobile-destaque.png"],
    ["galeria", "mobile-galeria.png"],
    ["fotos", "mobile-pasta-fechada.png"],
  ]) {
    await irPara(celular, id, 70);
    await celular.screenshot({ path: path.join(SAIDA, nome) });
    console.log(`salvo: ${nome}`);
  }

  await celular.click("#fotos .pill-ouro");
  await new Promise((r) => setTimeout(r, 1400));
  await celular.screenshot({ path: path.join(SAIDA, "mobile-pasta-aberta.png") });
  console.log("salvo: mobile-pasta-aberta.png");

  for (const [id, nome] of [
    ["video", "mobile-video.png"],
    ["fatos", "mobile-fatos.png"],
    ["contato", "mobile-contato.png"],
  ]) {
    await irPara(celular, id, 70);
    await celular.screenshot({ path: path.join(SAIDA, nome) });
    console.log(`salvo: ${nome}`);
  }
} finally {
  await navegador.close();
}
