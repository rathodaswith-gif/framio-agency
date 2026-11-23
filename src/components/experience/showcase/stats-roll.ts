/**
 * "Numbers that matter": the panel stands up as it enters, then each number
 * rolls into place on its 3D drums (rightmost digit spins the most, like an
 * odometer). Hovering or tapping a stat spins it once more.
 * Without JS, or with reduced motion, the final numbers simply show.
 */
export function initStats(root: HTMLElement): () => void {
  const stats = Array.from(root.querySelectorAll<HTMLElement>("[data-stat]"));
  const drums = Array.from(root.querySelectorAll<HTMLElement>(".fx-drum"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!stats.length || reducedMotion.matches || !("IntersectionObserver" in window)) {
    return () => undefined;
  }

  const timers: number[] = [];
  const lastSpin = new WeakMap<HTMLElement, number>();

  const setTurn = (drum: HTMLElement, spins: number) => {
    const digit = Number(drum.dataset.digit ?? 0);
    drum.dataset.spins = String(spins);
    drum.style.setProperty("--turn", String(digit + spins * 10));
  };

  const spinStat = (stat: HTMLElement, mode: "intro" | "again") => {
    const now = performance.now();
    if (mode === "again" && now - (lastSpin.get(stat) ?? 0) < 1600) return;
    lastSpin.set(stat, now);
    stat.querySelectorAll<HTMLElement>(".fx-drum").forEach((drum) => {
      const place = Number(drum.dataset.place ?? 0);
      const spins = mode === "intro" ? 1 + place : Number(drum.dataset.spins ?? 0) + 1;
      setTurn(drum, spins);
    });
  };

  // Arm: park every drum on 0 without animating, then let transitions back on.
  root.classList.add("is-ready", "is-armed");
  drums.forEach((drum) => drum.style.setProperty("--turn", "0"));
  void root.offsetWidth;
  const armFrame = window.requestAnimationFrame(() => root.classList.remove("is-armed"));

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    root.classList.add("is-in");
    stats.forEach((stat, index) => {
      timers.push(window.setTimeout(() => spinStat(stat, "intro"), 420 + index * 150));
    });
  }, { threshold: 0.3 });
  const panel = root.querySelector<HTMLElement>(".fx-stats__panel");
  if (panel) observer.observe(panel);

  const handlers = stats.map((stat) => {
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && root.classList.contains("is-in")) spinStat(stat, "again");
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && root.classList.contains("is-in")) spinStat(stat, "again");
    };
    stat.addEventListener("pointerenter", onEnter);
    stat.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      stat.removeEventListener("pointerenter", onEnter);
      stat.removeEventListener("pointerdown", onDown);
    };
  });

  return () => {
    observer.disconnect();
    window.cancelAnimationFrame(armFrame);
    timers.forEach((timer) => window.clearTimeout(timer));
    handlers.forEach((off) => off());
    drums.forEach((drum) => drum.style.removeProperty("--turn"));
    root.classList.remove("is-ready", "is-armed", "is-in");
  };
}
