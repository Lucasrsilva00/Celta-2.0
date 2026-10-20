"use client";

import Image from "next/image";
import { LetrasAnimadas } from "@/components/letras-animadas";
import { galeriaAssimetrica, rotulos } from "@/lib/conteudo";
import { useRevelar } from "@/lib/revelar";

/** Galeria assimétrica do template: uma foto grande à esquerda e duas à direita. */
export function GaleriaAssimetrica() {
  const raiz = useRevelar<HTMLDivElement>();
  const { destaque, laterais } = galeriaAssimetrica;

  return (
    <section id="galeria" aria-labelledby="titulo-galeria" className="secao scroll-mt-16">
      <div className="mx-auto w-full max-w-[1240px] px-[6%]">
        <div ref={raiz}>
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <p className="rotulo" data-revelar>
                {galeriaAssimetrica.rotulo}
              </p>
              <h2
                id="titulo-galeria"
                className="display-forte mt-4 max-w-[18ch] text-[clamp(30px,4vw,54px)]"
              >
                <LetrasAnimadas texto={galeriaAssimetrica.titulo} />
              </h2>
            </div>
            <p className="corpo max-w-[46ch] md:text-right" data-revelar>
              {galeriaAssimetrica.descricao}
            </p>
          </header>

          <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-[1.55fr_1fr] md:gap-4">
            <figure
              className="foto-moldura relative aspect-[4/3] md:row-span-2 md:aspect-auto"
              data-revelar
            >
              <div className="foto-corte">
                <Image
                  src={`/galeria/${destaque.arquivo}`}
                  alt={destaque.alt}
                  fill
                  sizes="(max-width: 768px) 88vw, 680px"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/90 via-preto/45 to-transparent p-4 pt-14 md:p-6 md:pt-20">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gelo">
                  {destaque.rotulo}
                </p>
                {destaque.nota && (
                  <p className="mt-1 max-w-[42ch] text-[13px] leading-snug text-nevoa">
                    {destaque.nota}
                  </p>
                )}
              </div>
            </figure>

            {laterais.map((foto) => (
              <figure
                key={foto.arquivo}
                className="foto-moldura relative aspect-[16/10]"
                data-revelar
              >
                <div className="foto-corte">
                  <Image
                    src={`/galeria/${foto.arquivo}`}
                    alt={foto.alt}
                    fill
                    sizes="(max-width: 768px) 88vw, 420px"
                    className="object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-preto/90 via-preto/40 to-transparent p-4 pt-12">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gelo">
                    {foto.rotulo}
                  </p>
                  {foto.nota && (
                    <p className="mt-1 text-[13px] leading-snug text-nevoa">
                      {foto.nota}
                    </p>
                  )}
                </div>
              </figure>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" data-revelar>
            <p className="display-forte text-[clamp(22px,3vw,34px)]">
              {galeriaAssimetrica.chamada}
            </p>
            <a href="#contato" className="pill pill-ouro shrink-0">
              {rotulos.agendar}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
