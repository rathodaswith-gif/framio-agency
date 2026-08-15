"use client";

import { useEffect } from "react";

export function FoundersExperience() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".founders-showcase");
    const stage = section?.querySelector<HTMLElement>("[data-founders-reveal]");
    if (!section || !stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cursorLabel = stage.querySelector<HTMLElement>(".founders-stage__cursor span");
    const pointerLabel = stage.dataset.cursorLabel ?? "";
    const touchLabel = stage.dataset.touchLabel ?? pointerLabel;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let touchTimer = 0;
    let keyboardSide = 0;

    const getSide = (x: number, y: number) => {
      if (y < 0.32 || y > 0.995) return "";
      if (x >= 0.015 && x <= 0.43) return "left";
      if (x >= 0.57 && x <= 0.985) return "right";
      return "";
    };
    const setReveal = (x: number, y: number, side: string, source = "pointer") => {
      stage.style.setProperty("--founders-reveal-x", `${x}px`);
      stage.style.setProperty("--founders-reveal-y", `${y}px`);
      stage.classList.toggle("is-revealing", Boolean(side));
      stage.dataset.revealSide = side;
      stage.setAttribute("aria-pressed", String(Boolean(side)));
      if (cursorLabel) cursorLabel.textContent = source === "touch" ? touchLabel : pointerLabel;
    };
    const clearReveal = () => {
      stage.classList.remove("is-revealing");
      stage.dataset.revealSide = "";
      stage.setAttribute("aria-pressed", "false");
    };
    const paintPointer = () => {
      frame = 0;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = Math.max(0, Math.min(pointerX - bounds.left, bounds.width));
      const y = Math.max(0, Math.min(pointerY - bounds.top, bounds.height));
      setReveal(x, y, getSide(x / bounds.width, y / bounds.height));
    };
    const queuePointerPaint = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paintPointer);
    };
    const handlePointerEnter = (event: PointerEvent) => { if (event.pointerType !== "touch") queuePointerPaint(event); };
    const handlePointerMove = (event: PointerEvent) => { if (event.pointerType !== "touch") queuePointerPaint(event); };
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      clearReveal();
    };
    const playTouchReveal = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.pointerType !== "pen") return;
      const bounds = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
      const y = Math.max(0, Math.min(event.clientY - bounds.top, bounds.height));
      const side = getSide(x / bounds.width, y / bounds.height);
      if (!side) return;
      window.clearTimeout(touchTimer);
      setReveal(x, y, side, "touch");
      touchTimer = window.setTimeout(clearReveal, reducedMotion.matches ? 900 : 1500);
    };
    const playKeyboardReveal = () => {
      const bounds = stage.getBoundingClientRect();
      keyboardSide = keyboardSide === 0 ? 1 : 0;
      const side = keyboardSide ? "left" : "right";
      window.clearTimeout(touchTimer);
      setReveal(bounds.width * (keyboardSide ? 0.23 : 0.77), bounds.height * 0.56, side, "keyboard");
      touchTimer = window.setTimeout(clearReveal, reducedMotion.matches ? 900 : 1800);
    };
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      playKeyboardReveal();
    };
    const handleResize = () => clearReveal();
    const handlePointerCancel = () => clearReveal();

    stage.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    stage.addEventListener("pointermove", handlePointerMove, { passive: true });
    stage.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    stage.addEventListener("pointerdown", playTouchReveal, { passive: true });
    stage.addEventListener("pointercancel", handlePointerCancel, { passive: true });
    stage.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize, { passive: true });

    section.classList.add("is-motion-ready");
    const showSection = () => section.classList.add("is-visible");
    let observer: IntersectionObserver | undefined;
    if (reducedMotion.matches || !("IntersectionObserver" in window)) showSection();
    else {
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        showSection();
        observer?.disconnect();
      }, { threshold: 0.13, rootMargin: "0px 0px -8% 0px" });
      observer.observe(section);
    }

    return () => {
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(touchTimer);
      stage.removeEventListener("pointerenter", handlePointerEnter);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("pointerdown", playTouchReveal);
      stage.removeEventListener("pointercancel", handlePointerCancel);
      stage.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}
