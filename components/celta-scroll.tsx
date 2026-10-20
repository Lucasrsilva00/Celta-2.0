"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  anuncio,
  beneficios,
  carro,
  centroSecoes,
  chamadaFinal,
  compraSemSusto,
  dores,
  empresa,
  fipe,
  fipeTexto,
  formatarMoeda,
  hero,
  preco as precoSecao,
  precoTexto,
  rotulos,
  rotuloSecoes,
  site,
  vozDoCelta,
  whatsappLinks,
} from "@/lib/conteudo";
import { LetrasAnimadas } from "@/components/letras-animadas";

/* ---------------------------------------------------------------------------
   Constantes do motor
   --------------------------------------------------------------------------- */
const TOTAL_QUADROS = 119;
const DWELL_LARGURA = 0.045;
const DWELL_PICO = 3.5;
const LERP = 0.09;
const RESOLUCAO_LUT = 2000;
const RAIO_VISIVEL = 0.085;
const CONCORRENCIA = 6;
const LIMITE_LIBERAR = 46;

const DIRETORIOS = { desktop: "desktop", mobile: "mobile" } as const;

function urlQuadro(pasta: string, indice: number) {
  return `/quadros/${pasta}/frame-${String(indice + 1).padStart(4, "0")}.webp`;
}

/** Tabela de remap: a rolagem crua vira progresso efetivo, com "quase-paradas". */
function construirRemap() {
  const n = RESOLUCAO_LUT;
  const densidade = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    const p = i / (n - 1);
    let acumulado = 0;
    for (const centro of centroSecoes) {
      const d = p - centro;
      acumulado += Math.exp(-(d * d) / (2 * DWELL_LARGURA * DWELL_LARGURA));
    }
    densidade[i] = 1 + (DWELL_PICO * acumulado) / centroSecoes.length;
  }

  const acumulada = new Float32Array(n);
  let soma = 0;
  for (let i = 0; i < n; i++) {
    soma += densidade[i];
    acumulada[i] = soma;
  }
  for (let i = 0; i < n; i++) acumulada[i] /= soma;

  const inversa = new Float32Array(n);
  let j = 0;
  for (let i = 0; i < n; i++) {
    const alvo = i / (n - 1);
    while (j < n - 1 && acumulada[j] < alvo) j++;
    inversa[i] = j / (n - 1);
  }
  return inversa;
}

/* ---------------------------------------------------------------------------
   Ícones (SVG de linha — nunca emoji)
   --------------------------------------------------------------------------- */
const CAMINHOS: Record<string, ReactNode> = {
  economia: (
    <>
      <path d="M5 21V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16" />
      <path d="M4 21h10" />
      <path d="M7 8h4" />
      <path d="M13 10h3a2 2 0 0 1 2 2v5.5a1.75 1.75 0 0 0 3.5 0V10l-2-3" />
    </>
  ),
  escudo: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  compacto: (
    <>
      <path d="M3 13l1.7-4.3A2 2 0 0 1 6.6 7.4h10.8a2 2 0 0 1 1.9 1.3L21 13v5h-3" />
      <path d="M6 18H3v-5h18" />
      <circle cx="7.6" cy="18.2" r="1.6" />
      <circle cx="16.4" cy="18.2" r="1.6" />
    </>
  ),
  dia: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 10h17" />
      <path d="M8 3.2v3.4" />
      <path d="M16 3.2v3.4" />
      <path d="M8 14h3" />
    </>
  ),
  revenda: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20.5 4v4.5H16" />
    </>
  ),
  imposto: (
    <>
      <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" />
      <path d="M14 3.5v5h5" />
      <path d="M9.5 13h5" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  motor: (
    <>
      <path d="M4 10h8.5v6.5H4z" />
      <path d="M12.5 12h3l2.5 2.4v2.1h-5.5z" />
      <path d="M6.5 10V6.8h5.5V10" />
      <path d="M3 20h18" />
    </>
  ),
  local: (
    <>
      <path d="M12 21.5s6.5-5.9 6.5-10.7a6.5 6.5 0 1 0-13 0C5.5 15.6 12 21.5 12 21.5z" />
      <circle cx="12" cy="10.7" r="2.4" />
    </>
  ),
  marcha: (
    <>
      <path d="M7 5.5v13" />
      <path d="M7 12h9" />
      <path d="M16 12V7" />
      <circle cx="7" cy="4.5" r="1.6" />
      <circle cx="7" cy="19.5" r="1.6" />
      <circle cx="16" cy="6" r="1.6" />
      <circle cx="16" cy="12" r="1.6" />
    </>
  ),
};

function Icone({ nome, className }: { nome: string; className?: string }) {
  const caminho = CAMINHOS[nome] ?? CAMINHOS.motor;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {caminho}
    </svg>
  );
}

export function CeltaScroll() {
  const secaoRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particulasRef = useRef<HTMLCanvasElement | null>(null);
  const pontoRef = useRef<HTMLDivElement | null>(null);
  const anelRef = useRef<HTMLDivElement | null>(null);
  const tintRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const barraRef = useRef<HTMLDivElement | null>(null);
  const contadorRef = useRef<HTMLSpanElement | null>(null);
  const barraMobileRef = useRef<HTMLDivElement | null>(null);
  const vazadoRef = useRef<HTMLSpanElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const overlaysRef = useRef<Array<HTMLElement | null>>([]);

  const [carregando, setCarregando] = useState(true);
  const [ativo, setAtivo] = useState(0);

  const irParaSecao = useCallback((indice: number) => {
    const secao = secaoRef.current;
    if (!secao) return;
    const rect = secao.getBoundingClientRect();
    const topo =
      rect.top +
      window.scrollY +
      centroSecoes[indice] * Math.max(0, rect.height - window.innerHeight);
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: topo, behavior: semMovimento ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const secao = secaoRef.current;
    const canvas = canvasRef.current;
    if (!secao || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pasta = window.innerWidth < 768 ? DIRETORIOS.mobile : DIRETORIOS.desktop;
    const remap = construirRemap();

    let larguraCss = 0;
    let alturaCss = 0;
    let quadroAtual = 0;
    let ultimoIndice = -1;
    let ultimoAtivo = -1;
    let animacao = 0;
    let particulasAnimacao = 0;
    let topo = 0;
    let alturaSecao = 0;
    let alturaJanela = 0;
    let veu: CanvasGradient | null = null;
    let saidaAnterior = -1;
    let vazadoAnterior = -1;
    let brutoAnterior = -1;
    let tintAnterior = -1;

    /* pausa o trabalho pesado quando a apresentação sai da viewport */
    let emCena = true;

    const quadros: Array<ImageBitmap | HTMLImageElement | undefined> = new Array(
      TOTAL_QUADROS,
    );
    let ultimoQuadro: ImageBitmap | HTMLImageElement | undefined;
    let carregados = 0;
    let liberado = false;
    let liberacaoForcada = 0;

    /* ------------------------------- medição ------------------------------ */
    const medir = () => {
      const rect = secao.getBoundingClientRect();
      topo = rect.top + window.scrollY;
      alturaSecao = rect.height;
      alturaJanela = window.innerHeight;
    };

    const ajustarCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const largura = canvas.clientWidth;
      const altura = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(largura * dpr));
      canvas.height = Math.max(1, Math.round(altura * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      larguraCss = largura;
      alturaCss = altura;
      /* véu criado uma vez por redimensionamento, não por quadro desenhado */
      veu = ctx.createLinearGradient(0, alturaCss * 0.6, 0, alturaCss);
      if (veu) {
        veu.addColorStop(0, "rgba(3, 3, 4, 0)");
        veu.addColorStop(0.5, "rgba(3, 3, 4, 0.45)");
        veu.addColorStop(0.82, "rgba(3, 3, 4, 0.85)");
        veu.addColorStop(1, "rgba(3, 3, 4, 1)");
      }
      ultimoIndice = -1;
      desenhar(Math.round(quadroAtual));
    };

    const desenhar = (indice: number) => {
      const fonte = quadros[indice] ?? ultimoQuadro;
      if (!fonte || !larguraCss) return;
      const larguraFonte = fonte.width;
      const alturaFonte = fonte.height;
      if (!larguraFonte || !alturaFonte) return;
      const escala = Math.max(larguraCss / larguraFonte, alturaCss / alturaFonte);
      const largura = larguraFonte * escala;
      const altura = alturaFonte * escala;
      ctx.clearRect(0, 0, larguraCss, alturaCss);
      ctx.drawImage(
        fonte,
        (larguraCss - largura) / 2,
        (alturaCss - altura) / 2,
        largura,
        altura,
      );
      ctx.fillStyle = veu ?? "rgba(3, 3, 4, 1)";
      ctx.fillRect(0, alturaCss * 0.6, larguraCss, alturaCss * 0.4);
    };

    const desenharQuadroMaisProximo = (indice: number) => {
      for (let passo = 1; passo < TOTAL_QUADROS; passo++) {
        const antes = quadros[indice - passo];
        if (antes) return desenhar(indice - passo);
        const depois = quadros[indice + passo];
        if (depois) return desenhar(indice + passo);
      }
    };

    /* --------------------------- carregamento ---------------------------- */
    const carregarQuadro = async (indice: number) => {
      const url = urlQuadro(pasta, indice);
      try {
        const resposta = await fetch(url, { cache: "force-cache" });
        if (!resposta.ok) throw new Error(String(resposta.status));
        const blob = await resposta.blob();
        let fonte: ImageBitmap | HTMLImageElement;
        if (typeof createImageBitmap === "function") {
          fonte = await createImageBitmap(blob);
        } else {
          fonte = await new Promise<HTMLImageElement>((resolver, rejeitar) => {
            const img = new Image();
            img.onload = () => resolver(img);
            img.onerror = rejeitar;
            img.src = url;
          });
        }
        quadros[indice] = fonte;
        if (indice === 0) {
          ultimoQuadro = fonte;
          ajustarCanvas();
        }
      } catch {
        /* quadro com falha: o vizinho mais próximo cobre a lacuna */
      }

      carregados++;
      const porcentagem = Math.round((carregados / TOTAL_QUADROS) * 100);
      if (contadorRef.current) contadorRef.current.textContent = `${porcentagem}%`;
      if (barraRef.current) barraRef.current.style.width = `${porcentagem}%`;

      if (!liberado && (carregados >= LIMITE_LIBERAR || carregados === TOTAL_QUADROS)) {
        liberado = true;
        esconderLoader();
      }
    };

    const carregarTudo = async () => {
      const ordem: number[] = [0];
      for (let i = 12; i < TOTAL_QUADROS; i += 12) ordem.push(i);
      for (let i = 1; i < TOTAL_QUADROS; i++) if (!ordem.includes(i)) ordem.push(i);

      const fila = [...ordem];
      const trabalhadores = Array.from({ length: CONCORRENCIA }, async () => {
        while (fila.length > 0) {
          const indice = fila.shift();
          if (indice === undefined) break;
          await carregarQuadro(indice);
        }
      });
      await Promise.all(trabalhadores);
    };

    const esconderLoader = () => {
      const loader = loaderRef.current;
      setCarregando(false);
      if (!loader) return;
      loader.classList.add("saindo");
      window.setTimeout(() => {
        loader.style.display = "none";
      }, 600);
    };

    /* ------------------------------ overlays ----------------------------- */
    /* valores já escritos: só atualiza o DOM quando o valor muda de fato */
    const NAO_ESCRITO = -1;
    const escrito = overlaysRef.current.map(() => ({
      suave: NAO_ESCRITO,
      filtro: "",
    }));

    const atualizarOverlays = (progresso: number) => {
      let maiorVisibilidade = 0;

      overlaysRef.current.forEach((el, indice) => {
        if (!el) return;
        const distancia = Math.abs(progresso - centroSecoes[indice]);
        let visibilidade = Math.max(0, 1 - distancia / RAIO_VISIVEL);
        const primeiro = indice === 0;
        const ultimo = indice === centroSecoes.length - 1;
        // nas pontas da rolagem a seção fica 100% visível (topo e fim de página)
        if (primeiro && progresso <= centroSecoes[indice]) visibilidade = 1;
        if (ultimo && progresso >= centroSecoes[indice]) visibilidade = 1;
        const suave = visibilidade * visibilidade * (3 - 2 * visibilidade);
        maiorVisibilidade = Math.max(maiorVisibilidade, suave);

        // quantizada em 60 degraus: reescreve apenas ao cruzar um degrau
        const degrau = Math.round(suave * 60) / 60;
        const cache = escrito[indice];
        if (degrau !== cache.suave) {
          cache.suave = degrau;
          el.style.opacity = degrau.toFixed(3);
          el.style.transform = `translateX(${(-20 * (1 - degrau)).toFixed(1)}px)`;
          const filtro =
            degrau > 0.985 || degrau < 0.015
              ? "none"
              : `blur(${(2.5 * (1 - degrau)).toFixed(1)}px)`;
          if (filtro !== cache.filtro) {
            cache.filtro = filtro;
            el.style.filter = filtro;
          }
        }

        const ativoAgora = suave > 0.5;
        if (el.dataset.ativo !== String(ativoAgora)) {
          el.dataset.ativo = String(ativoAgora);
          el.inert = !ativoAgora;
        }
      });

      const tint = tintRef.current;
      if (tint) {
        const opacidadeTint = Math.round((0.15 + 0.55 * (1 - maiorVisibilidade)) * 100) / 100;
        if (opacidadeTint !== tintAnterior) {
          tintAnterior = opacidadeTint;
          tint.style.opacity = opacidadeTint.toFixed(2);
        }
      }
    };

    /* ------------------------------- loop -------------------------------- */
    const progressoBruto = () =>
      Math.min(1, Math.max(0, (window.scrollY - topo) / Math.max(1, alturaSecao - alturaJanela)));

    let pontoX = 0;
    let pontoY = 0;
    let anelX = 0;
    let anelY = 0;

    const laco = () => {
      if (!emCena) {
        // fora da viewport: nenhum trabalho, só o próprio batimento do relógio
        animacao = requestAnimationFrame(laco);
        return;
      }

      const bruto = progressoBruto();
      const efetivo = remap[Math.round(bruto * (RESOLUCAO_LUT - 1))] ?? bruto;

      const alvo = Math.floor(efetivo * (TOTAL_QUADROS - 1));
      quadroAtual += (alvo - quadroAtual) * LERP;
      const indice = Math.round(quadroAtual);
      if (indice !== ultimoIndice) {
        ultimoIndice = indice;
        if (quadros[indice]) desenhar(indice);
        else desenharQuadroMaisProximo(indice);
      }

      atualizarOverlays(bruto);

      let melhor = 0;
      let melhorDistancia = Number.POSITIVE_INFINITY;
      centroSecoes.forEach((centro, i) => {
        const distancia = Math.abs(bruto - centro);
        if (distancia < melhorDistancia) {
          melhorDistancia = distancia;
          melhor = i;
        }
      });
      if (melhor !== ultimoAtivo) {
        ultimoAtivo = melhor;
        setAtivo(melhor);
      }

      if (barraMobileRef.current && bruto !== brutoAnterior) {
        brutoAnterior = bruto;
        barraMobileRef.current.style.transform = `scaleX(${bruto.toFixed(4)})`;
      }

      // marcadores e barra de progresso desaparecem quando a seção animada sai de cena
      const saida = Math.min(
        1,
        Math.max(
          0,
          (window.scrollY - (topo + alturaSecao - alturaJanela * 0.45)) /
            (alturaJanela * 0.3),
        ),
      );
      if (saida !== saidaAnterior) {
        saidaAnterior = saida;
        if (navRef.current) {
          navRef.current.style.opacity = saida.toFixed(2);
          navRef.current.style.pointerEvents = saida > 0.5 ? "none" : "auto";
        }
        if (barraMobileRef.current) {
          barraMobileRef.current.style.opacity = saida.toFixed(2);
        }
      }

      if (vazadoRef.current) {
        // a assinatura tipográfica só entra depois que o título da abertura sai de cena
        const aparecer = Math.min(1, Math.max(0, (bruto - 0.11) / 0.09));
        const opacidadeVazado = Math.round(aparecer * 60) * 0.015;
        if (opacidadeVazado !== vazadoAnterior) {
          vazadoAnterior = opacidadeVazado;
          vazadoRef.current.style.opacity = (0.9 * opacidadeVazado).toFixed(3);
        }
      }

      if (!semMovimento) {
        anelX += (pontoX - anelX) * 0.15;
        anelY += (pontoY - anelY) * 0.15;
        if (anelRef.current) {
          anelRef.current.style.transform = `translate(${anelX.toFixed(1)}px, ${anelY.toFixed(1)}px)`;
        }
      }

      animacao = requestAnimationFrame(laco);
    };

    /* ----------------------------- interações ---------------------------- */
    const aoMover = (evento: PointerEvent) => {
      pontoX = evento.clientX;
      pontoY = evento.clientY;
      if (pontoRef.current) {
        pontoRef.current.style.transform = `translate(${pontoX}px, ${pontoY}px)`;
      }
    };

    const aoPassar = (evento: Event) => {
      const alvo = evento.target as HTMLElement | null;
      const interativo = alvo?.closest("a, button");
      anelRef.current?.classList.toggle("sobre", Boolean(interativo));
    };

    const aoRedimensionar = () => {
      medir();
      ajustarCanvas();
    };

    /* ----------------------------- partículas ---------------------------- */
    const iniciarParticulas = () => {
      const canvasParticulas = particulasRef.current;
      if (!canvasParticulas || semMovimento) return;
      const pctx = canvasParticulas.getContext("2d");
      if (!pctx) return;

      const redimensionar = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvasParticulas.width = Math.round(window.innerWidth * dpr);
        canvasParticulas.height = Math.round(window.innerHeight * dpr);
        pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      redimensionar();

      const pontos = Array.from({ length: 40 }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.00006,
        vy: (Math.random() - 0.5) * 0.00006,
        raio: 0.3 + Math.random() * 1.5,
        opacidade: 0.05 + Math.random() * 0.3,
      }));

      let anterior = performance.now();

      const desenharParticulas = (agora: number) => {
        const delta = Math.min(64, agora - anterior);
        anterior = agora;
        const largura = window.innerWidth;
        const altura = window.innerHeight;
        pctx.clearRect(0, 0, largura, altura);

        for (const ponto of pontos) {
          ponto.x += ponto.vx * delta;
          ponto.y += ponto.vy * delta;
          if (ponto.x < 0) ponto.x = 1;
          if (ponto.x > 1) ponto.x = 0;
          if (ponto.y < 0) ponto.y = 1;
          if (ponto.y > 1) ponto.y = 0;

          pctx.beginPath();
          pctx.fillStyle = `rgba(255, 255, 255, ${ponto.opacidade})`;
          pctx.arc(ponto.x * largura, ponto.y * altura, ponto.raio, 0, Math.PI * 2);
          pctx.fill();
        }

        particulasAnimacao = requestAnimationFrame(desenharParticulas);
      };

      particulasAnimacao = requestAnimationFrame(desenharParticulas);
    };

    /* ------------------------------- init -------------------------------- */
    medir();
    ajustarCanvas();
    atualizarOverlays(0);
    animacao = requestAnimationFrame(laco);
    window.addEventListener("resize", aoRedimensionar);
    window.addEventListener("pointermove", aoMover, { passive: true });
    document.addEventListener("pointerover", aoPassar, { passive: true });

    const observador = new ResizeObserver(() => medir());
    observador.observe(secao);

    /* o motor descansa quando a apresentação sai da tela */
    const observadorCena = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) emCena = entrada.isIntersecting;
    }, { rootMargin: "0px 0px 12% 0px" });
    if (canvas.parentElement) observadorCena.observe(canvas.parentElement);

    if (semMovimento) {
      void carregarQuadro(0).then(() => esconderLoader());
    } else {
      iniciarParticulas();
      void carregarTudo();
      // em conexões lentas a página não fica presa no loader
      liberacaoForcada = window.setTimeout(() => {
        if (!liberado) {
          liberado = true;
          esconderLoader();
        }
      }, 5000);
    }

    return () => {
      cancelAnimationFrame(animacao);
      cancelAnimationFrame(particulasAnimacao);
      window.clearTimeout(liberacaoForcada);
      window.removeEventListener("resize", aoRedimensionar);
      window.removeEventListener("pointermove", aoMover);
      document.removeEventListener("pointerover", aoPassar);
      observador.disconnect();
      observadorCena.disconnect();
      quadros.forEach((fonte) => {
        if (fonte && typeof ImageBitmap !== "undefined" && fonte instanceof ImageBitmap) {
          fonte.close();
        }
      });
    };
  }, []);

  return (
    <>
      {/* camadas ambientes */}
      <div className="grao" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />
      <div className="vinheta" aria-hidden="true" />
      <canvas
        ref={particulasRef}
        className="pointer-events-none fixed inset-0 z-[15] h-full w-full"
        aria-hidden="true"
      />

      {/* cursor customizado */}
      <div ref={pontoRef} className="cursor-ponto" aria-hidden="true" />
      <div ref={anelRef} className="cursor-anel" aria-hidden="true" />

      {/* progresso mobile */}
      <div
        ref={barraMobileRef}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-ouro md:hidden"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />

      {/* loader */}
      {carregando && (
        <div ref={loaderRef} className="loader" role="status" aria-live="polite">
          <div className="flex flex-col items-center gap-5">
            <span className="h-px w-40 bg-white/20" aria-hidden="true" />
            <svg
              viewBox="0 0 24 20"
              className="h-7 w-9 text-ouro"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.4}
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 7.5h6l2.5-3 2.5 3h6v5h-6l-2.5 3-2.5-3h-6z" />
            </svg>
            <p className="display text-3xl tracking-[0.42em] text-gelo">
              {site.marca}
            </p>
            <span className="text-[11px] uppercase tracking-[0.28em] text-nevoa">
              {vozDoCelta.carregando}
            </span>
            <span className="h-px w-40 bg-white/20" aria-hidden="true" />
            <span className="loader-barra" aria-hidden="true">
              <span ref={barraRef} className="loader-progresso block" />
            </span>
            <span className="numerico text-xs tracking-[0.3em] text-grafite">
              <span ref={contadorRef}>0%</span>
              <span className="sr-only">
                — carregando a apresentação do {anuncio.modelo} {anuncio.ano}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* marcadores de capítulo */}
      <nav
        ref={navRef}
        aria-label="Seções da apresentação"
        className="marcadores fixed right-3 top-1/2 z-50 hidden -translate-y-1/2 flex-col transition-opacity duration-300 md:flex"
      >
        {rotuloSecoes.map((rotulo, indice) => (
          <button
            key={rotulo}
            type="button"
            className="marcador"
            aria-current={ativo === indice ? "true" : "false"}
            aria-label={`Ir para ${rotulo}`}
            onClick={() => irParaSecao(indice)}
          >
            <span className="marcador-rotulo">{rotulo}</span>
            <span className="marcador-ponto" aria-hidden="true" />
          </button>
        ))}
      </nav>

      {/* apresentação animada */}
      <section
        ref={secaoRef}
        id="apresentacao"
        aria-labelledby="titulo-celta"
        className="relative"
        style={{ height: "var(--altura-animacao)" }}
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <span
            ref={vazadoRef}
            aria-hidden="true"
            className="display vazado pointer-events-none absolute inset-x-0 bottom-[-3.5vw] z-[5] text-center text-[clamp(140px,26vw,420px)]"
            style={{ opacity: 0 }}
          >
            {site.marca}
          </span>

          <canvas
            ref={canvasRef}
            role="img"
            aria-label={`Animação tridimensional do Chevrolet ${anuncio.modelo} ${anuncio.ano}, controlada pela rolagem da página`}
            className="absolute inset-0 z-[1] h-full w-full"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 z-[2] bg-gradient-to-r from-preto/85 via-preto/35 to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-[2] h-64 bg-gradient-to-t from-preto via-preto/85 to-transparent"
          />
          <div
            ref={tintRef}
            aria-hidden="true"
            className="absolute inset-0 z-[3]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(212,168,54,0.10), transparent 45%, rgba(255,255,255,0.05))",
            }}
          />

          <p className="pointer-events-none absolute bottom-20 left-[6%] z-[11] rounded-full border border-white/10 bg-preto/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-nevoa backdrop-blur-sm md:bottom-5">
            {rotulos.animacaoIlustrativa}
          </p>

          {/* 1 — Abertura */}
          <article
            ref={(el) => {
              overlaysRef.current[0] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div className="mx-auto max-h-svh w-full max-w-[1180px] overflow-y-auto px-[6%] pt-16 pb-28 md:pb-16">
              <p className="rotulo">{hero.etiqueta}</p>

              <p
                id="titulo-celta"
                className="display-forte mt-4 max-w-[16ch] text-[clamp(40px,6.4vw,88px)]"
              >
                <LetrasAnimadas texto={hero.titulo} />
                <span className="sr-only">
                  {" "}
                  {anuncio.modelo} {anuncio.ano} à venda.
                </span>
              </p>

              <p className="display mt-4 text-[clamp(30px,4.4vw,60px)] text-ouro">
                {anuncio.modelo} {anuncio.ano}
              </p>

              <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-nevoa">
                {hero.subtitulo}
              </p>

              <p className="numerico mt-7 text-[clamp(30px,4.4vw,54px)] font-semibold text-gelo">
                {precoTexto}
              </p>
              <p className="mt-1 text-sm text-grafite">{hero.nota}</p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#contato" className="pill pill-ouro" tabIndex={-1}>
                  {hero.botaoPrincipal}
                </a>
                <a href="#fotos" className="pill" tabIndex={-1}>
                  {hero.botaoSecundario}
                </a>
              </div>

              <p className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-grafite">
                <span className="h-px w-8 bg-ouro/70" aria-hidden="true" />
                {hero.dicaRolagem}
              </p>
              <p className="sr-only">{vozDoCelta.abertura}</p>
            </div>
          </article>

          {/* 2 — Dores */}
          <article
            ref={(el) => {
              overlaysRef.current[1] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div className="scrim" aria-hidden="true" />
            <div className="relative mx-auto max-h-svh w-full max-w-[900px] overflow-y-auto px-[6%] pt-16 pb-24 md:pb-16">
              <h2 className="display text-[clamp(34px,4.6vw,64px)]">{dores.titulo}</h2>

              <ul className="mt-7 space-y-4">
                {dores.itens.map((item) => (
                  <li key={item.texto} className="flex items-center gap-4">
                    <Icone nome={item.icone} className="h-6 w-6 shrink-0 text-ouro" />
                    <span className="text-[17px] leading-snug text-nevoa">
                      {item.texto}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="display-forte mt-8 text-[clamp(22px,3vw,34px)]">
                {dores.fecho}
              </p>
            </div>
          </article>

          {/* 3 — Por que o Celta LT */}
          <article
            ref={(el) => {
              overlaysRef.current[2] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div className="scrim" aria-hidden="true" />
            <div className="relative mx-auto max-h-svh w-full max-w-[1000px] overflow-y-auto px-[6%] pt-16 pb-24 md:pb-16">
              <h2 className="display text-[clamp(34px,4.6vw,64px)]">
                {beneficios.titulo}
              </h2>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {beneficios.itens.map((item) => (
                  <div key={item.titulo} className="vidro flex gap-4 p-4">
                    <Icone nome={item.icone} className="h-6 w-6 shrink-0 text-ouro" />
                    <div>
                      <h3 className="text-[15px] font-semibold text-gelo">
                        {item.titulo}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-nevoa">
                        {item.texto}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 4 — O preço */}
          <article
            ref={(el) => {
              overlaysRef.current[3] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div className="scrim" aria-hidden="true" />
            <div className="relative mx-auto max-h-svh w-full max-w-[900px] overflow-y-auto px-[6%] pt-16 pb-24 md:pb-16">
              <h2 className="display text-[clamp(34px,4.6vw,64px)]">
                {precoSecao.titulo}
              </h2>
              <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-nevoa">
                {precoSecao.texto}
              </p>

              <div className="vidro mt-7 p-5 md:p-6">
                <p className="rotulo text-ouro">{rotulos.fipe}</p>
                <p className="numerico mt-2 text-[clamp(30px,4vw,48px)] font-semibold leading-none text-gelo">
                  {fipeTexto}
                </p>
                <p className="mt-2 text-xs text-grafite">
                  Referência de {fipe.referenciaLabel} · código {fipe.codigo}
                </p>
                <p className="mt-4 text-[15px] text-nevoa">
                  Valor deste carro:{" "}
                  <span className="font-semibold text-gelo">
                    {carro.preco ? formatarMoeda(carro.preco) : rotulos.consultar}
                  </span>
                </p>
              </div>

              <a href="#preco" className="pill mt-6" tabIndex={-1}>
                Ver o preço e a calculadora
              </a>
            </div>
          </article>

          {/* 5 — Compra sem susto */}
          <article
            ref={(el) => {
              overlaysRef.current[4] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div className="scrim" aria-hidden="true" />
            <div className="relative mx-auto max-h-svh w-full max-w-[900px] overflow-y-auto px-[6%] pt-16 pb-24 md:pb-16">
              <h2 className="display text-[clamp(34px,4.6vw,64px)]">
                {compraSemSusto.titulo}
              </h2>
              <p className="mt-5 max-w-[54ch] text-[17px] leading-relaxed text-nevoa">
                {compraSemSusto.frase}
              </p>

              <ul className="mt-7 grid gap-2 sm:grid-cols-2">
                {compraSemSusto.checklist.itens.slice(0, 6).map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-nevoa">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ouro" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#compra" className="pill mt-7" tabIndex={-1}>
                Ver o checklist completo
              </a>
            </div>
          </article>

          {/* 6 — CTA */}
          <article
            ref={(el) => {
              overlaysRef.current[5] = el;
            }}
            className="overlay"
            aria-hidden="true"
          >
            <div
              className="scrim"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 70% 58% at 50% 50%, rgba(3,3,4,0.9), rgba(3,3,4,0.62) 60%, rgba(3,3,4,0.1) 100%)",
              }}
            />
            <div className="relative mx-auto max-h-svh w-full max-w-[820px] overflow-y-auto px-[6%] pt-16 pb-24 text-center md:pb-16">
              <h2 className="display text-[clamp(44px,7vw,110px)]">
                {chamadaFinal.titulo}
              </h2>
              <p className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed text-nevoa">
                {chamadaFinal.texto}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a href="#contato" className="pill pill-ouro" tabIndex={-1}>
                  {chamadaFinal.principal}
                </a>
                {whatsappLinks.testDrive && (
                  <a
                    href={whatsappLinks.testDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill"
                    tabIndex={-1}
                  >
                    {rotulos.falarWhatsapp}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => irParaSecao(0)}
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full px-5 text-[13px] font-medium text-nevoa transition-colors duration-200 hover:text-ouro"
                  tabIndex={-1}
                >
                  {chamadaFinal.secundario}
                </button>
              </div>
              <div className="vidro-escuro mt-9 inline-flex flex-col gap-1 px-6 py-5 text-left">
                <span className="text-[11px] uppercase tracking-[0.2em] text-grafite">
                  {rotulos.contatoDono}
                </span>
                <span className="numerico text-[15px] text-gelo">
                  {empresa.nome} · {anuncio.telefone ?? anuncio.whatsappVisivel}
                </span>
                <span className="text-sm text-nevoa">
                  {anuncio.cidade ?? "Atendimento com horário marcado"}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
