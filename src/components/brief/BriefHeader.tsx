import Image from "next/image";
import Link from "next/link";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";

export function BriefHeader() {
  const { header } = projectFormContent;
  return (
    <header className="bf-header">
      <Link className="bf-header__brand" href={siteContent.routes.home} aria-label={header.homeAriaLabel}>
        <Image {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} priority />
      </Link>
      <p className="bf-header__status" aria-label={header.statusAriaLabel}>
        <span className="bf-header__dot" aria-hidden="true" />
        {header.status}
      </p>
      <Link className="bf-header__back" href={siteContent.routes.home}>
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12 5 7 10l5 5" /></svg>
        <span>{header.backLabel}</span>
      </Link>
    </header>
  );
}
