import Link from "next/link";
import { site, vozDoCelta } from "@/lib/conteudo";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-[6%] py-24 text-center">
      <div className="max-w-[560px]">
        <p className="rotulo text-ouro">Erro 404</p>
        <h1 className="display-forte mt-4 text-[clamp(40px,8vw,84px)]">
          Caminho sem saída.
        </h1>
        <p className="corpo mx-auto mt-5 max-w-[42ch]">{vozDoCelta.erro404}</p>
        <Link href="/" className="pill pill-ouro mt-8">
          Voltar para o {site.nome}
        </Link>
      </div>
    </main>
  );
}
