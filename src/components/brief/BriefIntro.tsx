import Image from "next/image";

import { projectFormContent } from "@/content/project-form";

export function BriefIntro() {
  const { intro } = projectFormContent;
  return (
    <aside className="brief-intro" aria-labelledby="briefIntroTitle">
      <div className="brief-intro__grid" aria-hidden="true" />
      <Image className="brief-intro__geometry" {...intro.images.geometry} alt={intro.images.geometry.alt} aria-hidden="true" />
      <Image className="brief-intro__orbits" {...intro.images.orbits} alt={intro.images.orbits.alt} aria-hidden="true" />
      <Image className="brief-intro__star" {...intro.images.star} alt={intro.images.star.alt} aria-hidden="true" />
      <Image className="brief-intro__gem" {...intro.images.gem} alt={intro.images.gem.alt} aria-hidden="true" />

      <div className="brief-intro__content">
        <p className="brief-eyebrow"><span aria-hidden="true" />{intro.eyebrow}</p>
        <h1 id="briefIntroTitle">{intro.heading.prefix}<em>{intro.heading.accent}</em></h1>
        <p className="brief-intro__copy">{intro.description}</p>
      </div>

      <div className="brief-intro__trust" aria-label={intro.trustAriaLabel}>
        {intro.trustItems.map((item) => (
          <div key={item.index}>
            <span className="brief-intro__trust-icon" aria-hidden="true">{item.index}</span>
            <p><strong>{item.title}</strong><span>{item.description}</span></p>
          </div>
        ))}
      </div>
    </aside>
  );
}
