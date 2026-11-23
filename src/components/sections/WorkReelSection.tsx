import Link from "next/link";
import type { CSSProperties } from "react";

import { siteContent } from "@/content/site";
import { workContent } from "@/content/work";

const pad = (value: number) => String(value).padStart(2, "0");

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {direction === "left" ? <path d="M15 5 8 12l7 7" /> : <path d="m9 5 7 7-7 7" />}
    </svg>
  );
}

export function WorkReelSection() {
  const { items, controls } = workContent;
  const total = items.length;

  return (
    <section className="fx-work" id="work" aria-labelledby="workTitle" data-work-reel>
      <div className="fx-work__light" aria-hidden="true" />

      <div className="fx-shell fx-work__head">
        <div className="fx-head">
          <h2 className="fx-title" id="workTitle" data-fx-reveal>{workContent.heading}</h2>
          <p className="fx-lede" data-fx-reveal>{workContent.description}</p>
        </div>

        <div className="fx-work__nav" data-fx-reveal>
          <p className="fx-work__count">
            <span className="fx-work__count-current" data-work-index>{pad(1)}</span>
            <span className="fx-work__count-total">/ {pad(total)}</span>
          </p>
          <button className="fx-round" type="button" data-work-prev aria-label={controls.previous}><Arrow direction="left" /></button>
          <button className="fx-round" type="button" data-work-next aria-label={controls.next}><Arrow direction="right" /></button>
        </div>
      </div>

      <div
        className="fx-work__stage"
        role="region"
        aria-roledescription="carousel"
        aria-label={workContent.carouselLabel}
        tabIndex={0}
        data-work-stage
      >
        <div className="fx-work__ring" data-work-ring>
          {items.map((item, index) => {
            const offset = index >= Math.ceil(total / 2) ? index - total : index;
            const hidden = Math.abs(offset) > Math.min(2, Math.floor((total - 1) / 2));
            return (
            <article
              className={`fx-reel${index === 0 ? " is-active" : ""}${hidden ? " is-hidden" : ""}`}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}: ${item.title}`}
              aria-hidden={index === 0 ? undefined : true}
              style={{ "--o": offset, "--depth": Math.abs(offset) } as CSSProperties}
              data-depth={Math.abs(offset)}
              data-work-slide={index}
              key={item.video.src}
            >
              <div className="fx-reel__frame">
                <video
                  className="fx-reel__video"
                  src={item.video.src}
                  poster={item.video.poster}
                  muted
                  playsInline
                  preload={index === 0 ? "metadata" : "none"}
                  aria-label={item.title}
                />
                <div className="fx-reel__shade" aria-hidden="true" />
                <div className="fx-reel__meta">
                  <h3>{item.title}</h3>
                  <p>{item.client ? `${item.client}, ${item.format.toLowerCase()}` : item.format}</p>
                </div>
              </div>
            </article>
            );
          })}

          <div className="fx-viewfinder" aria-hidden="true">
            <span className="fx-viewfinder__corner fx-viewfinder__corner--tl" />
            <span className="fx-viewfinder__corner fx-viewfinder__corner--tr" />
            <span className="fx-viewfinder__corner fx-viewfinder__corner--bl" />
            <span className="fx-viewfinder__corner fx-viewfinder__corner--br" />
            <span className="fx-viewfinder__time"><i data-work-rec />{" "}<span data-work-time>00:00</span></span>
          </div>
        </div>

        <div className="fx-work__floor" aria-hidden="true" />
      </div>

      <div className="fx-shell fx-work__bar">
        <div className="fx-work__transport">
          <button className="fx-pill fx-pill--ghost" type="button" data-work-play data-label-play={controls.play} data-label-pause={controls.pause}>
            <svg className="fx-icon fx-icon--play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5Z" /></svg>
            <svg className="fx-icon fx-icon--pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5h3v14H8zM13 5h3v14h-3z" /></svg>
            <span data-work-play-label>{controls.play}</span>
          </button>
          <button className="fx-pill fx-pill--ghost" type="button" data-work-sound data-label-on={controls.soundOn} data-label-off={controls.soundOff}>
            <svg className="fx-icon fx-icon--muted" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5" /></svg>
            <svg className="fx-icon fx-icon--sound" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>
            <span data-work-sound-label>{controls.soundOn}</span>
          </button>
        </div>

        <div className="fx-work__progress" aria-hidden="true"><span data-work-progress /></div>

        <div className="fx-work__cta">
          <span>{workContent.cta.note}</span>
          <Link className="fx-pill fx-pill--volt" href={siteContent.routes.startProject}>
            <span>{workContent.cta.label}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M6 14 14 6M8 6h6v6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
