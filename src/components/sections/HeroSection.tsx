import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";

import { heroContent } from "@/content/hero";
import { siteContent } from "@/content/site";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Hero as a camera viewfinder: FRAMIO's own reels play in a focus-framed
 * monitor beside the headline. Playback, timecode and clip switching run in
 * showcase/hero-viewfinder.ts; the intro is pure CSS so it works without JS.
 */
export function HeroSection() {
  const { reel } = heroContent;
  const [first, second] = reel.clips;
  const total = pad(reel.clips.length);

  return (
    <section className="vf" id="home" aria-labelledby="heroTitle" data-viewfinder>
      <div className="vf-ambient" aria-hidden="true">
        {reel.clips.map((clip, index) => (
          // Blurred stills behind everything pick up the colours of the playing clip.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={clip.video.src}
            className={index === 0 ? "is-active" : undefined}
            src={clip.video.poster}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            data-vf-ambient
          />
        ))}
      </div>
      <div className="vf-light" aria-hidden="true" />

      <div className="vf-frame">
        <span className="vf-corner vf-corner--tl" aria-hidden="true" />
        <span className="vf-corner vf-corner--tr" aria-hidden="true" />
        <span className="vf-corner vf-corner--bl" aria-hidden="true" />
        <span className="vf-corner vf-corner--br" aria-hidden="true" />

        <div className="vf-top">
          <button
            className="vf-rec"
            type="button"
            aria-pressed="false"
            aria-label={reel.pause}
            data-vf-toggle
            data-label-pause={reel.pause}
            data-label-play={reel.play}
            data-text-rec={reel.rec}
            data-text-paused={reel.paused}
          >
            <span className="vf-rec__dot" aria-hidden="true" />
            <span className="vf-rec__label" data-vf-rec-label>{reel.rec}</span>
            <span className="vf-rec__tc" data-vf-timecode aria-hidden="true">01:00:00:00</span>
            <span className="vf-rec__icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" focusable="false" className="vf-rec__pause"><path d="M5 3.5v9M11 3.5v9" /></svg>
              <svg viewBox="0 0 16 16" focusable="false" className="vf-rec__play"><path d="M5 3.2v9.6L12.6 8 5 3.2Z" /></svg>
            </span>
          </button>

          <p className="vf-now">
            <span className="vf-now__label">{reel.nowPlaying}</span>
            <span className="vf-now__num" data-vf-num>{`01/${total}`}</span>
            <span className="vf-now__name" data-vf-name>{first.name}</span>
            <span className="vf-now__format" data-vf-format>{first.format}</span>
          </p>
        </div>

        <div className="vf-stage">
          <div className="vf-content">
            <div className="vf-badge">
              <span className="vf-badge__mark" aria-hidden="true">
                <Image {...heroContent.badge.image} alt={heroContent.badge.image.alt} sizes="64px" />
              </span>
              <span>{heroContent.badge.label}</span>
            </div>

            <p className="vf-script">{heroContent.script}</p>
            <h1 className="vf-title" id="heroTitle">
              {heroContent.title.split(" ").map((word, index, words) => (
                <Fragment key={word}>
                  <span className="vf-title__line" style={{ "--line": index } as CSSProperties}>
                    <span>{word}</span>
                  </span>
                  {index < words.length - 1 && " "}
                </Fragment>
              ))}
            </h1>
            <p className="vf-description">{heroContent.description}</p>

            <div className="vf-actions">
              <Link className="hero-cta vf-cta" href={siteContent.routes.startProject}>
                <span>{heroContent.primaryCta}</span>
                <span className="cta-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link className="vf-secondary" href="#work">
                {heroContent.secondaryCta}
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>

          <div className="vf-monitor-wrap">
            <div className="vf-monitor" data-vf-monitor>
              <div className="vf-screen">
                <video
                  className="vf-video is-active"
                  src={first.video.src}
                  poster={first.video.poster}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                  data-vf-video
                  data-clip="0"
                />
                <video
                  className="vf-video"
                  poster={second.video.poster}
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  data-vf-video
                />
              </div>
              <span className="vf-focus" aria-hidden="true">
                <i /><i /><i /><i />
              </span>
            </div>

            <ol className="vf-clips" aria-label={reel.ariaLabel}>
              {reel.clips.map((clip, index) => (
                <li key={clip.video.src}>
                  <button
                    type="button"
                    aria-label={`${reel.showClip} ${index + 1}: ${clip.name}`}
                    aria-current={index === 0 ? "true" : undefined}
                    className={index === 0 ? "is-current" : undefined}
                    data-vf-clip={index}
                    data-src={clip.video.src}
                    data-poster={clip.video.poster}
                    data-name={clip.name}
                    data-format={clip.format}
                  >
                    <span className="vf-clips__bar" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
