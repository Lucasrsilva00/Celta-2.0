/**
 * Conteúdo da landing page de venda do Celta 2012.
 *
 * ATENÇÃO — PLACEHOLDERS A REVISAR ANTES DE PUBLICAR:
 *  - anuncio.preco, anuncio.cidade, anuncio.telefone, anuncio.whatsapp
 *  - anuncio.km, anuncio.documento e os itens de fatosDoCarro
 */

export const anuncio = {
  modelo: "Celta",
  ano: "2012",
  versao: "LT 1.0 Flex, 4 portas",
  preco: "R$ 32.900",
  precoObservacao: "Valor de anúncio — aberto a negociação",
  cidade: "Campinas — SP",
  km: "95.000 km",
  cambio: "Manual, 5 marchas",
  combustivel: "Flex (etanol e gasolina)",
  documento: "Documentação em dia, sem multas e IPVA pago",
  // Troque pelos seus dados reais:
  whatsapp: "https://wa.me/5511999999999",
  whatsappMensagem: "Olá! Vi o anúncio do Celta 2012 no site e queria saber mais.",
  telefone: "+55 (11) 99999-9999",
};

export const stats = [
  { valor: "1.0", rotulo: "Motor flex" },
  { valor: "70", rotulo: "Cavalos" },
  { valor: "4", rotulo: "Portas" },
  { valor: "13", rotulo: "km/l na estrada" },
];

export const visao = {
  citacao:
    "Não é o carro dos sonhos. É o carro que funciona todo dia — e é justamente por isso que ele continua na garagem de tanta gente.",
  autor: "Quem já teve um Celta",
};

export const detalhesMotor = {
  titulo: "1.0 VHC-E: o motor que qualquer oficina conhece",
  corpo:
    "Sem eletrônica exótica e sem peça difícil. O VHC-E flex roda no etanol quando o preço compensa e na gasolina quando você quiser — e no balcão da esquina tem tudo o que ele precisa.",
  itens: [
    { icone: "motor", texto: "Flex de verdade: etanol, gasolina ou a mistura dos dois." },
    { icone: "local", texto: "Peças baratas e encontradas em qualquer cidade do país." },
    { icone: "marcha", texto: "Câmbio manual de 5 marchas, trocas curtas e economia em rodovia." },
  ],
};

export const diferenciais = [
  {
    icone: "economia",
    titulo: "Econômico de verdade",
    texto: "Média alta por litro e tanque de 48 litros: menos idas ao posto a cada mês.",
  },
  {
    icone: "escudo",
    titulo: "Confiável",
    texto: "Mecânica simples, sem surpresa caras. Liga, esquenta e anda.",
  },
  {
    icone: "compacto",
    titulo: "Compacto",
    texto: "Entra na vaga apertada do centro e resolve o trânsito sem drama.",
  },
  {
    icone: "dia",
    titulo: "Feito para o dia a dia",
    texto: "Porta-malas decente, direção leve e posto de motorista confortável.",
  },
  {
    icone: "revenda",
    titulo: "Fácil de revender",
    texto: "É procurado no mercado de usados durante o ano inteiro.",
  },
  {
    icone: "imposto",
    titulo: "Custo baixo de manter",
    texto: "Seguro, IPVA e manutenção entre os mais baratos da categoria.",
  },
];

export const estadoDoCarro = {
  titulo: "Como o carro está hoje",
  corpo:
    "Anúncio de particular, sem intermediário e sem comissão. O carro roda todos os dias e pode ser visto e testado com horário marcado.",
  fatos: [
    { chave: "Versão", valor: "LT 1.0 Flex, 4 portas" },
    { chave: "Ano", valor: "2011/2012" },
    { chave: "Quilometragem", valor: anuncio.km },
    { chave: "Câmbio", valor: anuncio.cambio },
    { chave: "Documentação", valor: "Em dia, sem multas e com IPVA pago" },
    { chave: "Revisão", valor: "Feita recentemente, óleo e filtros trocados" },
    { chave: "Pneus", valor: "Boa vida útil ainda pela frente" },
    { chave: "Aceita troca", valor: "Sim, por carro de valor semelhante" },
  ],
};

export const chamadaFinal = {
  titulo: "Vem ver de perto",
  subtitulo:
    "Mando mais fotos, faço um vídeo do carro andando ou marco um horário para você olhar sem compromisso.",
  principal: "Chamar no WhatsApp",
  secundario: "Rever a apresentação",
};

/**
 * Vídeo promocional (showroom).
 *
 * O arquivo em public/videos é a versão H.264 do vídeo original, com a marca
 * d'água de terceiros removida na codificação e o áudio original preservado.
 */
export const videoPromocional = {
  titulo: "O carro em movimento",
  subtitulo:
    "Dez segundos de vídeo gravados no showroom: a pintura preta refletindo a luz e o interior visto por fora, do jeito que ele é de perto.",
  legendaTitulo: "Vídeo gravado no showroom",
  legenda:
    "Mesmo carro das fotos, com áudio. Se preferir, mando também um vídeo do motor ligado e do carro andando.",
  botao: "Marcar para ver pessoalmente",
  duracao: "10 s",
  arquivo: "/videos/celta-promocional.mp4",
  capa: "/videos/celta-promocional-capa.webp",
};

export type FotoGaleria = {
  arquivo: string;
  alt: string;
  rotulo: string;
  nota: string;
  /** proporção usada na moldura (largura / altura da foto original) */
  aspecto: number;
};

export type RegiaoFoto = "Exterior" | "Interior" | "Motor" | "Detalhes";

const regiaoPorArquivo: Record<string, RegiaoFoto> = {
  "01-vista-frontal.webp": "Exterior",
  "02-vista-3-4-diagonal.webp": "Exterior",
  "03-vista-lateral-esquerda.webp": "Exterior",
  "04-vista-traseira.webp": "Exterior",
  "05-vista-lateral-direita.webp": "Exterior",
  "06-vista-superior.webp": "Exterior",
  "07-bancos-dianteiros.webp": "Interior",
  "08-bancos-traseiros.webp": "Interior",
  "09-painel.webp": "Interior",
  "10-interior-frontal.webp": "Interior",
  "11-motor.webp": "Motor",
  "12-rodas-e-pneus.webp": "Detalhes",
  "13-farois.webp": "Detalhes",
  "14-grade-frontal.webp": "Detalhes",
  "15-detalhe-traseiro.webp": "Detalhes",
};

/**
 * As 15 fotos reais do carro, na ordem em que o anúncio faz sentido: de fora para
 * dentro, e por último os detalhes que costumam esconder problema.
 *
 * É a única fonte das fotos. `fotosDoCarro` (logo abaixo) achata os grupos em uma
 * lista, acrescenta a região de cada foto e alimenta a pasta e as demais seções.
 * Os textos das legendas são sugestões de venda: revise antes de publicar.
 */
export const fotosDoAnuncio = {
  grupos: [
    [
      {
        arquivo: "01-vista-frontal.webp",
        alt: "Frente do Celta 2012 preto, com a grade do Chevrolet, os faróis e a placa CELTA",
        rotulo: "Vista frontal",
        nota: "Frente reta, grade e faróis inteiros, sem sinal de batida.",
        aspecto: 1.9,
      },
      {
        arquivo: "02-vista-3-4-diagonal.webp",
        alt: "Celta 2012 preto visto em diagonal, mostrando a frente e a lateral direita",
        rotulo: "Vista 3/4",
        nota: "O ângulo mais honesto: mostra o alinhamento entre frente e lateral.",
        aspecto: 1.9,
      },
      {
        arquivo: "03-vista-lateral-esquerda.webp",
        alt: "Lateral esquerda do Celta 2012 preto, com as duas portas fechadas",
        rotulo: "Lateral esquerda",
        nota: "Portas fechando no lugar, frisos e maçanetas de fábrica.",
        aspecto: 1.9,
      },
    ],
    [
      {
        arquivo: "04-vista-traseira.webp",
        alt: "Traseira do Celta 2012 preto, com as lanternas vermelhas e a placa CELTA",
        rotulo: "Vista traseira",
        nota: "Traseira alinhada, lanternas inteiras e tampa fechando certinho.",
        aspecto: 1.85,
      },
      {
        arquivo: "05-vista-lateral-direita.webp",
        alt: "Lateral direita do Celta 2012 preto em perfil, com as duas rodas visíveis",
        rotulo: "Lateral direita",
        nota: "A lateral que mais leva ralado de garagem. Esta está limpa.",
        aspecto: 1.85,
      },
      {
        arquivo: "06-vista-superior.webp",
        alt: "Vista de cima do Celta 2012 preto, mostrando teto, para-brisa e janelas",
        rotulo: "Vista superior",
        nota: "Teto sem deformação e sem marca de granizo.",
        aspecto: 1.85,
      },
      {
        arquivo: "07-bancos-dianteiros.webp",
        alt: "Bancos dianteiros do Celta 2012 em tecido escuro, com o volante à esquerda",
        rotulo: "Bancos dianteiros",
        nota: "Tecido original, sem furo de cigarro e sem capa escondendo rasgo.",
        aspecto: 1.85,
      },
    ],
    [
      {
        arquivo: "08-bancos-traseiros.webp",
        alt: "Banco traseiro do Celta 2012 em tecido escuro, com cintos e encostos de cabeça",
        rotulo: "Bancos traseiros",
        nota: "Banco inteiro, com cintos e encostos completos.",
        aspecto: 2,
      },
      {
        arquivo: "09-painel.webp",
        alt: "Painel do Celta 2012 com volante, quadro de instrumentos e console central",
        rotulo: "Painel",
        nota: "Painel original, sem furo de som e sem luz acesa no quadro.",
        aspecto: 2,
      },
      {
        arquivo: "10-interior-frontal.webp",
        alt: "Interior do Celta 2012 visto da porta do motorista, com os bancos dianteiros",
        rotulo: "Interior frontal",
        nota: "Portas, forros e borrachas no lugar — sem infiltração aparente.",
        aspecto: 2,
      },
      {
        arquivo: "11-motor.webp",
        alt: "Motor 1.0 do Celta 2012 com o capô aberto, mostrando o cabeçote e os reservatórios",
        rotulo: "Motor",
        nota: "Motor limpo, sem vazamento aparente e com os fluidos no nível.",
        aspecto: 2,
      },
    ],
    [
      {
        arquivo: "12-rodas-e-pneus.webp",
        alt: "Roda de liga e pneu do Celta 2012 em close",
        rotulo: "Rodas e pneus",
        nota: "Pneus com vida útil pela frente e rodas sem ralado feio de guia.",
        aspecto: 2,
      },
      {
        arquivo: "13-farois.webp",
        alt: "Farol dianteiro do Celta 2012 em close, com a lente transparente",
        rotulo: "Faróis",
        nota: "Farol sem trinca e sem amarelado de sol.",
        aspecto: 2,
      },
      {
        arquivo: "14-grade-frontal.webp",
        alt: "Grade frontal do Celta 2012 com o emblema dourado da Chevrolet",
        rotulo: "Grade frontal",
        nota: "Grade e emblema originais, sem peça paralela.",
        aspecto: 2,
      },
      {
        arquivo: "15-detalhe-traseiro.webp",
        alt: "Lanterna traseira vermelha do Celta 2012, com a inscrição CELTA ao lado",
        rotulo: "Detalhe traseiro",
        nota: "Lanterna intacta, sem infiltração e sem remendo.",
        aspecto: 2,
      },
    ],
  ] as FotoGaleria[][],
};

/* ---------------------------------------------------------------------------
   Seções no formato do template (fundo escuro, destaque ouro)
   --------------------------------------------------------------------------- */

export type FotoComRegiao = FotoGaleria & { regiao: RegiaoFoto };

/** As 15 fotos em ordem, com a região de cada uma (usada pelas abas da pasta). */
export const fotosDoCarro: FotoComRegiao[] = fotosDoAnuncio.grupos
  .flat()
  .map((foto) => ({
    ...foto,
    regiao: regiaoPorArquivo[foto.arquivo] ?? "Exterior",
  }));

function foto(arquivo: string): FotoComRegiao {
  const achada = fotosDoCarro.find((item) => item.arquivo === arquivo);
  if (!achada) throw new Error(`Foto não encontrada em conteudo.ts: ${arquivo}`);
  return achada;
}

export const navegacao = [
  { rotulo: "Sobre o carro", href: "#sobre" },
  { rotulo: "Fotos", href: "#fotos" },
  { rotulo: "Vídeo", href: "#video" },
  { rotulo: "Fatos", href: "#fatos" },
  { rotulo: "Contato", href: "#contato" },
];

export type NumeroBarra = {
  valor: string;
  rotulo: string;
  /** quando presente, o número é animado de 0 até ele */
  numero?: number;
  formato?: "ano" | "milhar" | "moeda";
};

/** A barra de números logo abaixo da animação (o "810 KM/H · 200 KM/H..." do template). */
export const barraNumeros: NumeroBarra[] = [
  { numero: 2012, formato: "ano", valor: "2012", rotulo: "Ano modelo" },
  { numero: 95000, formato: "milhar", valor: "95.000", rotulo: "Quilômetros" },
  { numero: 32900, formato: "moeda", valor: "R$ 32.900", rotulo: "Valor de anúncio" },
  { valor: "1.0 flex", rotulo: "Motor" },
];

export const sobreCarro = {
  rotulo: "Sobre o carro",
  titulo: "Um compacto que não dá trabalho",
  texto:
    "Celta LT 1.0 Flex, 4 portas, do jeito que saiu da fábrica. Mecânica simples, peça em qualquer lugar e manutenção barata: é o tipo de carro que resolve o dia a dia sem pedir atenção.",
  numeros: [
    { valor: "4", rotulo: "Portas" },
    { valor: "5", rotulo: "Marchas" },
    { valor: "48", rotulo: "Litros de tanque" },
  ],
  botao: "Falar com o dono",
  foto: foto("01-vista-frontal.webp"),
};

export const painelDestaque = {
  rotulo: "No showroom",
  titulo: "O Celta 2012 em detalhe",
  descricao:
    "Três ângulos do mesmo carro que está à venda, fotografado no showroom. Use as setas para girar em volta dele.",
  palavra: "CELTA",
  fotos: [
    foto("02-vista-3-4-diagonal.webp"),
    foto("03-vista-lateral-esquerda.webp"),
    foto("05-vista-lateral-direita.webp"),
  ],
  faixa: [
    { chave: "Motor", valor: "1.0 flex" },
    { chave: "Câmbio", valor: "Manual, 5 marchas" },
    { chave: "Portas", valor: "4" },
    { chave: "Combustível", valor: "Etanol e gasolina" },
  ],
};

export const galeriaAssimetrica = {
  rotulo: "Por fora e por dentro",
  titulo: "Acabamento que passa no olho",
  descricao:
    "Traseira, painel e motor: os três lugares onde um carro usado conta a verdade. Estes estão como a foto mostra.",
  destaque: foto("04-vista-traseira.webp"),
  laterais: [foto("09-painel.webp"), foto("11-motor.webp")],
};

export const pastaFotos = {
  rotulo: "Todas as partes",
  titulo: "A pasta com as 15 fotos",
  descricao:
    "Estão todas aqui dentro: por fora, por dentro, embaixo do capô e nos detalhes que a maioria dos anúncios esconde. Abra a pasta e escolha a parte do carro.",
  aba: "Fotos",
  capaTitulo: "15 fotos, uma por vez",
  capaTexto:
    "Cada parte em uma foto grande, sem mural de fotos. Escolha por onde começar.",
  abrir: "Abrir a pasta de fotos",
  fechar: "Fechar a pasta",
  abas: ["Todas", "Exterior", "Interior", "Motor", "Detalhes"] as (
    | RegiaoFoto
    | "Todas"
  )[],
};

export const fatosDestaque = {
  rotulo: "O que já está resolvido",
  titulo: "Fatos que pesam na compra",
  descricao:
    "O que costuma virar surpresa depois da compra aqui já está respondido — e pode ser conferido na hora da visita.",
  itens: [
    {
      etiqueta: "Revisão",
      titulo: "Óleo e filtros trocados",
      texto:
        "Revisão feita recentemente, com óleo e filtros novos. O carro roda todos os dias e não fica parado na garagem.",
    },
    {
      etiqueta: "Pneus",
      titulo: "Boa vida útil pela frente",
      texto:
        "Pneus em bom estado, sem bolha e sem desgaste irregular. Rodas sem ralado feio de guia.",
    },
    {
      etiqueta: "Documentação",
      titulo: "IPVA pago e sem multas",
      texto:
        "Documentação em dia, sem pendência e sem débito. Transferência direta, sem intermediário na negociação.",
    },
  ],
};

export const bannerContato = {
  rotulo: "Contato direto com o dono",
  foto: "/videos/celta-promocional-capa.webp",
};

/** Centros de pausa (0-1) do motor de scroll — casam com a ordem das seções. */
export const centroSecoes = [0.06, 0.21, 0.365, 0.525, 0.685, 0.885];

export const rotuloSecoes = [
  "Abertura",
  "Por que esse carro",
  "Motor",
  "Diferenciais",
  "Estado do carro",
  "Falar com o dono",
];
