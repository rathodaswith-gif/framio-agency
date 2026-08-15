import Link from "next/link";

import { navigationContent } from "@/content/navigation";
import { siteContent } from "@/content/site";

export function MobileMenu() {
  return (
    <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
      <div className="mobile-menu-inner">
        <p className="mobile-eyebrow">{navigationContent.mobileEyebrow}</p>

        <nav className="mobile-nav" aria-label={navigationContent.mobileAriaLabel}>
          {navigationContent.items.map((item) => (
            <Link className="mobile-link" href={item.href} key={item.section}>
              <span className="mobile-index">{item.index}</span>
              <span className="mobile-label">{item.label.toUpperCase()}</span>
              <span className="mobile-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>

        <Link className="header-cta mobile-cta" href={siteContent.routes.startProject}>
          <span>{navigationContent.ctaLabel}</span>
          <span className="cta-arrow" aria-hidden="true">↗</span>
        </Link>

        <div className="mobile-meta">
          {navigationContent.mobileMeta.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
    </div>
  );
}
