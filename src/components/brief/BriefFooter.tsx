import { projectFormContent } from "@/content/project-form";

export function BriefFooter() {
  const { footer } = projectFormContent;
  return (
    <footer className="bf-footer">
      <span>© {new Date().getFullYear()} {footer.legalName}</span>
      {footer.items.map((item) => <span key={item}>{item}</span>)}
    </footer>
  );
}
