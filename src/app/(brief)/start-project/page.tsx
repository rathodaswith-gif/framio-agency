import { BriefFooter } from "@/components/brief/BriefFooter";
import { BriefHeader } from "@/components/brief/BriefHeader";
import { BriefIntro, BriefTrust } from "@/components/brief/BriefIntro";
import { ProjectBriefForm } from "@/components/brief/ProjectBriefForm";
import { projectFormContent } from "@/content/project-form";

export default function StartProjectPage() {
  return (
    <div className="bf-page">
      <div className="bf-page__light" aria-hidden="true" />
      <BriefHeader />
      <main className="bf-main">
        <ProjectBriefForm intro={<BriefIntro />} trust={<BriefTrust />} />
      </main>
      <BriefFooter />
      <noscript>
        <div className="bf-noscript">
          {projectFormContent.noScript.prefix}
          <a href={`mailto:${projectFormContent.noScript.email}`}>{projectFormContent.noScript.email}</a>
        </div>
      </noscript>
    </div>
  );
}
