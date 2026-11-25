/**
 * Manifesto "carved colour": as the section scrolls, the colour ribbon is
 * revealed outward from the knife cut (--paint), the second headline line
 * paints in left to right (--fill) and the artwork settles from a slight
 * zoom (--zoom). A soft light follows the cursor over the marble.
 *
 * Desktop: the stage is pinned (position: sticky) and progress runs through
 * the pinned scroll. Phones: no pinning; progress follows the artwork moving
 * up the screen. Reduced motion: everything stays fully painted.
 */
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Eased 0→1 between two progress points. */
function phase(progress: number, start: number, end: number): number {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}

export function initCarve(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>(".carve__stage");
  const art = root.querySelector<HTMLElement>("[data-carve-art]");
  if (!stage || !art) return () => undefined;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => undefined; // CSS defaults are the finished, fully painted state
  }

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let frame = 0;
  let active = false;

  const measure = () => {
    frame = 0;
    const viewport = window.innerHeight || 1;
    let progress: number;

    if (getComputedStyle(stage).position === "sticky") {
      // Starts when the section is 60% up the screen, ends when the pin releases.
      const rect = root.getBoundingClientRect();
      const lead = viewport * 0.6;
      const distance = rect.height - viewport + lead;
      progress = clamp((lead - rect.top) / Math.max(distance, 1));
      root.style.setProperty("--paint", phase(progress, 0.08, 0.72).toFixed(4));
      root.style.setProperty("--fill", phase(progress, 0.22, 0.86).toFixed(4));
      root.style.setProperty("--zoom", phase(progress, 0, 0.9).toFixed(4));
    } else {
      // Phones: paint as the artwork travels from the bottom of the screen to its upper third.
      const rect = art.getBoundingClientRect();
      progress = clamp((viewport * 0.98 - rect.top) / (viewport * 0.68));
      root.style.setProperty("--paint", phase(progress, 0.05, 0.95).toFixed(4));
      root.style.setProperty("--fill", phase(progress, 0, 0.7).toFixed(4));
      root.style.setProperty("--zoom", phase(progress, 0, 1).toFixed(4));
    }
  };

  const request = () => {
    if (active && !frame) frame = window.requestAnimationFrame(measure);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!finePointer.matches) return;
    const rect = art.getBoundingClientRect();
    art.style.setProperty("--lx", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`);
    art.style.setProperty("--ly", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`);
  };

  const observer = new IntersectionObserver((entries) => {
    active = entries.some((entry) => entry.isIntersecting);
    if (active) request();
  }, { rootMargin: "20% 0px 20% 0px" });

  // Set the real progress straight away (usually 0: the section starts below the fold).
  measure();
  observer.observe(root);
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  art.addEventListener("pointermove", handlePointerMove, { passive: true });

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
    art.removeEventListener("pointermove", handlePointerMove);
    ["--paint", "--fill", "--zoom"].forEach((name) => root.style.removeProperty(name));
  };
}
