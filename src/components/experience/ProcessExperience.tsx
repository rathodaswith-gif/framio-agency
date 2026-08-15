"use client";

import { useEffect } from "react";

export function ProcessExperience() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".framio-process");
    if (!section) return;
    const nodes = Array.from(section.querySelectorAll<HTMLElement>(".process-node"));
    if (!nodes.length) return;

    const desktopQuery = window.matchMedia("(min-width: 769px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stageDuration = 600;
    let stageIndex = 0;
    let stageTimer = 0;
    let sectionIsVisible = false;

    const setStage = (index: number) => {
      stageIndex = index % nodes.length;
      section.dataset.processStage = String(stageIndex + 1);
      nodes.forEach((node, nodeIndex) => {
        const active = nodeIndex === stageIndex;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-current", active ? "step" : "false");
      });
    };
    const stopSequence = () => {
      window.clearInterval(stageTimer);
      stageTimer = 0;
      section.classList.remove("is-process-running");
    };
    const startSequence = () => {
      stopSequence();
      if (!sectionIsVisible || !desktopQuery.matches || document.hidden) return;
      section.classList.add("is-process-running");
      if (reducedMotion.matches) {
        setStage(2);
        return;
      }
      setStage(0);
      stageTimer = window.setInterval(() => setStage(stageIndex + 1), stageDuration);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        sectionIsVisible = Boolean(entry?.isIntersecting);
        if (sectionIsVisible) startSequence(); else stopSequence();
      },
      { threshold: 0.12, rootMargin: "8% 0px 8% 0px" }
    );
    const handleModeChange = () => { if (sectionIsVisible) startSequence(); };

    observer.observe(section);
    desktopQuery.addEventListener?.("change", handleModeChange);
    reducedMotion.addEventListener?.("change", handleModeChange);
    document.addEventListener("visibilitychange", handleModeChange);

    return () => {
      observer.disconnect();
      stopSequence();
      desktopQuery.removeEventListener?.("change", handleModeChange);
      reducedMotion.removeEventListener?.("change", handleModeChange);
      document.removeEventListener("visibilitychange", handleModeChange);
    };
  }, []);

  return null;
}
