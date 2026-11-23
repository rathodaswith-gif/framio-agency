/**
 * 3D reel ring for the "Work that moves" section.
 * Plain DOM code so it can run from a client component (and be tested on its own).
 * Returns a cleanup function.
 */
export function initWorkReel(root: HTMLElement): () => void {
  const stage = root.querySelector<HTMLElement>("[data-work-stage]");
  const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-work-slide]"));
  if (!stage || slides.length === 0) return () => undefined;

  const videos = slides.map((slide) => slide.querySelector<HTMLVideoElement>("video"));
  const indexEl = root.querySelector<HTMLElement>("[data-work-index]");
  const timeEl = root.querySelector<HTMLElement>("[data-work-time]");
  const progressEl = root.querySelector<HTMLElement>("[data-work-progress]");
  const playBtn = root.querySelector<HTMLButtonElement>("[data-work-play]");
  const playLabel = root.querySelector<HTMLElement>("[data-work-play-label]");
  const soundBtn = root.querySelector<HTMLButtonElement>("[data-work-sound]");
  const soundLabel = root.querySelector<HTMLElement>("[data-work-sound-label]");
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-work-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-work-next]");

  const total = slides.length;
  const maxVisible = Math.min(2, Math.floor((total - 1) / 2));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pad = (value: number) => String(value).padStart(2, "0");
  const clock = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`;
  };
  const wrap = (value: number) => {
    let offset = ((value % total) + total) % total;
    if (offset >= total / 2) offset -= total;
    return offset;
  };

  let active = 0;
  let drag = 0;
  let dragging = false;
  let pointerId: number | null = null;
  let startX = 0;
  let movedX = 0;
  let inView = false;
  let userPaused = reducedMotion.matches;
  let muted = true;
  let cleanTimer = 0;
  const lastOffsets: Array<number | null> = slides.map(() => null);

  const layout = () => {
    const position = active + drag;
    slides.forEach((slide, index) => {
      const offset = wrap(index - position);
      const depth = Math.abs(offset);
      const previous = lastOffsets[index];
      const jumped = previous !== null && Math.abs(offset - previous) > total / 2;
      if (jumped) slide.style.transition = "none";
      slide.style.setProperty("--o", offset.toFixed(3));
      slide.style.setProperty("--depth", Math.min(depth, 3).toFixed(3));
      slide.dataset.depth = String(Math.round(depth));
      slide.classList.toggle("is-hidden", depth > maxVisible + 0.5);
      const isActive = Math.round(depth) === 0;
      slide.classList.toggle("is-active", isActive);
      if (isActive) slide.removeAttribute("aria-hidden");
      else slide.setAttribute("aria-hidden", "true");
      if (jumped) {
        void slide.offsetWidth;
        window.requestAnimationFrame(() => { slide.style.transition = ""; });
      }
      lastOffsets[index] = offset;
    });
  };

  const setPlayUi = (playing: boolean) => {
    root.classList.toggle("is-playing", playing);
    if (playLabel && playBtn) {
      playLabel.textContent = playing ? playBtn.dataset.labelPause ?? "" : playBtn.dataset.labelPlay ?? "";
    }
  };

  const setSoundUi = () => {
    root.classList.toggle("is-sound-on", !muted);
    if (soundLabel && soundBtn) {
      soundLabel.textContent = muted ? soundBtn.dataset.labelOn ?? "" : soundBtn.dataset.labelOff ?? "";
    }
  };

  const updateTime = () => {
    const video = videos[active];
    if (!video) return;
    if (timeEl) timeEl.textContent = clock(video.currentTime);
    if (progressEl) {
      const ratio = video.duration ? video.currentTime / video.duration : 0;
      progressEl.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio)).toFixed(4)})`;
    }
  };

  // Title and client show when a reel starts, then fade so the reel's own
  // captions stay readable. They come back on pause or hover.
  const showMeta = () => {
    window.clearTimeout(cleanTimer);
    slides.forEach((slide) => slide.classList.remove("is-clean"));
  };
  const scheduleClean = () => {
    window.clearTimeout(cleanTimer);
    cleanTimer = window.setTimeout(() => {
      const video = videos[active];
      if (video && !video.paused) slides[active]?.classList.add("is-clean");
    }, 2800);
  };

  const shouldPlay = () => inView && !userPaused && !document.hidden;

  const playActive = () => {
    const video = videos[active];
    if (!video) return;
    if (!shouldPlay()) {
      video.pause();
      setPlayUi(false);
      return;
    }
    video.muted = muted;
    const attempt = video.play();
    if (attempt) {
      attempt.then(() => setPlayUi(true)).catch(() => setPlayUi(false));
    } else {
      setPlayUi(!video.paused);
    }
  };

  const activate = () => {
    videos.forEach((video, index) => {
      if (!video || index === active) return;
      if (!video.paused) video.pause();
      if (video.currentTime > 0) video.currentTime = 0;
    });
    const video = videos[active];
    if (video) {
      video.preload = "auto";
      if (video.currentTime > 0 && video.ended) video.currentTime = 0;
    }
    // Warm up the next reel so it starts instantly.
    const upcoming = videos[(active + 1) % total];
    if (upcoming && upcoming.preload === "none") upcoming.preload = "metadata";
    if (indexEl) indexEl.textContent = pad(active + 1);
    showMeta();
    updateTime();
    playActive();
  };

  const go = (steps: number) => {
    if (!steps) return;
    active = (((active + steps) % total) + total) % total;
    layout();
    activate();
  };

  // Video events
  const cleanups: Array<() => void> = [];
  videos.forEach((video, index) => {
    if (!video) return;
    const onTime = () => { if (index === active) updateTime(); };
    const onEnded = () => {
      if (index !== active) return;
      if (userPaused || total < 2) {
        video.currentTime = 0;
        setPlayUi(false);
        return;
      }
      go(1);
    };
    const onPlay = () => {
      if (index !== active) return;
      setPlayUi(true);
      scheduleClean();
    };
    const onPause = () => {
      if (index !== active) return;
      setPlayUi(false);
      showMeta();
    };
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onTime);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    cleanups.push(() => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onTime);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    });
  });

  // Buttons
  const onPrev = () => go(-1);
  const onNext = () => go(1);
  const onPlayToggle = () => {
    const video = videos[active];
    if (!video) return;
    userPaused = !video.paused;
    if (userPaused) {
      video.pause();
      setPlayUi(false);
    } else {
      playActive();
    }
  };
  const onSoundToggle = () => {
    muted = !muted;
    videos.forEach((video) => { if (video) video.muted = muted; });
    setSoundUi();
    if (!muted && videos[active]?.paused) {
      userPaused = false;
      playActive();
    }
  };
  prevBtn?.addEventListener("click", onPrev);
  nextBtn?.addEventListener("click", onNext);
  playBtn?.addEventListener("click", onPlayToggle);
  soundBtn?.addEventListener("click", onSoundToggle);

  // Keyboard
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  };
  stage.addEventListener("keydown", onKey);

  // Drag / swipe, with the ring following the pointer
  const unit = () => (slides[0]?.offsetWidth || 260) * 1.05;
  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    movedX = 0;
  };
  const onPointerMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    movedX = event.clientX - startX;
    if (!dragging && Math.abs(movedX) > 8) {
      dragging = true;
      root.classList.add("is-dragging");
      try { stage.setPointerCapture(event.pointerId); } catch { /* ignore */ }
    }
    if (!dragging) return;
    drag = Math.max(-total / 2 + 0.01, Math.min(total / 2 - 0.01, -movedX / unit()));
    layout();
  };
  const endDrag = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    pointerId = null;
    if (!dragging) {
      // A plain click: bring a side reel to the front.
      const slide = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-work-slide]");
      if (slide && event.type === "pointerup") {
        const offset = Math.round(wrap(Number(slide.dataset.workSlide) - active));
        if (offset) go(offset);
      }
      return;
    }
    const steps = Math.round(drag);
    dragging = false;
    drag = 0;
    root.classList.remove("is-dragging");
    if (steps) go(steps);
    else layout();
  };
  stage.addEventListener("pointerdown", onPointerDown);
  stage.addEventListener("pointermove", onPointerMove);
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  // Only play while the section is on screen.
  const observer = new IntersectionObserver(([entry]) => {
    inView = Boolean(entry?.isIntersecting);
    if (inView) root.classList.add("is-in");
    playActive();
  }, { threshold: 0.35 });
  observer.observe(stage);

  const onVisibility = () => playActive();
  document.addEventListener("visibilitychange", onVisibility);

  const onMotionChange = () => {
    if (reducedMotion.matches) {
      userPaused = true;
      playActive();
    }
  };
  reducedMotion.addEventListener?.("change", onMotionChange);

  layout();
  setSoundUi();
  setPlayUi(false);
  activate();
  root.classList.add("is-ready");

  return () => {
    window.clearTimeout(cleanTimer);
    observer.disconnect();
    cleanups.forEach((cleanup) => cleanup());
    prevBtn?.removeEventListener("click", onPrev);
    nextBtn?.removeEventListener("click", onNext);
    playBtn?.removeEventListener("click", onPlayToggle);
    soundBtn?.removeEventListener("click", onSoundToggle);
    stage.removeEventListener("keydown", onKey);
    stage.removeEventListener("pointerdown", onPointerDown);
    stage.removeEventListener("pointermove", onPointerMove);
    stage.removeEventListener("pointerup", endDrag);
    stage.removeEventListener("pointercancel", endDrag);
    document.removeEventListener("visibilitychange", onVisibility);
    reducedMotion.removeEventListener?.("change", onMotionChange);
    videos.forEach((video) => video?.pause());
    root.classList.remove("is-ready", "is-playing", "is-dragging");
  };
}
