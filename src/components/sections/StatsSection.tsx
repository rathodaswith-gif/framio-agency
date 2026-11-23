import { Fragment, type CSSProperties } from "react";

import { statsContent } from "@/content/stats";

const FACES = Array.from({ length: 10 }, (_, face) => face);

/** One rolling digit: ten faces on a 3D wheel, turned to show `digit`. */
function Drum({ digit, place }: { digit: number; place: number }) {
  return (
    <span
      className="fx-drum"
      style={{ "--d": digit, "--place": place } as CSSProperties}
      data-digit={digit}
      data-place={place}
    >
      <span className="fx-drum__wheel">
        {FACES.map((face) => (
          <span className="fx-drum__face" style={{ "--f": face } as CSSProperties} key={face}>{face}</span>
        ))}
      </span>
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="fx-stats" id="impact" aria-labelledby="impactTitle" data-stats>
      <div className="fx-stats__light" aria-hidden="true" />

      <div className="fx-shell fx-stats__head">
        <h2 className="fx-title" id="impactTitle" data-fx-reveal>{statsContent.heading}</h2>
        <p className="fx-lede" data-fx-reveal>{statsContent.description}</p>
      </div>

      <div className="fx-shell">
        <div className="fx-stats__stage">
          <ul className="fx-stats__panel" aria-label={statsContent.panelLabel}>
            {statsContent.items.map((item, index) => {
              const digits = String(item.value).split("").map(Number);
              const featured = "featured" in item && item.featured;
              return (
                <li
                  className={`fx-stat${featured ? " is-featured" : ""}`}
                  style={{ "--i": index } as CSSProperties}
                  data-stat
                  key={item.label}
                >
                  <p className="fx-stat__number">
                    <span className="fx-sr">{item.value}{item.suffix}</span>
                    <span className="fx-stat__digits" aria-hidden="true">
                      {digits.map((digit, position) => (
                        <Drum digit={digit} place={digits.length - 1 - position} key={position} />
                      ))}
                    </span>
                    <span className="fx-stat__suffix" aria-hidden="true">{item.suffix}</span>
                  </p>
                  <div className="fx-stat__text">
                    <h3 className="fx-stat__label">{item.label}</h3>
                    <p className="fx-stat__copy">{item.description}</p>
                  </div>
                  {featured && (
                    <span className="fx-corners" aria-hidden="true"><i /><i /><i /><i /></span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="fx-stats__captions" data-fx-reveal>
          {statsContent.captions.map((caption, index) => (
            <Fragment key={caption}>
              <span>{caption}</span>
              {index < statsContent.captions.length - 1 && <i aria-hidden="true" />}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
