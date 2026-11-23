/**
 * Footer: live Hyderabad time, and the 3D FRAMIO wordmark that rises in
 * and leans toward the pointer.
 */
export function initFooter(root: HTMLElement): () => void {
  const mark = root.querySelector<HTMLElement>("[data-footer-mark]");
  const tilt = root.querySelector<HTMLElement>("[data-footer-tilt]");
  const timeEl = root.querySelector<HTMLElement>("[data-local-time]");

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Live local time
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const tick = () => { if (timeEl) timeEl.textContent = formatter.format(new Date()); };
  tick();
  const clockTimer = window.setInterval(tick, 15000);

  // Reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  if (mark) observer.observe(mark);

  // Pointer tilt
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  const paint = () => {
    frame = 0;
    if (!tilt) return;
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    tilt.style.setProperty("--mark-ry", `${(currentX * 16).toFixed(3)}deg`);
    tilt.style.setProperty("--mark-rx", `${(currentY * 10).toFixed(3)}deg`);
    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frame = window.requestAnimationFrame(paint);
    }
  };
  const queue = () => { if (!frame) frame = window.requestAnimationFrame(paint); };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const rect = root.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = Math.min(0.5, Math.max(-0.5, (event.clientY - rect.top) / rect.height - 0.5));
    queue();
  };
  const onLeave = () => { targetX = 0; targetY = 0; queue(); };
  const bind = () => {
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    onLeave();
    if (!finePointer.matches || reducedMotion.matches) return;
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave, { passive: true });
  };
  finePointer.addEventListener?.("change", bind);
  reducedMotion.addEventListener?.("change", bind);
  bind();
  root.classList.add("is-ready");

  return () => {
    window.clearInterval(clockTimer);
    observer.disconnect();
    if (frame) window.cancelAnimationFrame(frame);
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    finePointer.removeEventListener?.("change", bind);
    reducedMotion.removeEventListener?.("change", bind);
    root.classList.remove("is-ready");
  };
}
