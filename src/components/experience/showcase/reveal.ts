/**
 * Fades headings and blocks marked [data-fx-reveal] up into place once.
 * Content stays visible if this never runs: the hidden state only applies
 * after <html> gets the `fx-motion` class here.
 */
export function initReveals(scope: ParentNode = document): () => void {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const targets = Array.from(scope.querySelectorAll<HTMLElement>("[data-fx-reveal]"));
  if (!targets.length || reducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-in"));
    return () => undefined;
  }

  root.classList.add("fx-motion");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((target) => observer.observe(target));

  // Safety net: never leave anything hidden for long.
  const safety = window.setTimeout(() => targets.forEach((target) => {
    if (target.getBoundingClientRect().top < window.innerHeight) target.classList.add("is-in");
  }), 2500);

  return () => {
    observer.disconnect();
    window.clearTimeout(safety);
    root.classList.remove("fx-motion");
  };
}
