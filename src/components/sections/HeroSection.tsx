import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { heroContent } from "@/content/hero";
import { siteContent } from "@/content/site";

export function HeroSection() {
  return (
    <section className="hero" id="home" aria-labelledby="heroTitle">
      <picture className="hero-media">
        <source media="(min-width: 1700px)" srcSet={heroContent.image.src} type="image/webp" />
        <Image
          className="hero-image"
          {...heroContent.fallbackImage}
          alt={heroContent.fallbackImage.alt}
          priority
          sizes="100vw"
        />
      </picture>

      <div className="hero-color-grade" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-bottom-fade" aria-hidden="true" />
      <div className="speed-lines" id="speedLines" aria-hidden="true" />
      <div className="hero-noise" aria-hidden="true" />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-mark" aria-hidden="true">
            <Image {...heroContent.badge.image} alt={heroContent.badge.image.alt} sizes="64px" />
          </span>
          <span className="hero-badge-label">{heroContent.badge.label}</span>
        </div>

        <p className="hero-script">{heroContent.script}</p>
        <div className="hero-title-wrap">
          <h1 className="hero-title" id="heroTitle">{heroContent.title}</h1>
        </div>
        <p className="hero-description">{heroContent.description}</p>

        <div className="hero-actions">
          <Link className="hero-cta" href={siteContent.routes.startProject}>
            <span>{heroContent.primaryCta}</span>
            <span className="cta-arrow" aria-hidden="true">↗</span>
          </Link>
          <Link className="hero-secondary" href="#work">
            {heroContent.secondaryCta}
            <span aria-hidden="true">↓</span>
          </Link>
        </div>

        <div className="hero-service-line" aria-label={heroContent.servicesAriaLabel}>
          {heroContent.serviceTags.map((tag, index) => (
            <Fragment key={tag}>
              <span>{tag}</span>
              {index < heroContent.serviceTags.length - 1 && <i aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
