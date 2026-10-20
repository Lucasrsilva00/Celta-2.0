/**
 * Revelação no scroll — um único IntersectionObserver para a página inteira.
 *
 * Cada elemento é observado uma vez só: quando entra na tela recebe a classe
 * pedida (padrão `revelado`) e sai da lista. Com `prefers-reduced-motion`, a
 * classe entra na hora e nada anima.
 */

const classes = new WeakMap<Element, string>();
let observador: IntersectionObserver | null = null;

function criarObservador() {
  if (observador) return observador;

  observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        const classe = classes.get(entrada.target) ?? "revelado";
        entrada.target.classList.add(classe);
        classes.delete(entrada.target);
        observador?.unobserve(entrada.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
  );

  return observador;
}

export function movimentoReduzido() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function observar(el: Element, classe = "revelado") {
  if (typeof window === "undefined") return;

  if (movimentoReduzido()) {
    el.classList.add(classe);
    return;
  }

  classes.set(el, classe);
  criarObservador().observe(el);
}
