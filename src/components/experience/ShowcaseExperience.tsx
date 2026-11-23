"use client";

import { useEffect } from "react";

import { initBrandWall } from "./showcase/brand-wall";
import { initFooter } from "./showcase/footer-mark";
import { initReveals } from "./showcase/reveal";
import { initStats } from "./showcase/stats-roll";
import { initWorkReel } from "./showcase/work-reel";

/** Runs the motion for the Stats, Work, Brands and Footer sections. */
export function ShowcaseExperience() {
  useEffect(() => {
    const cleanups: Array<() => void> = [initReveals()];
    const stats = document.querySelector<HTMLElement>("[data-stats]");
    const work = document.querySelector<HTMLElement>("[data-work-reel]");
    const brands = document.querySelector<HTMLElement>("[data-brand-wall]");
    const footer = document.querySelector<HTMLElement>("[data-footer]");
    if (stats) cleanups.push(initStats(stats));
    if (work) cleanups.push(initWorkReel(work));
    if (brands) cleanups.push(initBrandWall(brands));
    if (footer) cleanups.push(initFooter(footer));
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return null;
}
