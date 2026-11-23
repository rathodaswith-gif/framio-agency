import { projectFormContent } from "@/content/project-form";

/** Heading and promises shown beside the form (passed into the form as `intro`). */
export function BriefIntro() {
  const { intro } = projectFormContent;
  return (
    <div className="bf-intro">
      <h1 id="briefIntroTitle">
        {intro.heading.prefix}
        <span>{intro.heading.accent}</span>
      </h1>
      <p className="bf-intro__copy">{intro.description}</p>
    </div>
  );
}

export function BriefTrust() {
  const { intro } = projectFormContent;
  return (
    <ul className="bf-trust" aria-label={intro.trustAriaLabel}>
      {intro.trustItems.map((item) => (
        <li key={item.index}>
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m5 10.5 3.2 3L15 6.5" /></svg>
          <p><strong>{item.title}</strong><span>{item.description}</span></p>
        </li>
      ))}
    </ul>
  );
}
