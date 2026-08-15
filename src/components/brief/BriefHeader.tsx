import Image from "next/image";
import Link from "next/link";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";

export function BriefHeader() {
  return (
    <header className="brief-header">
      <Link className="brief-header__brand" href={siteContent.routes.home} aria-label={projectFormContent.header.homeAriaLabel}>
        <Image {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} priority />
      </Link>
      <div className="brief-header__status" aria-label={projectFormContent.header.statusAriaLabel}>
        <span className="brief-header__status-dot" aria-hidden="true" />
        <span>{projectFormContent.header.status}</span>
      </div>
      <Link className="brief-header__back" href={siteContent.routes.home}>
        <span aria-hidden="true">←</span><span>{projectFormContent.header.backLabel}</span>
      </Link>
    </header>
  );
}
