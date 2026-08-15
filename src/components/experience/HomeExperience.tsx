"use client";

import { useEffect } from "react";

import { FoundersExperience } from "./FoundersExperience";
import { ProcessExperience } from "./ProcessExperience";
import { ServicesExperience } from "./ServicesExperience";

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
    const speedLines = document.querySelector<HTMLElement>("#speedLines");
    if (!header || !hero || !menuToggle || !menuLabel || !mobileMenu || !speedLines) return;

    let menuOpen = false;
    let lastScrollY = window.scrollY;
    let headerScrollFrame = 0;
    let resizeTimer = 0;
    let impactCountTimer = 0;
    const counterFrames = new Set<number>();

    const loadFrame = window.requestAnimationFrame(() => body.classList.add("is-loaded"));

    const createSpeedLines = () => {
      speedLines.replaceChildren();
      const mobile = window.innerWidth < 700;
      const count = mobile ? 18 : 50;
      const fragment = document.createDocumentFragment();
      for (let index = 0; index < count; index += 1) {
        const line = document.createElement("span");
        const angle = (360 / count) * index + (Math.random() * 7 - 3.5);
        const radius = mobile ? 18 + Math.random() * 31 : 21 + Math.random() * 36;
        const length = mobile ? 9 + Math.random() * 24 : 12 + Math.random() * 42;
        const travel = mobile ? 14 + Math.random() * 25 : 18 + Math.random() * 42;
        const opacity = mobile ? 0.16 + Math.random() * 0.28 : 0.15 + Math.random() * 0.38;
        const duration = 1.15 + Math.random() * 1.65;
        line.className = "speed-line";
        if (index % 11 === 0) line.classList.add("is-yellow");
        else if (index % 7 === 0) line.classList.add("is-wine");
        line.style.setProperty("--angle", `${angle}deg`);
        line.style.setProperty("--radius", `${radius}vmin`);
        line.style.setProperty("--length", `${length}px`);
        line.style.setProperty("--travel", `${travel}px`);
        line.style.setProperty("--line-opacity", opacity.toFixed(2));
        line.style.setProperty("--duration", `${duration.toFixed(2)}s`);
        line.style.setProperty("--delay", `${(-Math.random() * duration).toFixed(2)}s`);
        fragment.appendChild(line);
      }
      speedLines.appendChild(fragment);
    };
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(createSpeedLines, 180);
    };
    createSpeedLines();
    window.addEventListener("resize", handleResize, { passive: true });

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
    const observedSections = ["work", "services", "process", "about"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.section === visible.target.id));
    }, { rootMargin: "-32% 0px -50% 0px", threshold: [0.01, 0.25, 0.5] });
    observedSections.forEach((section) => sectionObserver.observe(section));

    const revealObservers = [
      observeOnce(document.querySelector(".framio-process"), 0.2),
      observeOnce(document.querySelector(".style-carousel-showcase"), 0.18),
      observeOnce(document.querySelector(".brands-showcase"), 0.18),
      observeOnce(document.querySelector(".framio-footer"), 0.16)
    ];

    const impactShowcase = document.querySelector<HTMLElement>(".impact-showcase");
    const impactBoard = document.querySelector<HTMLElement>(".impact-board");
    let impactHasCounted = false;
    const animateCounter = (counter: HTMLElement) => {
      const target = Number(counter.dataset.target ?? 0);
      const startTime = performance.now();
      const stat = counter.closest(".impact-stat");
      const update = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / 1450, 1);
        const value = Math.round(target * (1 - Math.pow(1 - progress, 4)));
        counter.textContent = value.toLocaleString("en-IN");
        if (progress < 1) {
          const id = window.requestAnimationFrame(update);
          counterFrames.add(id);
        } else {
          counter.textContent = target.toLocaleString("en-IN");
          stat?.classList.add("is-counted");
        }
      };
      const id = window.requestAnimationFrame(update);
      counterFrames.add(id);
    };
    let impactObserver: IntersectionObserver | undefined;
    if (impactShowcase) {
      impactObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          if (!impactHasCounted) {
            impactHasCounted = true;
            impactCountTimer = window.setTimeout(() => {
              impactShowcase.querySelectorAll<HTMLElement>(".impact-counter").forEach(animateCounter);
            }, 650);
          }
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.24 });
      impactObserver.observe(impactShowcase);
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    const handleImpactPointer = (event: PointerEvent) => {
      if (!impactBoard) return;
      const rect = impactBoard.getBoundingClientRect();
      impactBoard.style.setProperty("--impact-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
      impactBoard.style.setProperty("--impact-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
    };
    const resetImpactPointer = () => {
      impactBoard?.style.setProperty("--impact-x", "50%");
      impactBoard?.style.setProperty("--impact-y", "50%");
    };
    if (impactBoard && finePointer.matches) {
      impactBoard.addEventListener("pointermove", handleImpactPointer, { passive: true });
      impactBoard.addEventListener("pointerleave", resetImpactPointer);
    }

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
      counterFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      window.clearTimeout(resizeTimer);
      window.clearTimeout(impactCountTimer);
      body.classList.remove("is-loaded", "menu-open");
      root.classList.remove("menu-open");
      window.removeEventListener("resize", handleResize);
      menuToggle.removeEventListener("click", handleMenuToggle);
      menuLinks.forEach((link) => link.removeEventListener("click", handleMenuLink));
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", requestHeaderUpdate);
      sectionObserver.disconnect();
      revealObservers.forEach((observer) => observer?.disconnect());
      impactObserver?.disconnect();
      impactBoard?.removeEventListener("pointermove", handleImpactPointer);
      impactBoard?.removeEventListener("pointerleave", resetImpactPointer);
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
    </>
  );
}
