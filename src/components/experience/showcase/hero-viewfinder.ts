/**
 * Hero showreel: plays the clips one after another in the monitor, fills the
 * progress bars, handles the clip buttons and the pause button, and tilts the
 * monitor gently toward the cursor.
 *
 * Two <video> elements take turns, so the next clip is already loaded when
 * the current one ends and the cut is a clean crossfade.
 * Plays only while the hero is on screen and the tab is visible. With reduced
 * motion or data saver it starts paused on the first still.
 */
interface Clip {
  src: string;
  poster: string;
}

export function initHeroViewfinder(root: HTMLElement): () => void {
  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("[data-vf-video]"));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-vf-clip]"));
  const ambient = Array.from(root.querySelectorAll<HTMLImageElement>("[data-vf-ambient]"));
  const toggle = root.querySelector<HTMLButtonElement>("[data-vf-toggle]");
  const monitor = root.querySelector<HTMLElement>("[data-vf-monitor]");
  if (videos.length < 2 || !buttons.length || !toggle) return () => undefined;
  const pauseButton = toggle;

  const clips: Clip[] = buttons.map((button) => ({
    src: button.dataset.src ?? "",
    poster: button.dataset.poster ?? ""
  }));

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = Boolean(connection?.saveData);
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let index = 0;
  let front = 0;
  let userPaused = reducedMotion || saveData;
  let inView = true;
  let pageVisible = document.visibilityState !== "hidden";
  let frame = 0;
  let tiltX = 0;
  let tiltY = 0;
  let targetX = 0;
  let targetY = 0;
  const timers = new Set<number>();

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  const isPlaying = () => !userPaused && inView && pageVisible;

  const load = (video: HTMLVideoElement, clipIndex: number, preload: "auto" | "metadata" | "none" = "auto") => {
    if (video.dataset.clip === String(clipIndex)) return;
    const clip = clips[clipIndex];
    video.dataset.clip = String(clipIndex);
    video.poster = clip.poster;
    video.preload = preload;
    video.src = clip.src;
    video.load();
  };

  const updateClipState = () => {
    buttons.forEach((button, buttonIndex) => {
      const current = buttonIndex === index;
      button.classList.toggle("is-current", current);
      button.classList.toggle("is-done", buttonIndex < index);
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
      button.style.setProperty("--p", buttonIndex < index ? "1" : "0");
    });
    ambient.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
  };

  function setPaused(paused: boolean) {
    userPaused = paused;
    root.classList.toggle("is-paused", paused);
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", (paused ? pauseButton.dataset.labelPlay : pauseButton.dataset.labelPause) ?? "");
    apply();
  }

  const playFront = () => {
    const attempt = videos[front].play();
    if (attempt) {
      attempt.catch((error: unknown) => {
        // Autoplay blocked (e.g. iOS Low Power Mode): show the paused state so people can press play.
        if (error instanceof DOMException && error.name === "NotAllowedError") setPaused(true);
      });
    }
  };

  const show = (clipIndex: number) => {
    if (clipIndex === index && videos[front].dataset.clip === String(clipIndex)) return;
    const previous = videos[front];
    const back = 1 - front;
    const next = videos[back];
    load(next, clipIndex);
    try {
      next.currentTime = 0;
    } catch {
      /* not seekable yet; it starts at 0 anyway */
    }
    previous.classList.remove("is-active");
    next.classList.add("is-active");
    front = back;
    index = clipIndex;
    updateClipState();
    if (isPlaying()) playFront();
    // Once the crossfade has finished, park the old element on the clip after this one.
    later(() => {
      previous.pause();
      if (previous !== videos[front]) load(previous, (index + 1) % clips.length, isPlaying() ? "auto" : "metadata");
    }, 700);
  };

  const handleEnded = (event: Event) => {
    if (event.currentTarget !== videos[front]) return;
    show((index + 1) % clips.length);
  };

  const tick = () => {
    frame = 0;
    const playing = isPlaying();

    if (playing) {
      const video = videos[front];
      if (video.duration > 0) {
        buttons[index]?.style.setProperty("--p", Math.min(1, video.currentTime / video.duration).toFixed(4));
      }
    }

    let tilting = false;
    if (monitor && finePointer.matches && !reducedMotion) {
      tiltX += (targetX - tiltX) * 0.08;
      tiltY += (targetY - tiltY) * 0.08;
      monitor.style.setProperty("--tilt-x", tiltX.toFixed(3));
      monitor.style.setProperty("--tilt-y", tiltY.toFixed(3));
      tilting = Math.abs(targetX - tiltX) > 0.002 || Math.abs(targetY - tiltY) > 0.002;
    }

    if (playing || tilting) frame = window.requestAnimationFrame(tick);
  };

  const requestTick = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };

  function apply() {
    if (isPlaying()) {
      playFront();
      requestTick();
    } else {
      videos.forEach((video) => video.pause());
    }
  }

  const handleToggle = () => setPaused(!userPaused);

  const handleClip = (event: Event) => {
    const target = event.currentTarget as HTMLButtonElement;
    const clipIndex = Number(target.dataset.vfClip);
    if (!Number.isNaN(clipIndex)) show(clipIndex);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (!finePointer.matches || reducedMotion) return;
    const rect = root.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    requestTick();
  };

  const handlePointerLeave = () => {
    targetX = 0;
    targetY = 0;
    requestTick();
  };

  const handleVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    apply();
  };

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      apply();
    }, { threshold: 0.05 })
    : null;

  videos.forEach((video) => video.addEventListener("ended", handleEnded));
  buttons.forEach((button) => button.addEventListener("click", handleClip));
  pauseButton.addEventListener("click", handleToggle);
  root.addEventListener("pointermove", handlePointerMove, { passive: true });
  root.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("visibilitychange", handleVisibility);
  observer?.observe(root);

  videos[0].dataset.clip = "0";
  updateClipState();
  if (userPaused) {
    setPaused(true);
  } else {
    apply();
    // Have the second clip ready well before the first one ends.
    later(() => load(videos[1], 1, "auto"), 1200);
  }

  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    timers.forEach((id) => window.clearTimeout(id));
    videos.forEach((video) => {
      video.removeEventListener("ended", handleEnded);
      video.pause();
    });
    buttons.forEach((button) => button.removeEventListener("click", handleClip));
    pauseButton.removeEventListener("click", handleToggle);
    root.removeEventListener("pointermove", handlePointerMove);
    root.removeEventListener("pointerleave", handlePointerLeave);
    document.removeEventListener("visibilitychange", handleVisibility);
    observer?.disconnect();
    root.classList.remove("is-paused");
  };
}
