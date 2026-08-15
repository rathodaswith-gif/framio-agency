import { statsContent } from "@/content/stats";
import { Fragment, type CSSProperties } from "react";

export function StatsSection() {
  return (
    <section
      className="impact-showcase"
      id="impact"
      aria-labelledby="impactTitle"
      style={{
        "--stats-red-image": `url("${statsContent.artImages.red}")`,
        "--stats-blue-image": `url("${statsContent.artImages.blue}")`
      } as CSSProperties}
    >
      <div className="impact-shell">
        <div className="impact-head">
          <div>
            <h2 className="impact-title" id="impactTitle">
              {statsContent.heading.prefix}<span>{statsContent.heading.accent}</span>
            </h2>
            <p className="impact-copy">{statsContent.description}</p>
          </div>
        </div>

        <div className="impact-board">
          <svg className="impact-network" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
            <path className="impact-network__base" d="M 70 40 H 930" />
            <path className="impact-network__draw" d="M 70 40 H 930" />
            <path className="impact-network__flow" pathLength="1" d="M 70 40 H 930" />
            {[166, 389, 611, 834].map((cx) => <circle className="impact-network__node" cx={cx} cy="40" r="5" key={cx} />)}
          </svg>

          <div className="impact-grid">
            {statsContent.items.map((item) => (
              <article className={`impact-stat${item.featured ? " impact-stat--featured" : ""}`} key={item.index}>
                <span className={`impact-stat__art impact-stat__art--${item.art}`} aria-hidden="true" />
                <div className="impact-stat__top">
                  <span className="impact-stat__index">{item.index}</span>
                  <span className="impact-stat__signal" aria-hidden="true" />
                </div>
                <div>
                  <div className="impact-stat__metric">
                    <span className="impact-counter" data-target={item.value}>0</span>
                    <span className="impact-suffix">{item.suffix}</span>
                  </div>
                  <h3 className="impact-stat__label">{item.label}</h3>
                  <p className="impact-stat__copy">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="impact-caption">
            {statsContent.captions.map((caption, index) => (
              <Fragment key={caption}>
                <span>{caption}</span>
                {index < statsContent.captions.length - 1 && <span className="impact-caption__line" aria-hidden="true" />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
