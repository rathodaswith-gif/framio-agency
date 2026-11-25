import { manifestoContent } from "@/content/manifesto";

/**
 * Manifesto: "Most brands blend in. We carve out colour."
 * Two copies of the artwork are stacked: a grey one underneath and the colour
 * one on top, revealed outward from the knife cut as the section scrolls
 * (showcase/carve.ts drives --paint, --fill and --zoom). Without JS or with
 * reduced motion everything shows fully painted.
 */
export function ManifestoSection() {
  const { heading, body, image } = manifestoContent;
  const phoneQuery = "(max-width: 760px)";

  const artwork = (className: string, alt: string) => (
    <picture>
      <source media={phoneQuery} srcSet={image.phone.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={className}
        src={image.wide.src}
        srcSet={image.wide.srcSet}
        sizes="(max-width: 1400px) 100vw, 1320px"
        width={image.wide.width}
        height={image.wide.height}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );

  return (
    <section className="carve" id="manifesto" aria-labelledby="carveTitle" data-carve>
      <div className="carve__track">
        <div className="carve__stage">
          <h2 className="carve__title" id="carveTitle">
            <span className="carve__line carve__line--grey">{heading.grey}</span>{" "}
            <span className="carve__line carve__line--colour">
              <span className="carve__base">{heading.colour}</span>
              <span className="carve__fill" aria-hidden="true">{heading.colour}</span>
            </span>
          </h2>

          <p className="carve__copy">{body}</p>

          <figure className="carve__art" data-carve-art>
            <div className="carve__layer carve__layer--grey" aria-hidden="true">{artwork("carve__img", "")}</div>
            <div className="carve__layer carve__layer--colour">{artwork("carve__img", image.alt)}</div>
            <span className="carve__light" aria-hidden="true" />
          </figure>
        </div>
      </div>
    </section>
  );
}
