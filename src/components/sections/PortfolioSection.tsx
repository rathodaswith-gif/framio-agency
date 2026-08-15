import Image from "next/image";

import { portfolioContent } from "@/content/portfolio";

export function PortfolioSection() {
  const carouselItems = [...portfolioContent.items, ...portfolioContent.items];
  return (
    <section className="style-carousel-showcase" id="work" aria-labelledby="styleTitle">
      <div className="style-shell">
        <div className="style-head">
          <div>
            <h2 className="style-title" id="styleTitle">{portfolioContent.heading}</h2>
            <p className="style-copy">{portfolioContent.description}</p>
          </div>
        </div>
      </div>

      <div className="style-marquee-wrap" aria-label={portfolioContent.carouselAriaLabel}>
        <div className="style-track">
          {carouselItems.map((item, index) => {
            const duplicate = index >= portfolioContent.items.length;
            return (
              <article className="style-card" aria-hidden={duplicate || undefined} key={`${item.title}-${index}`}>
                <Image {...item.image} alt={duplicate ? "" : item.image.alt} sizes="(max-width: 680px) 72vw, 360px" />
                <div className="style-card__content">
                  <h3 className="style-card__title">{item.title}</h3>
                  <p className="style-card__caption">{item.caption}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="style-shell">
        <div className="style-footer">
          <p>{portfolioContent.footerLabel}</p>
          <span className="style-footer__line" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
