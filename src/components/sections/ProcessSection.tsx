import type { CSSProperties } from "react";

import { processContent } from "@/content/process";

const processPath = `M 145 260
  C 145 130, 300 78, 500 78
  C 500 138, 500 205, 500 260
  C 500 322, 500 382, 500 442
  C 720 442, 855 385, 855 260
  H 930`;

export function ProcessSection() {
  return (
    <section className="framio-process" id="process" aria-labelledby="processHeading">
      <div className="process-inner">
        <div className="process-intro">
          <h2 className="process-heading" id="processHeading">
            {processContent.heading.prefix}<strong>{processContent.heading.accent}</strong>
          </h2>
          <p className="process-copy">{processContent.description}</p>
        </div>

        <div className="process-map">
          <svg
            className="process-orbit"
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
            role="img"
            aria-label={processContent.diagramAriaLabel}
          >
            <path className="process-link process-link--continuous" pathLength="1" d={processPath} />
            <path className="process-flow process-flow--continuous" pathLength="1" d={processPath} />
            <circle className="process-origin" cx="145" cy="260" r="4.5" />
          </svg>

          {processContent.steps.map((step) => (
            <div className={`process-node process-node--${step.position}`} key={step.index}>
              <small>{step.index}</small>
              <span>{step.lead}</span>
              {step.position === "center" ? <strong>{step.emphasis}</strong> : <em>{step.emphasis}</em>}
            </div>
          ))}
        </div>
      </div>

      <div className="mobile-process-journey" aria-labelledby="mobileProcessHeading">
        <div className="mobile-process-journey__intro">
          <h2 className="mobile-process-journey__heading" id="mobileProcessHeading">
            {processContent.heading.prefix}<strong>{processContent.heading.accent}</strong>
          </h2>
          <p className="mobile-process-journey__copy">{processContent.description}</p>
        </div>

        <div className="mobile-process-timeline">
          <div className="mobile-process-rail" aria-hidden="true">
            <span className="mobile-process-rail__fill" />
          </div>

          {processContent.steps.map((step, index) => (
            <article
              className="mobile-process-step"
              style={{ "--step-index": index } as CSSProperties}
              key={step.index}
            >
              <div className="mobile-process-step__node" aria-hidden="true"><span>{step.index}</span></div>
              <div className={`mobile-process-step__card${step.position === "center" ? " mobile-process-step__card--core" : ""}`}>
                <div className="mobile-process-step__top">
                  <span className="mobile-process-step__number">{step.index}</span>
                  <span className="mobile-process-step__status" aria-hidden="true"><i /></span>
                </div>
                <h3>{step.mobileTitle}</h3>
                <p>{step.mobileDescription}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
