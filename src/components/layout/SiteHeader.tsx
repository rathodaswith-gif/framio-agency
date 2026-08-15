import Image from "next/image";
import Link from "next/link";

import { navigationContent } from "@/content/navigation";
import { siteContent } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header" id="siteHeader">
      <div className="header-shell">
        <Link className="brand" href="#home" aria-label={`${siteContent.brand.name} home`}>
          <Image className="brand-logo" {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} priority />
        </Link>

        <nav className="desktop-nav" aria-label={navigationContent.ariaLabel}>
          {navigationContent.items.map((item) => (
            <Link className="nav-link" href={item.href} data-section={item.section} key={item.section}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="header-cta desktop-only" href={siteContent.routes.startProject}>
            <span>{navigationContent.ctaLabel}</span>
            <span className="cta-arrow" aria-hidden="true">↗</span>
          </Link>

          <button
            className="menu-toggle"
            id="menuToggle"
            type="button"
            aria-expanded="false"
            aria-controls="mobileMenu"
            aria-label={navigationContent.openAriaLabel}
            data-open-label={navigationContent.openLabel}
            data-close-label={navigationContent.closeLabel}
            data-open-aria-label={navigationContent.openAriaLabel}
            data-close-aria-label={navigationContent.closeAriaLabel}
          >
            <span id="menuLabel">{navigationContent.openLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
