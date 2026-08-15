import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { servicesContent } from "@/content/services";
import { siteContent } from "@/content/site";
import type { SupportServiceContent } from "@/types/content";

function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="framioAnalyticsGradient" x1="9" y1="39" x2="39" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff7a18" />
          <stop offset="1" stopColor="#8f153d" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="8" height="14" rx="4" fill="url(#framioAnalyticsGradient)" />
      <rect x="20" y="17" width="8" height="23" rx="4" fill="url(#framioAnalyticsGradient)" opacity="0.86" />
      <rect x="32" y="8" width="8" height="32" rx="4" fill="url(#framioAnalyticsGradient)" opacity="0.7" />
    </svg>
  );
}

function GrowthArtwork({ item }: { item: SupportServiceContent }) {
  const art = item.artImages?.[0];
  return (
    <div className="framio-services__support-art" aria-hidden="true">
      {art && <Image className="framio-services__growth-ornament" {...art} alt={art.alt} sizes="220px" />}
      <svg className="framio-services__growth-graph" viewBox="0 0 320 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="framioGrowthGradient" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#68102f" />
            <stop offset="0.55" stopColor="#3562de" />
            <stop offset="1" stopColor="#e9ff1a" />
          </linearGradient>
        </defs>
        <path className="framio-services__growth-grid" d="M0 72H320M0 44H320M0 16H320" />
        <path className="framio-services__growth-line" d="M4 76 C40 74 47 62 74 64 S116 53 137 56 S178 36 202 41 S249 20 278 26 S302 12 316 8" />
        <circle className="framio-services__growth-dot" cx="316" cy="8" r="3.5" />
      </svg>
    </div>
  );
}

function CreativeArtwork({ item }: { item: SupportServiceContent }) {
  return (
    <div className="framio-services__support-art framio-services__creative-art" aria-hidden="true">
      <div className="framio-services__editing-tools">
        {item.artImages?.map((image) => (
          <Image className="framio-services__editing-tool" {...image} alt={image.alt} sizes="72px" key={image.src} />
        ))}
      </div>
      <div className="framio-services__timeline">
        {item.artImages?.map((image) => <div className="framio-services__timeline-track" key={image.src}><span /></div>)}
      </div>
    </div>
  );
}

function BrandArtwork({ item }: { item: SupportServiceContent }) {
  const art = item.artImages?.[0];
  return (
    <div className="framio-services__support-art framio-services__brand-art" aria-hidden="true">
      {art && <Image className="framio-services__ai-star" {...art} alt={art.alt} sizes="180px" />}
      <div className="framio-services__symbol-cluster">
        <span className="framio-services__symbol">
          <svg viewBox="0 0 24 24"><path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3Z" /></svg>
        </span>
        <span className="framio-services__symbol">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M7 6h.01M10 6h.01" /></svg>
        </span>
        <span className="framio-services__symbol">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="m16.5 7.5 3-3M17 4.5h2.5V7" /></svg>
        </span>
      </div>
    </div>
  );
}

function SupportArtwork({ item }: { item: SupportServiceContent }) {
  if (item.variant === "content") return <GrowthArtwork item={item} />;
  if (item.variant === "creative") return <CreativeArtwork item={item} />;
  return <BrandArtwork item={item} />;
}

export function ServicesSection() {
  return (
    <section
      className="framio-services"
      id="services"
      aria-labelledby="servicesTitle"
      style={{ "--services-grid-image": `url("${servicesContent.backgroundImage}")` } as CSSProperties}
    >
      <div className="framio-services__shell">
        <header className="framio-services__header">
          <h2 className="framio-services__heading" id="servicesTitle">
            {servicesContent.heading.prefix}<span>{servicesContent.heading.accent}</span>
          </h2>
          <p className="framio-services__lede">{servicesContent.description}</p>
        </header>

        <div className="framio-services__grid">
          <article className="framio-services__card framio-services__card--featured" data-services-pointer>
            <div className="framio-services__surface">
              <span className="framio-services__number" aria-hidden="true">{servicesContent.featured.number}</span>
              <div className="framio-services__featured-copy">
                <h3 className="framio-services__card-title">{servicesContent.featured.title}</h3>
                <p className="framio-services__card-description">{servicesContent.featured.description}</p>
                <Link className="framio-services__cta" href={siteContent.routes.startProject}>
                  <span>{servicesContent.featured.ctaLabel}</span>
                  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M8 5h7v7" /></svg>
                </Link>
              </div>

              <div className="framio-services__featured-system">
                <div className="framio-services__platforms" aria-label={servicesContent.featured.toolsAriaLabel}>
                  {servicesContent.featured.tools.map((tool) => (
                    <div className="framio-services__tool" role="img" aria-label={tool.label} key={tool.label}>
                      <span className={`framio-services__tool-media${tool.imageClassName ? ` ${tool.imageClassName}` : ""}`}>
                        {tool.kind === "analytics" ? <AnalyticsIcon /> : tool.image && <Image {...tool.image} alt={tool.image.alt} sizes="72px" />}
                      </span>
                      <span className="framio-services__tool-label" aria-hidden="true">{tool.label}</span>
                    </div>
                  ))}
                </div>

                <div className="framio-services__deliverables">
                  <p className="framio-services__deliverables-label">{servicesContent.featured.deliverablesLabel}</p>
                  <ul className="framio-services__list">
                    {servicesContent.featured.deliverables.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </article>

          {servicesContent.support.map((item) => (
            <article className={`framio-services__card framio-services__card--support framio-services__card--${item.variant}`} key={item.number}>
              <div className="framio-services__surface">
                <span className="framio-services__number" aria-hidden="true">{item.number}</span>
                <div className="framio-services__support-copy">
                  {item.badge && <span className="framio-services__badge">{item.badge}</span>}
                  <h3 className="framio-services__support-title">{item.title}</h3>
                  {item.items && <ul className="framio-services__list">{item.items.map((entry) => <li key={entry}>{entry}</li>)}</ul>}
                  {item.description && <p className="framio-services__support-description">{item.description}</p>}
                </div>
                <SupportArtwork item={item} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
