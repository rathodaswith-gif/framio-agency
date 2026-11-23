import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { brandsContent } from "@/content/brands";
import { siteContent } from "@/content/site";

function FrameCorners() {
  return (
    <span className="fx-corners" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export function BrandsSection() {
  return (
    <section className="fx-brands" id="brands" aria-labelledby="brandsTitle" data-brand-wall>
      <div className="fx-shell fx-brands__head">
        <h2 className="fx-title" id="brandsTitle" data-fx-reveal>{brandsContent.heading}</h2>
        <p className="fx-lede" data-fx-reveal>{brandsContent.description}</p>
      </div>

      <div className="fx-brands__stage" data-brand-stage>
        <ul className="fx-brands__wall" aria-label={brandsContent.wallLabel} data-brand-plane>
          {brandsContent.items.map((brand, index) => (
            <li
              className="fx-plate"
              style={{ "--plate-bg": brand.background, "--i": index } as CSSProperties}
              data-brand-plate
              key={brand.name}
            >
              <div className="fx-plate__body">
                <span className="fx-plate__sheen" aria-hidden="true" />
                <Image
                  className="fx-plate__logo fx-plate__logo--mono"
                  {...brand.mono}
                  alt={brand.mono.alt}
                  sizes="(max-width: 700px) 40vw, 220px"
                />
                <Image
                  className="fx-plate__logo fx-plate__logo--color"
                  {...brand.color}
                  alt=""
                  aria-hidden="true"
                  sizes="(max-width: 700px) 40vw, 220px"
                />
              </div>
              <FrameCorners />
            </li>
          ))}

          <li className="fx-plate fx-plate--cta" style={{ "--i": brandsContent.items.length } as CSSProperties} data-brand-plate>
            <Link className="fx-plate__body" href={siteContent.routes.startProject} aria-label={brandsContent.cta.ariaLabel}>
              <span className="fx-plate__cta-title">{brandsContent.cta.title}</span>
              <span className="fx-plate__cta-text">{brandsContent.cta.description}</span>
              <span className="fx-plate__cta-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20" focusable="false"><path d="M6 14 14 6M8 6h6v6" /></svg>
              </span>
            </Link>
            <FrameCorners />
          </li>
        </ul>
        <div className="fx-brands__floor" aria-hidden="true" />
      </div>
    </section>
  );
}
