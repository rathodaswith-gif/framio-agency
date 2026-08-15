"use client";

import { useEffect } from "react";

export function ServicesExperience() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".framio-services");
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const revealSection = () => section.classList.add("is-visible");
    let revealObserver: IntersectionObserver | undefined;

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealSection();
    } else {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          revealSection();
          observer.disconnect();
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );
      revealObserver.observe(section);
    }

    const featuredCard = section.querySelector<HTMLElement>("[data-services-pointer]");
    const featuredSurface = featuredCard?.querySelector<HTMLElement>(".framio-services__surface");
    if (!featuredCard || !featuredSurface) return () => revealObserver?.disconnect();

    let animationFrame = 0;
    let cardBounds: DOMRect | null = null;
    let pointerX = 0;
    let pointerY = 0;

    const clearLogoPop = () => featuredCard.classList.remove("is-logo-pop");
    const playLogoPop = () => {
      if (reducedMotion.matches) return;
      featuredCard.classList.remove("is-logo-pop");
      void featuredCard.offsetWidth;
      featuredCard.classList.add("is-logo-pop");
    };
    const paintPointer = () => {
      animationFrame = 0;
      if (!cardBounds) return;
      const x = Math.max(0, Math.min(pointerX - cardBounds.left, cardBounds.width));
      const y = Math.max(0, Math.min(pointerY - cardBounds.top, cardBounds.height));
      featuredSurface.style.setProperty("--mouse-x", `${x}px`);
      featuredSurface.style.setProperty("--mouse-y", `${y}px`);
    };
    const handlePointerEnter = (event: PointerEvent) => {
      cardBounds = featuredSurface.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      featuredCard.classList.add("is-pointer-active");
      playLogoPop();
      paintPointer();
    };
    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!animationFrame) animationFrame = window.requestAnimationFrame(paintPointer);
    };
    const handlePointerLeave = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      cardBounds = null;
      featuredCard.classList.remove("is-pointer-active");
      featuredSurface.style.setProperty("--mouse-x", "50%");
      featuredSurface.style.setProperty("--mouse-y", "50%");
      clearLogoPop();
    };
    const removePointerTracking = () => {
      featuredCard.removeEventListener("pointerenter", handlePointerEnter);
      featuredCard.removeEventListener("pointermove", handlePointerMove);
      featuredCard.removeEventListener("pointerleave", handlePointerLeave);
      handlePointerLeave();
    };
    const configurePointerTracking = () => {
      removePointerTracking();
      if (!finePointer.matches || reducedMotion.matches) return;
      featuredCard.addEventListener("pointerenter", handlePointerEnter, { passive: true });
      featuredCard.addEventListener("pointermove", handlePointerMove, { passive: true });
      featuredCard.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches) playLogoPop();
    };
    const handleClick = () => { if (finePointer.matches) playLogoPop(); };
    const handleFocus = () => playLogoPop();

    configurePointerTracking();
    featuredCard.addEventListener("pointerdown", handlePointerDown, { passive: true });
    featuredCard.addEventListener("click", handleClick);
    featuredCard.addEventListener("focusin", handleFocus);
    finePointer.addEventListener?.("change", configurePointerTracking);
    reducedMotion.addEventListener?.("change", configurePointerTracking);

    return () => {
      revealObserver?.disconnect();
      removePointerTracking();
      featuredCard.removeEventListener("pointerdown", handlePointerDown);
      featuredCard.removeEventListener("click", handleClick);
      featuredCard.removeEventListener("focusin", handleFocus);
      finePointer.removeEventListener?.("change", configurePointerTracking);
      reducedMotion.removeEventListener?.("change", configurePointerTracking);
    };
  }, []);

  return null;
}
