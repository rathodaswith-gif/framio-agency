import { BriefFooter } from "@/components/brief/BriefFooter";
import { BriefHeader } from "@/components/brief/BriefHeader";
import { BriefIntro } from "@/components/brief/BriefIntro";
import { ProjectBriefForm } from "@/components/brief/ProjectBriefForm";
import { projectFormContent } from "@/content/project-form";
import type { CSSProperties } from "react";

export default function StartProjectPage() {
  return (
    <div
      className="brief-page"
      style={{ "--brief-dot-grid-image": `url("${projectFormContent.intro.images.dotGrid.src}")` } as CSSProperties}
    >
      <div className="brief-page__glow brief-page__glow--wine" aria-hidden="true" />
      <div className="brief-page__glow brief-page__glow--blue" aria-hidden="true" />
      <BriefHeader />
      <main className="brief-layout">
        <BriefIntro />
        <ProjectBriefForm />
      </main>
      <BriefFooter />
      <noscript>
        <div className="brief-noscript">
          {projectFormContent.noScript.prefix}
          <a href={`mailto:${projectFormContent.noScript.email}`}>{projectFormContent.noScript.email}</a>
        </div>
      </noscript>
    </div>
  );
}
