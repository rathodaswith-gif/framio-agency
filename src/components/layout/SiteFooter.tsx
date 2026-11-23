import Link from "next/link";
import type { CSSProperties } from "react";

import { footerContent } from "@/content/footer";
import { navigationContent } from "@/content/navigation";
import { siteContent } from "@/content/site";
import type { SocialIcon } from "@/types/content";

const MARK_LAYERS = 9;

function SocialIconGraphic({ icon }: { icon: SocialIcon }) {
  if (icon === "instagram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>;
  }
  if (icon === "whatsapp") {
    return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.84 11.84 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.61 5.92L.1 24l6.92-1.66a11.85 11.85 0 0 0 5.05 1.12h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.44-8.1Zm-8.44 17.98h-.01a9.84 9.84 0 0 1-5.01-1.37l-.36-.21-4.11.99 1.1-4-.23-.41a9.82 9.82 0 1 1 8.62 5Zm5.39-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.94 8.5V21H2.78V8.5h4.16ZM4.86 2.25a2.43 2.43 0 1 1 0 4.86 2.43 2.43 0 0 1 0-4.86ZM21.22 13.83V21h-4.14v-6.69c0-1.68-.6-2.83-2.1-2.83-1.15 0-1.83.77-2.13 1.52-.11.27-.14.64-.14 1.01V21H8.57s.06-11.34 0-12.5h4.14v1.77c.55-.85 1.53-2.06 3.73-2.06 2.72 0 4.78 1.78 4.78 5.62Z" /></svg>;
}

function ArrowChip() {
  return (
    <span className="fx-btn__chip" aria-hidden="true">
      <svg viewBox="0 0 20 20" focusable="false"><path d="M6 14 14 6M8 6h6v6" /></svg>
    </span>
  );
}

export function SiteFooter() {
  const { wordmark, labels, contact } = footerContent;
  const letters = Array.from(wordmark.text);
  const year = new Date().getFullYear();

  return (
    <footer className="fx-footer" id="contact" aria-labelledby="footerTitle" data-footer>
      <div className="fx-footer__light" aria-hidden="true" />

      <div className="fx-shell fx-footer__top">
        <h2 className="fx-footer__title" id="footerTitle" data-fx-reveal>
          {footerContent.heading.map((line) => <span className="fx-footer__title-line" key={line}>{line}</span>)}
        </h2>

        <div className="fx-footer__cta" data-fx-reveal>
          <p>{footerContent.description}</p>
          <div className="fx-footer__actions">
            <Link className="fx-btn fx-btn--primary" href={siteContent.routes.startProject}>
              <span>{footerContent.primaryCta}</span>
              <ArrowChip />
            </Link>
            <a className="fx-btn fx-btn--glass" href={footerContent.whatsappCta.href} target="_blank" rel="noopener noreferrer">
              <span>{footerContent.whatsappCta.label}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="fx-shell fx-footer__grid" data-fx-reveal>
        <div className="fx-footer__col">
          <h3>{labels.email}</h3>
          <a className="fx-link" href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div className="fx-footer__col">
          <h3>{labels.phone}</h3>
          <a className="fx-link" href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a>
        </div>
        <div className="fx-footer__col">
          <h3>{labels.studio}</h3>
          <address>{contact.studio.map((line) => <span key={line}>{line}</span>)}</address>
        </div>
        <nav className="fx-footer__col" aria-label={labels.explore}>
          <h3>{labels.explore}</h3>
          <ul>
            {navigationContent.items.map((item) => (
              <li key={item.section}><Link className="fx-link" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="fx-footer__col">
          <h3>{labels.social}</h3>
          <ul className="fx-footer__social">
            {footerContent.socials.map((social) => (
              <li key={social.label}>
                <a
                  className="fx-social"
                  href={social.href}
                  target={social.external ? "_blank" : undefined}
                  rel={social.external ? "noopener noreferrer" : undefined}
                  aria-label={social.ariaLabel}
                >
                  <SocialIconGraphic icon={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fx-footer__mark" data-footer-mark aria-hidden="true">
        <div className="fx-mark" data-footer-tilt>
          {letters.map((letter, index) => (
            <span
              className={`fx-mark__ch${index === wordmark.accentIndex ? " is-accent" : ""}`}
              style={{ "--i": index } as CSSProperties}
              key={`${letter}-${index}`}
            >
              {Array.from({ length: MARK_LAYERS }, (_, depth) => (
                <span className="fx-mark__layer" style={{ "--d": MARK_LAYERS - depth } as CSSProperties} key={depth}>{letter}</span>
              ))}
              <span className="fx-mark__face">{letter}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="fx-sr">{wordmark.text}</p>

      <div className="fx-shell fx-footer__bottom">
        <span>© {year} {footerContent.legalName}</span>
        <span className="fx-footer__clock">
          <i aria-hidden="true" />
          {labels.localTime} <time data-local-time>--:--</time> {labels.timeZone}
        </span>
        <a className="fx-link" href="#home">{labels.backToTop}</a>
      </div>
    </footer>
  );
}
