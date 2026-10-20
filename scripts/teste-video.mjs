/**
 * Teste do banner de vídeo (só desenvolvimento).
 *
 * Confirma que, depois do clique, o vídeo toca com áudio (não mudo), com
 * controles nativos e decodificação funcionando — e guarda capturas do estado
 * tocando em desktop e celular.
 *
 * Uso: node scripts/teste-video.mjs [url]
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
  await new Promise((r) => setTimeout(r, 900));

  const antes = await pagina.evaluate(() => {
    const video = document.querySelector("video");
    const botao = document.querySelector(".banner-clique");
    return {
      videoNoDom: Boolean(video),
      pausado: video?.paused,
      mudo: video?.muted,
      controles: video?.controls,
      faixaDeLegenda: Boolean(video?.querySelector("track")),
      preload: video?.preload,
      botaoDeToque: Boolean(botao),
      rotuloDoBotao: botao?.textContent?.trim().replace(/\s+/g, " ").slice(0, 90),
    };
  });
  console.log("ANTES DO CLIQUE:", JSON.stringify(antes, null, 2));

  await pagina.evaluate(() => {
    document.querySelector(".banner-clique")?.scrollIntoView({ block: "center" });
  });
  await new Promise((r) => setTimeout(r, 600));

  const botao = await pagina.$(".banner-clique");
  if (!botao) throw new Error("Botão de play não encontrado.");
  await botao.click();
  await new Promise((r) => setTimeout(r, 3000));

  const depois = await pagina.evaluate(() => {
    const video = document.querySelector("video");
    return {
      pausado: video.paused,
      mudo: video.muted,
      volume: video.volume,
      tempoAtual: Number(video.currentTime.toFixed(2)),
      duracao: Number.isFinite(video.duration)
        ? Number(video.duration.toFixed(2))
        : String(video.duration),
      controles: video.controls,
      pronto: video.readyState,
      resolucao: `${video.videoWidth}x${video.videoHeight}`,
      erro: video.error ? `codigo ${video.error.code}: ${video.error.message}` : null,
      botaoAindaVisivel: Boolean(document.querySelector(".banner-clique")),
      legendaDisponivel: Array.from(video.textTracks).map((t) => ({
        idioma: t.language,
        modo: t.mode,
        rotulo: t.label,
      })),
    };
  });
  console.log("DEPOIS DO CLIQUE:", JSON.stringify(depois, null, 2));

  const arquivo = await pagina.evaluate(async () => {
    const resposta = await fetch("/videos/celta-promocional.mp4", { method: "HEAD" });
    return {
      status: resposta.status,
      tipo: resposta.headers.get("content-type"),
      bytes: resposta.headers.get("content-length"),
    };
  });
  console.log("ARQUIVO:", JSON.stringify(arquivo, null, 2));

  await pagina.screenshot({ path: path.join(SAIDA, "teste-video-tocando.png") });
  console.log("salvo: teste-video-tocando.png");

  const celular = await navegador.newPage();
  await celular.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await celular.goto(URL_BASE, { waitUntil: "networkidle2", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 3500));
  await celular.evaluate(() => {
    document.getElementById("video")?.scrollIntoView({ block: "start" });
  });
  await new Promise((r) => setTimeout(r, 1400));
  await celular.screenshot({ path: path.join(SAIDA, "mobile-video-topo.png") });
  await celular.evaluate(() => window.scrollBy({ top: 330 }));
  await new Promise((r) => setTimeout(r, 1200));
  await celular.screenshot({ path: path.join(SAIDA, "mobile-video-selos.png") });
  console.log("salvo: mobile-video-topo.png, mobile-video-selos.png");
} finally {
  await navegador.close();
}
