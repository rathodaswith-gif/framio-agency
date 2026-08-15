import { projectFormContent } from "@/content/project-form";

export function BriefFooter() {
  return <footer className="brief-footer">{projectFormContent.footer.map((item) => <span key={item}>{item}</span>)}</footer>;
}
