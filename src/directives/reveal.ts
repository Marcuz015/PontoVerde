import type { Directive } from "vue";

/**
 * v-reveal: faz o elemento surgir suavemente quando entra na tela.
 * Uso: v-reveal ou v-reveal="120" (atraso em ms, para escalonar itens).
 * Sem IntersectionObserver ou com "reduzir movimento" ativo, o conteúdo
 * aparece imediatamente: nada fica oculto se a animação não puder rodar.
 */
const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return observer;
}

export const reveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    const io = getObserver();
    if (!io || reducedMotion()) return;
    if (binding.value) el.style.setProperty("--reveal-delay", `${binding.value}ms`);
    el.classList.add("reveal");
    io.observe(el);
  },
  unmounted(el) {
    observer?.unobserve(el);
  },
};
