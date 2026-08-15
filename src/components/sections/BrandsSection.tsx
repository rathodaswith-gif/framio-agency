import Image from "next/image";

import { brandsContent } from "@/content/brands";
import type { BrandContent } from "@/types/content";

function BrandRow({ items, label, reverse = false }: { items: readonly BrandContent[]; label: string; reverse?: boolean }) {
  const repeated = [...items, ...items];
  return (
    <div className={`brand-row${reverse ? " brand-row--reverse" : ""}`} aria-label={label}>
      <div className="brand-track">
        {repeated.map((brand, index) => {
          const duplicate = index >= items.length;
          return (
            <div className="brand-tile" aria-hidden={duplicate || undefined} key={`${brand.name}-${index}`}>
              <Image {...brand.image} alt={duplicate ? "" : brand.image.alt} sizes="(max-width: 680px) 46vw, 260px" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BrandsSection() {
  const reverseItems = [...brandsContent.items].reverse();
  return (
    <section className="brands-showcase" id="about" aria-labelledby="brandsTitle">
      <div className="brands-shell">
        <div className="brands-head">
          <div>
            <h2 className="brands-title" id="brandsTitle">{brandsContent.heading}</h2>
            <p className="brands-copy">{brandsContent.description}</p>
          </div>
        </div>

        <div className="brands-stage">
          <div className="brands-panel-glow" aria-hidden="true" />
          <div className="brands-panel-core">
            <BrandRow items={brandsContent.items} label={brandsContent.rowOneAriaLabel} />
            <BrandRow items={reverseItems} label={brandsContent.rowTwoAriaLabel} reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
