/**
 * Mede o desempenho do scroll animado (só desenvolvimento).
 *
 * Uso:
 *   node scripts/desempenho.mjs [url]
 *
 * Requer o Chrome instalado e o servidor do Next rodando.
 */

import puppeteer from "puppeteer-core";

const URL_BASE = process.argv[2] ?? "http://localhost:3000";

const CHROMES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
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
  throw new Error("Nenhum Chrome/Edge encontrado.");
}

const navegador = await puppeteer.launch({
  executablePath: await acharNavegador(),
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--no-sandbox"],
});

try {
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const inicio = Date.now();
  await pagina.goto(URL_BASE, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await pagina.waitForFunction(
    () => {
      const loader = document.querySelector(".loader");
      return !loader || getComputedStyle(loader).display === "none";
    },
    { timeout: 30_000 },
  );
  console.log(`primeiro quadro utilizável: ${((Date.now() - inicio) / 1000).toFixed(2)}s`);

  const resultado = await pagina.evaluate(async () => {
    const secao = document.getElementById("apresentacao");
    const topo = secao.getBoundingClientRect().top + window.scrollY;
    const distancia = Math.max(1, secao.offsetHeight - window.innerHeight);

    const tarefasLongas = [];
    const observador = new PerformanceObserver((lista) => {
      for (const entrada of lista.getEntries()) tarefasLongas.push(entrada.duration);
    });
    try {
      observador.observe({ entryTypes: ["longtask"] });
    } catch {
      /* navegador sem suporte */
    }

    let quadros = 0;
    const t0 = performance.now();
    const contar = () => {
      quadros++;
      requestAnimationFrame(contar);
    };
    requestAnimationFrame(contar);

    const passos = 1440;
    for (let i = 0; i <= passos; i++) {
      window.scrollTo(0, topo + (distancia * i) / passos);
      await new Promise((r) => requestAnimationFrame(r));
    }

    const duracao = performance.now() - t0;
    observador.disconnect();
    return {
      fps: (quadros / duracao) * 1000,
      duracao,
      quadros,
      tarefasLongas: tarefasLongas.length,
      piorTarefa: tarefasLongas.length ? Math.max(...tarefasLongas) : 0,
    };
  });

  console.log(`fps médio no scroll: ${resultado.fps.toFixed(1)}`);
  console.log(`quadros desenhados: ${resultado.quadros} em ${(resultado.duracao / 1000).toFixed(2)}s`);
  console.log(
    `tarefas longas (>50ms): ${resultado.tarefasLongas} — pior: ${resultado.piorTarefa.toFixed(0)}ms`,
  );

  const metricas = await pagina.metrics();
  console.log(
    `memória JS: ${(metricas.JSHeapUsedSize / 1024 / 1024).toFixed(1)} MB — nós do DOM: ${metricas.Nodes}`,
  );
} finally {
  await navegador.close();
}
