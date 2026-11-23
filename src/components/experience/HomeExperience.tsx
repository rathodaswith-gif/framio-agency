"use client";

import { useEffect } from "react";

import { FoundersExperience } from "./FoundersExperience";
import { ProcessExperience } from "./ProcessExperience";
import { ServicesExperience } from "./ServicesExperience";
import { ShowcaseExperience } from "./ShowcaseExperience";

function observeOnce(element: Element | null, threshold: number) {
  if (!element) return undefined;
  if (!("IntersectionObserver" in window)) {
    element.classList.add("is-visible");
    return undefined;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    element.classList.add("is-visible");
    currentObserver.disconnect();
  }, { threshold });
  observer.observe(element);
  return observer;
}

export function HomeExperience() {
  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>("#siteHeader");
    const hero = document.querySelector<HTMLElement>("#home");
    const menuToggle = document.querySelector<HTMLButtonElement>("#menuToggle");
    const menuLabel = document.querySelector<HTMLElement>("#menuLabel");
    const mobileMenu = document.querySelector<HTMLElement>("#mobileMenu");
    if (!header || !hero || !menuToggle || !menuLabel || !mobileMenu) return;

    let menuOpen = false;
    let lastScrollY = window.scrollY;
    let headerScrollFrame = 0;

    const loadFrame = window.requestAnimationFrame(() => body.classList.add("is-loaded"));

    const setMenu = (open: boolean) => {
      menuOpen = open;
      mobileMenu.classList.toggle("is-open", open);
      body.classList.toggle("menu-open", open);
      root.classList.toggle("menu-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? menuToggle.dataset.closeAriaLabel ?? "" : menuToggle.dataset.openAriaLabel ?? "");
      mobileMenu.setAttribute("aria-hidden", String(!open));
      menuLabel.textContent = open ? menuToggle.dataset.closeLabel ?? "" : menuToggle.dataset.openLabel ?? "";
      if (open) header.classList.remove("is-hidden");
    };
    const handleMenuToggle = () => setMenu(!menuOpen);
    const menuLinks = Array.from(document.querySelectorAll<HTMLElement>(".mobile-link, .mobile-cta"));
    const handleMenuLink = () => setMenu(false);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menuOpen) return;
      setMenu(false);
      menuToggle.focus();
    };
    menuToggle.addEventListener("click", handleMenuToggle);
    menuLinks.forEach((link) => link.addEventListener("click", handleMenuLink));
    document.addEventListener("keydown", handleEscape);

    const updateHeaderOnScroll = () => {
      const currentScrollY = window.scrollY;
      header.classList.toggle("is-scrolled", currentScrollY > 70);
      const passedHero = currentScrollY > hero.offsetHeight - 80;
      const scrollingDown = currentScrollY > lastScrollY;
      header.classList.toggle("is-hidden", !menuOpen && passedHero && scrollingDown);
      lastScrollY = Math.max(currentScrollY, 0);
    };
    const requestHeaderUpdate = () => {
      if (headerScrollFrame) return;
      headerScrollFrame = window.requestAnimationFrame(() => {
        headerScrollFrame = 0;
        updateHeaderOnScroll();
      });
    };
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    updateHeaderOnScroll();

    const navLinks = Array.from(document.querySelectorAll<HTMLElement>(".nav-link"));
    const observedSections = ["work", "services", "process", "brands"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.section === visible.target.id));
    }, { rootMargin: "-32% 0px -50% 0px", threshold: [0.01, 0.25, 0.5] });
    observedSections.forEach((section) => sectionObserver.observe(section));

    const revealObservers = [
      observeOnce(document.querySelector(".framio-process"), 0.2)
    ];

    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const mobileJourney = document.querySelector<HTMLElement>(".mobile-process-journey");
    const processSection = document.querySelector<HTMLElement>(".framio-process");
    const mobileSteps = Array.from(document.querySelectorAll<HTMLElement>(".mobile-process-step"));
    let mobileFrame = 0;
    const updateMobileProcess = () => {
      mobileFrame = 0;
      if (!mobileJourney || !processSection || !mobileQuery.matches) {
        processSection?.style.removeProperty("--mobile-process-progress");
        return;
      }
      const rect = mobileJourney.getBoundingClientRect();
      const viewportHeight = window.innerHeight || root.clientHeight;
      const startLine = viewportHeight * 0.76;
      const endLine = viewportHeight * 0.3;
      const progress = Math.min(1, Math.max(0, (startLine - rect.top) / Math.max(1, rect.height + startLine - endLine)));
      processSection.style.setProperty("--mobile-process-progress", progress.toFixed(4));
    };
    const requestMobileProcessUpdate = () => {
      if (!mobileFrame) mobileFrame = window.requestAnimationFrame(updateMobileProcess);
    };
    const syncMobileAccessibility = () => {
      if (!mobileJourney || !processSection) return;
      const isMobile = mobileQuery.matches;
      processSection.setAttribute("aria-labelledby", isMobile ? "mobileProcessHeading" : "processHeading");
      processSection.querySelector(".process-inner")?.setAttribute("aria-hidden", String(isMobile));
      mobileJourney.setAttribute("aria-hidden", String(!isMobile));
      requestMobileProcessUpdate();
    };
    const mobileStepObserver = new IntersectionObserver((entries) => {
      if (!mobileQuery.matches) return;
      entries.forEach((entry) => entry.target.classList.toggle("is-active", entry.isIntersecting));
    }, { rootMargin: "-34% 0px -42% 0px", threshold: 0.01 });
    mobileSteps.forEach((step) => mobileStepObserver.observe(step));
    window.addEventListener("scroll", requestMobileProcessUpdate, { passive: true });
    window.addEventListener("resize", requestMobileProcessUpdate, { passive: true });
    mobileQuery.addEventListener?.("change", syncMobileAccessibility);
    syncMobileAccessibility();

    return () => {
      window.cancelAnimationFrame(loadFrame);
      if (headerScrollFrame) window.cancelAnimationFrame(headerScrollFrame);
      if (mobileFrame) window.cancelAnimationFrame(mobileFrame);
      body.classList.remove("is-loaded", "menu-open");
      root.classList.remove("menu-open");
      menuToggle.removeEventListener("click", handleMenuToggle);
      menuLinks.forEach((link) => link.removeEventListener("click", handleMenuLink));
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", requestHeaderUpdate);
      sectionObserver.disconnect();
      revealObservers.forEach((observer) => observer?.disconnect());
      mobileStepObserver.disconnect();
      window.removeEventListener("scroll", requestMobileProcessUpdate);
      window.removeEventListener("resize", requestMobileProcessUpdate);
      mobileQuery.removeEventListener?.("change", syncMobileAccessibility);
    };
  }, []);

  return (
    <>
      <ServicesExperience />
      <ProcessExperience />
      <FoundersExperience />
      <ShowcaseExperience />
    </>
  );
}
