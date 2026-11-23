/**
 * Brand wall: the plane tilts toward the pointer and a soft light follows it.
 * On touch screens the plates light up one after another instead.
 */
export function initBrandWall(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-brand-stage]");
  const plane = root.querySelector<HTMLElement>("[data-brand-plane]");
  const plates = Array.from(root.querySelectorAll<HTMLElement>("[data-brand-plate]"));
  if (!stage || !plane || plates.length === 0) return () => undefined;

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  let pointerX = -1;
  let pointerY = -1;
  let cycleTimer = 0;
  let cycleIndex = -1;
  let inView = false;

  const paint = () => {
    frame = 0;
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    plane.style.setProperty("--tilt-y", `${(currentX * 9).toFixed(3)}deg`);
    plane.style.setProperty("--tilt-x", `${(-currentY * 7).toFixed(3)}deg`);
    if (pointerX >= 0) {
      plates.forEach((plate) => {
        const rect = plate.getBoundingClientRect();
        plate.style.setProperty("--mx", `${(((pointerX - rect.left) / rect.width) * 100).toFixed(1)}%`);
        plate.style.setProperty("--my", `${(((pointerY - rect.top) / rect.height) * 100).toFixed(1)}%`);
      });
    }
    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frame = window.requestAnimationFrame(paint);
    }
  };
  const queue = () => { if (!frame) frame = window.requestAnimationFrame(paint); };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const rect = stage.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX = event.clientX;
    pointerY = event.clientY;
    stage.classList.add("is-lit");
    queue();
  };
  const onLeave = () => {
    targetX = 0;
    targetY = 0;
    pointerX = -1;
    stage.classList.remove("is-lit");
    queue();
  };

  const stopCycle = () => {
    window.clearInterval(cycleTimer);
    cycleTimer = 0;
    plates.forEach((plate) => plate.classList.remove("is-on"));
  };
  const step = () => {
    plates.forEach((plate) => plate.classList.remove("is-on"));
    cycleIndex = (cycleIndex + 1) % plates.length;
    plates[cycleIndex]?.classList.add("is-on");
  };
  const startCycle = () => {
    stopCycle();
    if (finePointer.matches || reducedMotion.matches || !inView) return;
    step();
    cycleTimer = window.setInterval(step, 2200);
  };

  const bindPointer = () => {
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    onLeave();
    if (!finePointer.matches || reducedMotion.matches) return;
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave, { passive: true });
  };

  const observer = new IntersectionObserver(([entry]) => {
    inView = Boolean(entry?.isIntersecting);
    if (inView) root.classList.add("is-in");
    if (inView) startCycle(); else stopCycle();
  }, { threshold: 0.25 });
  observer.observe(stage);

  const onModeChange = () => { bindPointer(); if (inView) startCycle(); };
  finePointer.addEventListener?.("change", onModeChange);
  reducedMotion.addEventListener?.("change", onModeChange);
  bindPointer();
  root.classList.add("is-ready");

  return () => {
    observer.disconnect();
    stopCycle();
    if (frame) window.cancelAnimationFrame(frame);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    finePointer.removeEventListener?.("change", onModeChange);
    reducedMotion.removeEventListener?.("change", onModeChange);
    root.classList.remove("is-ready");
  };
}
