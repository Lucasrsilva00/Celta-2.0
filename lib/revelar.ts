"use client";

import { useEffect, useRef } from "react";
import { observar } from "./animacao";

/**
 * Liga a revelação a todos os filhos marcados com `data-revelar`.
 */
export function useRevelar<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;

    raiz
      .querySelectorAll<HTMLElement>("[data-revelar]")
      .forEach((alvo) => observar(alvo));
  }, []);

  return ref;
}
