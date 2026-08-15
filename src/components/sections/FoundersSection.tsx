import Image from "next/image";

import { foundersContent } from "@/content/founders";

export function FoundersSection() {
  return (
    <section className="founders-showcase" id="founders" aria-labelledby="foundersTitle">
      <div className="founders-blue-lines" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <span key={index} />)}
      </div>

      <div className="founders-shell">
        <header className="founders-head">
          <div>
            <h2 className="founders-title" id="foundersTitle">{foundersContent.heading}</h2>
            <p className="founders-description">{foundersContent.description}</p>
          </div>
        </header>

        <div className="founders-reveal">
          <div
            className="founders-stage"
            data-founders-reveal
            data-cursor-label={foundersContent.cursorLabel}
            data-touch-label={foundersContent.touchLabel}
            role="button"
            tabIndex={0}
            aria-pressed="false"
            aria-label={foundersContent.stageAriaLabel}
          >
            <picture className="founders-stage__base">
              <Image {...foundersContent.baseImage} alt={foundersContent.baseImage.alt} sizes="(max-width: 760px) 100vw, 90vw" draggable={false} />
            </picture>
            <picture className="founders-stage__reveal founders-stage__reveal--left">
              <Image {...foundersContent.revealImage} alt={foundersContent.revealImage.alt} sizes="(max-width: 760px) 100vw, 90vw" draggable={false} />
            </picture>
            <picture className="founders-stage__reveal founders-stage__reveal--right">
              <Image {...foundersContent.revealImage} alt={foundersContent.revealImage.alt} sizes="(max-width: 760px) 100vw, 90vw" draggable={false} />
            </picture>

            <div className="founders-stage__grade" aria-hidden="true" />
            <div className="founders-stage__texture" aria-hidden="true" />
            <div className="founders-stage__watermark" aria-hidden="true">{foundersContent.watermark}</div>
            <span className="founders-stage__centerline" aria-hidden="true" />
            <div className="founders-stage__cursor" aria-hidden="true"><span>{foundersContent.cursorLabel}</span></div>
          </div>

          <div className="founders-roles">
            {foundersContent.roles.map((role) => (
              <article className="founders-role" key={role.index}>
                <span className="founders-role__index">{role.index}</span>
                <span className="founders-role__copy">
                  <strong>{role.name}</strong>
                  <span>{role.title}</span>
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
