import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { footerContent } from "@/content/footer";
import { navigationContent } from "@/content/navigation";
import { siteContent } from "@/content/site";
import type { SocialIcon } from "@/types/content";

function SocialIconGraphic({ icon }: { icon: SocialIcon }) {
  if (icon === "instagram") {
    return <svg viewBox="0 0 24 24" role="img"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
  }
  if (icon === "whatsapp") {
    return <svg viewBox="0 0 24 24" role="img"><path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.61 5.92L.1 24l6.92-1.66a11.85 11.85 0 0 0 5.05 1.12h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.44-8.1Zm-8.44 17.98h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-4.11.99 1.1-4-.23-.41a9.82 9.82 0 1 1 8.62 5Zm5.39-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" role="img"><path d="M6.94 8.5V21H2.78V8.5h4.16ZM4.86 2.25a2.43 2.43 0 1 1 0 4.86 2.43 2.43 0 0 1 0-4.86ZM21.22 13.83V21h-4.14v-6.69c0-1.68-.6-2.83-2.1-2.83-1.15 0-1.83.77-2.13 1.52-.11.27-.14.64-.14 1.01V21H8.57s.06-11.34 0-12.5h4.14v1.77c.55-.85 1.53-2.06 3.73-2.06 2.72 0 4.78 1.78 4.78 5.62Z" /></svg>;
}

export function SiteFooter() {
  return (
    <section
      className="framio-footer"
      id="contact"
      aria-labelledby="footerTitle"
      style={{ "--footer-image": `url("${footerContent.backgroundImage}")` } as CSSProperties}
    >
      <div className="footer-shell">
        <div className="footer-cinematic">
          <div className="footer-cinematic__image" aria-hidden="true" />
          <div className="footer-cinematic__veil" aria-hidden="true" />
          <div className="footer-cinematic__light" aria-hidden="true" />
          <div className="footer-cinematic__light--two" aria-hidden="true" />

          <div className="footer-content">
            <div>
              <h2 className="footer-title" id="footerTitle">
                {footerContent.heading.prefix}<span className="accent">{footerContent.heading.accent}</span>
              </h2>
              <p className="footer-copy">{footerContent.description}</p>
            </div>

            <div className="footer-cta-row">
              <Link className="footer-cta" href={siteContent.routes.startProject}>
                <span>{footerContent.primaryCta}</span><span aria-hidden="true">↗</span>
              </Link>
              <Link className="footer-secondary-link" href="#work" data-footer-scroll>
                <span>{footerContent.secondaryCta}</span><span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="footer-info-grid">
              <div className="footer-card footer-card--brand">
                <Image className="footer-brand-logo" {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} sizes="140px" />
                <p className="footer-brand-note">{footerContent.brandNote}</p>
              </div>

              <div className="footer-card">
                <p className="footer-label">{footerContent.sectionsLabel}</p>
                <div className="footer-list">
                  {navigationContent.items.map((item) => <Link href={item.href} data-footer-scroll key={item.section}>{item.label}</Link>)}
                </div>
              </div>

              <div className="footer-card">
                <p className="footer-label">{footerContent.contactLabel}</p>
                <div className="footer-list">
                  <a href={`mailto:${footerContent.contact.email}`}>{footerContent.contact.email}</a>
                  <a href={`tel:${footerContent.contact.phoneHref}`}>{footerContent.contact.phoneDisplay}</a>
                  <span>{footerContent.contact.location}</span>
                </div>
              </div>

              <div className="footer-card footer-card--social">
                <p className="footer-label">{footerContent.socialLabel}</p>
                <div className="footer-social-list">
                  {footerContent.socials.map((social) => (
                    <a
                      className={`footer-social-link ${social.className}`}
                      href={social.href}
                      target={social.external ? "_blank" : undefined}
                      rel={social.external ? "noopener noreferrer" : undefined}
                      aria-label={social.ariaLabel}
                      key={social.label}
                    >
                      <span className="footer-social-icon" aria-hidden="true"><SocialIconGraphic icon={social.icon} /></span>
                      <span>{social.label}</span>
                      <span className="footer-social-arrow" aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{footerContent.copyright}</span>
          <span className="footer-bottom__line" aria-hidden="true" />
          <span>{footerContent.closingLine}</span>
        </div>
      </div>
    </section>
  );
}
