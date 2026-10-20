/**
 * Conteúdo e dados do site — a única porta de entrada para os componentes.
 *
 * Dados do carro:   src/data/lt.json
 * Textos do site:   src/data/conteudo.json
 *
 * Nenhum componente deve escrever texto solto: tudo vem daqui.
 */

import lt from "@/src/data/lt.json";
import conteudo from "@/src/data/conteudo.json";

/* ---------------------------------------------------------------------------
   Dados do carro, FIPE e empresa
   --------------------------------------------------------------------------- */
export const empresa = lt.empresa;
export const fipe = lt.fipe;
export const numerosCarro = lt.numeros;
export const carro = lt.carro;
export const site = conteudo.site;

/** Número de WhatsApp é opcional: sem número, os botões não são renderizados. */
export function linkWhatsApp(mensagem?: string): string | null {
  if (!empresa.whatsapp) return null;
  const base = `https://wa.me/${empresa.whatsapp}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

export const whatsappMensagens = conteudo.whatsapp;
export const whatsappLinks = {
  geral: linkWhatsApp(conteudo.whatsapp.geral),
  testDrive: linkWhatsApp(conteudo.whatsapp.testDrive),
  troca: linkWhatsApp(conteudo.whatsapp.troca),
};

/** Autonomia de estrada com gasolina: tanque × consumo. */
export const autonomiaGasolina = Math.round(
  numerosCarro.tanqueL * numerosCarro.consumo.estrada.gasolina,
);

/* ---------------------------------------------------------------------------
   Anúncio (objeto de compatibilidade usado pelos componentes)
   --------------------------------------------------------------------------- */
export const anuncio = {
  marca: carro.marca,
  modelo: carro.modelo,
  ano: String(carro.anoModelo),
  versao: carro.versao,
  cor: carro.cor,
  portas: carro.portas,
  km: carro.km ?? conteudo.rotulos.consultar,
  preco: carro.preco,
  precoObservacao: carro.preco ? null : conteudo.hero.nota,
  cidade: empresa.endereco,
  telefone: empresa.telefone,
  documento: conteudo.rotulos.consultar,
  cambio: "Manual, 5 marchas",
  combustivel: "Flex (etanol e gasolina)",
  whatsapp: whatsappLinks.geral ?? "#contato",
  whatsappNumero: empresa.whatsapp ?? "",
  whatsappVisivel: empresa.whatsappVisivel ?? conteudo.rotulos.consultar,
  whatsappMensagem: conteudo.whatsapp.geral,
};

/** Texto de preço com o estado "a consultar" resolvido em um lugar só. */
export const precoTexto = carro.preco ?? conteudo.hero.valorConsultar;

/** Linha de contato: nunca mostra "null" na tela nem link sem número. */
export const contatoTexto =
  empresa.telefone ??
  (empresa.whatsapp
    ? `WhatsApp ${empresa.whatsappVisivel}`
    : conteudo.rotulos.consultar);

export const rodapeTexto = `Anúncio da ${empresa.nome}: ${carro.versao}, ${carro.cor.toLowerCase()}, ${carro.portas}. ${conteudo.rodape.aviso}`;

export const rotulos = conteudo.rotulos;
export const navegacao = conteudo.navegacao;
export const hero = conteudo.hero;
export const apresentacao = conteudo.apresentacao;
export const dores = conteudo.dores;
export const beneficios = conteudo.beneficios;
export const numerosSecao = conteudo.numeros;
export const preco = conteudo.preco;
export const compraSemSusto = conteudo.compraSemSusto;
export const perguntas = conteudo.perguntas;
export const quiz = conteudo.quiz;
export const chamadaFinal = {
  ...conteudo.chamadaFinal,
  /** compatibilidade com o componente antigo de banner */
  subtitulo: conteudo.chamadaFinal.texto,
};
export const vozDoCelta = conteudo.voz;
export const rodapeInfo = conteudo.rodape;

/* ---------------------------------------------------------------------------
   Formatação compartilhada (servidor e cliente produzem o mesmo texto)
   --------------------------------------------------------------------------- */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatarNumero(valor: number, casas = 0): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(valor);
}

export const fipeTexto = formatarMoeda(fipe.valor);

/** Percentual abaixo da FIPE (positivo = abaixo da tabela). */
export function percentualAbaixoDaFipe(precoPedido: number): number {
  return Math.round(((fipe.valor - precoPedido) / fipe.valor) * 100);
}

/* ---------------------------------------------------------------------------
   Fotos reais do carro
   --------------------------------------------------------------------------- */
export type RegiaoFoto = "Exterior" | "Interior" | "Motor" | "Detalhes";

export type FotoGaleria = {
  arquivo: string;
  alt: string;
  rotulo: string;
  nota: string | null;
  /** proporção usada na moldura (largura / altura da foto original) */
  aspecto: number;
  regiao: RegiaoFoto;
};

const legendas = conteudo.fotos.legendas as Record<string, string | null>;

export const fotosDoCarro: FotoGaleria[] = (
  conteudo.fotos.itens as Array<Omit<FotoGaleria, "nota">>
).map((item) => ({
  ...item,
  nota: legendas[item.arquivo] ?? null,
}));

export function foto(arquivo: string): FotoGaleria {
  const achada = fotosDoCarro.find((item) => item.arquivo === arquivo);
  if (!achada) throw new Error(`Foto não encontrada em conteudo.json: ${arquivo}`);
  return achada;
}

/* ---------------------------------------------------------------------------
   Seções
   --------------------------------------------------------------------------- */
export const galeriaAssimetrica = {
  ...conteudo.fotos.galeria,
  destaque: foto(conteudo.fotos.galeria.destaque),
  laterais: conteudo.fotos.galeria.laterais.map((arquivo) => foto(arquivo)),
};

export type AbaPasta = RegiaoFoto | "Todas";

export const pastaFotos = {
  ...conteudo.fotos.pasta,
  abas: conteudo.fotos.pasta.abas as AbaPasta[],
};

export const bannerContato = {
  rotulo: chamadaFinal.rotulo,
  foto: conteudo.video.capa,
};

export const videoPromocional = {
  ...conteudo.video,
  legenda: conteudo.video.aviso,
};

/* ---------------------------------------------------------------------------
   Barra de números
   --------------------------------------------------------------------------- */
export type NumeroBarra = {
  valor: string;
  rotulo: string;
  /** quando presente, o número é animado de 0 até ele */
  numero?: number;
  formato?: "ano" | "milhar" | "moeda" | "decimal" | "inteiro";
  /** sufixo mostrado depois do número animado (m, L, km...) */
  sufixo?: string;
};

export const barraNumeros: NumeroBarra[] = [
  {
    numero: numerosCarro.comprimentoM,
    formato: "decimal",
    sufixo: " m",
    valor: "3,79 m",
    rotulo: numerosSecao.rotulos[0],
  },
  {
    numero: numerosCarro.lugares,
    formato: "inteiro",
    valor: String(numerosCarro.lugares),
    rotulo: numerosSecao.rotulos[1],
  },
  {
    numero: numerosCarro.portaMalasL,
    formato: "inteiro",
    sufixo: " L",
    valor: `${numerosCarro.portaMalasL} L`,
    rotulo: numerosSecao.rotulos[2],
  },
  {
    numero: autonomiaGasolina,
    formato: "inteiro",
    sufixo: " km",
    valor: `${autonomiaGasolina} km`,
    rotulo: numerosSecao.rotulos[3],
  },
];

/* ---------------------------------------------------------------------------
   Motor de scroll
   --------------------------------------------------------------------------- */
/** Centros de pausa (0-1) do motor de scroll — casam com a ordem dos overlays. */
export const centroSecoes = [0.06, 0.21, 0.365, 0.525, 0.685, 0.885];

export const rotuloSecoes = apresentacao.rotulos;
