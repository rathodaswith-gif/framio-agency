"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";
import type { ApiResponse, ProjectSubmissionInput } from "@/types/submission";

type FormErrors = Partial<Record<keyof ProjectSubmissionInput | "submit", string>>;
type Draft = ProjectSubmissionInput & { currentStep: number; furthestStep: number };

const DRAFT_KEY = "framio_project_draft_v2";
const initialForm: ProjectSubmissionInput = {
  name: "",
  brand: "",
  email: "",
  phone: "",
  services: [],
  goal: "",
  timeline: "",
  budget: "",
  projectDetails: "",
  companyWebsite: ""
};

// Defined at module level so they're stable references and never trigger
// useEffect dependency size changes.
const ALLOWED_SERVICES = new Set<string>(projectFormContent.services.options.map((o) => o.value));
const ALLOWED_GOALS = new Set<string>(projectFormContent.project.goal.options);
const ALLOWED_TIMELINES = new Set<string>(projectFormContent.project.timeline.options);
const ALLOWED_BUDGETS = new Set<string>(projectFormContent.budget.options.map((o) => o.value));

function FieldError({ message }: { message?: string }) {
  return <p className="brief-error" aria-live="polite">{message ?? ""}</p>;
}

function StepHeading({ kicker, id, prefix, accent, description }: {
  kicker: string;
  id: string;
  prefix: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="brief-step__heading">
      <p className="brief-step__kicker">{kicker}</p>
      <h2 id={id} tabIndex={-1}>{prefix}<span>{accent}</span></h2>
      <p>{description}</p>
    </div>
  );
}

export function ProjectBriefForm() {
  const content = projectFormContent;
  const workspaceRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<ProjectSubmissionInput>(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveMessage, setSaveMessage] = useState<string>(content.actions.saved);
  const [initialized, setInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = content.progressSteps;
  const lastStep = steps.length - 1;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(DRAFT_KEY);
        if (stored) {
          const draft = JSON.parse(stored) as Partial<Draft>;

          // Only pick ProjectSubmissionInput fields - never let draft navigation
          // keys (currentStep, furthestStep) bleed into the form state and get
          // sent to the server, which would cause a .strict() schema rejection.
          const services = Array.isArray(draft.services)
            ? draft.services.filter((s) => ALLOWED_SERVICES.has(s))
            : [];

          setForm({
            name: draft.name ?? "",
            brand: draft.brand ?? "",
            email: draft.email ?? "",
            phone: draft.phone ?? "",
            services,
            goal: ALLOWED_GOALS.has(draft.goal ?? "") ? (draft.goal ?? "") : "",
            timeline: ALLOWED_TIMELINES.has(draft.timeline ?? "") ? (draft.timeline ?? "") : "",
            budget: ALLOWED_BUDGETS.has(draft.budget ?? "") ? (draft.budget ?? "") : "",
            projectDetails: draft.projectDetails ?? "",
            companyWebsite: draft.companyWebsite ?? ""
          });

          const restored = Number.isInteger(draft.currentStep) ? Math.min(lastStep, Math.max(0, draft.currentStep ?? 0)) : 0;
          setCurrentStep(restored);
          setFurthestStep(Number.isInteger(draft.furthestStep) ? Math.min(lastStep, Math.max(restored, draft.furthestStep ?? restored)) : restored);
          setSaveMessage(content.actions.restored);
        }
      } catch {
        setSaveMessage(content.actions.unavailable);
      } finally {
        setInitialized(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [content.actions.restored, content.actions.unavailable, lastStep]);

  useEffect(() => {
    if (!initialized || isSuccess) return;
    const timer = window.setTimeout(() => {
      try {
        const draft: Draft = { ...form, currentStep, furthestStep };
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        setSaveMessage(content.actions.saved);
      } catch {
        setSaveMessage(content.actions.unavailable);
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [content.actions.saved, content.actions.saving, content.actions.unavailable, currentStep, form, furthestStep, initialized, isSuccess]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const reviewItems = useMemo(() => [
    { key: "name", label: content.review.labels.name, value: form.name },
    { key: "brand", label: content.review.labels.brand, value: form.brand },
    { key: "services", label: content.review.labels.services, value: form.services.join(content.review.valueSeparator), wide: true },
    { key: "goal", label: content.review.labels.goal, value: form.goal },
    { key: "timeline", label: content.review.labels.timeline, value: form.timeline },
    { key: "budget", label: content.review.labels.budget, value: form.budget },
    { key: "contact", label: content.review.labels.contact, value: [form.email, form.phone].filter(Boolean).join(content.review.valueSeparator) },
    { key: "projectDetails", label: content.review.labels.projectDetails, value: form.projectDetails, wide: true }
  ], [content.review, form]);

  const update = <K extends keyof ProjectSubmissionInput>(field: K, value: ProjectSubmissionInput[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, submit: undefined }));
    setSaveMessage(content.actions.saving);
  };

  const toggleService = (service: string, checked: boolean) => {
    const next = checked ? [...form.services, service] : form.services.filter((item) => item !== service);
    update("services", next);
  };

  const validateStep = (step: number) => {
    const nextErrors: FormErrors = {};
    if (step === 0) {
      if (form.name.trim().length < 2) nextErrors.name = content.validation.nameRequired;
      if (form.brand.trim().length < 2) nextErrors.brand = content.validation.brandRequired;
      if (!form.email.trim()) nextErrors.email = content.validation.emailRequired;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = content.validation.emailInvalid;
      if (!form.phone.trim()) nextErrors.phone = content.validation.phoneRequired;
      else if (form.phone.replace(/\D/g, "").length < 8) nextErrors.phone = content.validation.phoneInvalid;
    }
    if (step === 1 && !form.services.length) nextErrors.services = content.validation.servicesRequired;
    if (step === 2) {
      if (!form.goal) nextErrors.goal = content.validation.goalRequired;
      if (!form.timeline) nextErrors.timeline = content.validation.timelineRequired;
      if (form.projectDetails.trim().length < 10) nextErrors.projectDetails = content.validation.detailsRequired;
    }
    if (step === 3 && !form.budget) nextErrors.budget = content.validation.budgetRequired;
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) window.setTimeout(() => document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(), 0);
    return Object.keys(nextErrors).length === 0;
  };

  const goToStep = (step: number, focus = true, clearErrors = true) => {
    const next = Math.min(lastStep, Math.max(0, step));
    setCurrentStep(next);
    setFurthestStep((current) => Math.max(current, next));
    if (clearErrors) setErrors({});
    setSaveMessage(content.actions.saving);
    if (focus) window.setTimeout(() => document.querySelector<HTMLElement>(`[data-brief-step="${next}"] h2`)?.focus({ preventScroll: true }), 80);
    const workspace = workspaceRef.current;
    if (workspace && workspace.getBoundingClientRect().top < 0) {
      window.scrollTo({ top: Math.max(0, workspace.offsetTop - 12), behavior: "smooth" });
    }
  };

  const handleNext = () => { if (validateStep(currentStep)) goToStep(currentStep + 1); };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    for (let step = 0; step < lastStep; step += 1) {
      if (!validateStep(step)) {
        goToStep(step, false, false);
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json() as ApiResponse<{ publicId: string; createdAt: string }>;
      if (!response.ok || !result.ok) {
        const fieldErrors = !result.ok ? result.fieldErrors : undefined;
        const mapped: FormErrors = {};
        if (fieldErrors) Object.entries(fieldErrors).forEach(([key, messages]) => { mapped[key as keyof ProjectSubmissionInput] = messages?.[0]; });
        mapped.submit = !result.ok ? result.error : content.validation.submitFailed;
        setErrors(mapped);
        const firstField = Object.keys(mapped).find((key) => key !== "submit");
        const fieldSteps: Record<string, number> = { name: 0, brand: 0, email: 0, phone: 0, services: 1, goal: 2, timeline: 2, projectDetails: 2, budget: 3 };
        if (firstField && firstField in fieldSteps) goToStep(fieldSteps[firstField], false, false);
        return;
      }
      window.localStorage.removeItem(DRAFT_KEY);
      setIsSuccess(true);
      window.setTimeout(() => document.getElementById("briefSuccessTitle")?.focus({ preventScroll: true }), 100);
    } catch {
      setErrors({ submit: content.validation.submitFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnother = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setFurthestStep(0);
    setErrors({});
    setIsSuccess(false);
    setSaveMessage(content.actions.saved);
    window.setTimeout(() => document.getElementById("briefName")?.focus(), 0);
  };

  return (
    <section className={`brief-workspace${isSuccess ? " is-success" : ""}`} id="briefWorkspace" ref={workspaceRef} aria-labelledby="briefStepTitle">
      <div className="brief-workspace__top" hidden={isSuccess}>
        <div className="brief-progress__meta">
          <span>{content.progressStepPrefix} {String(currentStep + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          <span>{steps[currentStep].name}</span>
        </div>
        <ol className="brief-progress" aria-label={content.progressAriaLabel}>
          {steps.map((step, index) => (
            <li key={step.name}>
              <button
                type="button"
                disabled={index >= currentStep}
                aria-current={index === currentStep ? "step" : undefined}
                aria-label={`${content.progressStepPrefix} ${index + 1}, ${step.name}`}
                className={index < currentStep ? "is-complete" : undefined}
                onClick={() => goToStep(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span><small>{step.shortLabel}</small>
              </button>
            </li>
          ))}
        </ol>
        <div className="brief-progress__track" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={currentStep + 1} aria-label={content.progressAriaLabel}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <form className="brief-form" noValidate hidden={isSuccess} onSubmit={handleSubmit}>
        <p className="brief-honeypot" aria-hidden="true">
          <label>{content.honeypotLabel}<input name="companyWebsite" tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => update("companyWebsite", event.target.value)} /></label>
        </p>

        <div className="brief-form__viewport">
          <section className={`brief-step${currentStep === 0 ? " is-active" : ""}`} data-brief-step="0" hidden={currentStep !== 0} aria-labelledby="briefStepTitle">
            <StepHeading kicker={content.about.kicker} id="briefStepTitle" prefix={content.about.heading.prefix} accent={content.about.heading.accent} description={content.about.description} />
            <div className="brief-fields">
              <div className="brief-field">
                <label htmlFor="briefName">{content.about.fields.name.label} <span>*</span></label>
                <input className={errors.name ? "is-invalid" : undefined} aria-invalid={Boolean(errors.name)} id="briefName" name="name" type="text" autoComplete="name" placeholder={content.about.fields.name.placeholder} value={form.name} onChange={(event) => update("name", event.target.value)} />
                <FieldError message={errors.name} />
              </div>
              <div className="brief-field">
                <label htmlFor="briefBrand">{content.about.fields.brand.label} <span>*</span></label>
                <input className={errors.brand ? "is-invalid" : undefined} aria-invalid={Boolean(errors.brand)} id="briefBrand" name="brand" type="text" autoComplete="organization" placeholder={content.about.fields.brand.placeholder} value={form.brand} onChange={(event) => update("brand", event.target.value)} />
                <FieldError message={errors.brand} />
              </div>
              <div className="brief-field">
                <label htmlFor="briefEmail">{content.about.fields.email.label} <span>*</span></label>
                <input className={errors.email ? "is-invalid" : undefined} aria-invalid={Boolean(errors.email)} id="briefEmail" name="email" type="email" autoComplete="email" inputMode="email" placeholder={content.about.fields.email.placeholder} value={form.email} onChange={(event) => update("email", event.target.value)} />
                <FieldError message={errors.email} />
              </div>
              <div className="brief-field">
                <label htmlFor="briefPhone">{content.about.fields.phone.label} <span>*</span></label>
                <input className={errors.phone ? "is-invalid" : undefined} aria-invalid={Boolean(errors.phone)} id="briefPhone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder={content.about.fields.phone.placeholder} value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                <FieldError message={errors.phone} />
              </div>
            </div>
          </section>

          <section className={`brief-step${currentStep === 1 ? " is-active" : ""}`} data-brief-step="1" hidden={currentStep !== 1} aria-labelledby="briefServicesTitle">
            <StepHeading kicker={content.services.kicker} id="briefServicesTitle" prefix={content.services.heading.prefix} accent={content.services.heading.accent} description={content.services.description} />
            <div className="brief-choices brief-choices--services">
              {content.services.options.map((option, index) => (
                <label className={`brief-choice${"wide" in option && option.wide ? " brief-choice--wide" : ""}`} key={option.value}>
                  <input type="checkbox" name="services" value={option.value} checked={form.services.includes(option.value)} onChange={(event) => toggleService(option.value, event.target.checked)} />
                  <span className="brief-choice__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="brief-choice__content"><strong>{option.title}</strong><small>{option.description}</small></span>
                  <span className="brief-choice__mark" aria-hidden="true">✓</span>
                </label>
              ))}
            </div>
            <p className="brief-error brief-error--group">{errors.services}</p>
          </section>

          <section className={`brief-step${currentStep === 2 ? " is-active" : ""}`} data-brief-step="2" hidden={currentStep !== 2} aria-labelledby="briefProjectTitle">
            <StepHeading kicker={content.project.kicker} id="briefProjectTitle" prefix={content.project.heading.prefix} accent={content.project.heading.accent} description={content.project.description} />
            <div className="brief-fields">
              <div className="brief-field">
                <label htmlFor="briefGoal">{content.project.goal.label} <span>*</span></label>
                <select className={errors.goal ? "is-invalid" : undefined} aria-invalid={Boolean(errors.goal)} id="briefGoal" name="goal" value={form.goal} onChange={(event) => update("goal", event.target.value)}>
                  <option value="">{content.project.goal.placeholder}</option>
                  {content.project.goal.options.map((option) => <option key={option}>{option}</option>)}
                </select>
                <FieldError message={errors.goal} />
              </div>
              <div className="brief-field">
                <label htmlFor="briefTimeline">{content.project.timeline.label} <span>*</span></label>
                <select className={errors.timeline ? "is-invalid" : undefined} aria-invalid={Boolean(errors.timeline)} id="briefTimeline" name="timeline" value={form.timeline} onChange={(event) => update("timeline", event.target.value)}>
                  <option value="">{content.project.timeline.placeholder}</option>
                  {content.project.timeline.options.map((option) => <option key={option}>{option}</option>)}
                </select>
                <FieldError message={errors.timeline} />
              </div>
              <div className="brief-field brief-field--wide">
                <div className="brief-field__label-row">
                  <label htmlFor="briefDetails">{content.project.details.label} <span>*</span></label>
                  <span>{form.projectDetails.length} / {content.project.details.maxLength}</span>
                </div>
                <textarea className={errors.projectDetails ? "is-invalid" : undefined} aria-invalid={Boolean(errors.projectDetails)} id="briefDetails" name="projectDetails" maxLength={content.project.details.maxLength} placeholder={content.project.details.placeholder} value={form.projectDetails} onChange={(event) => update("projectDetails", event.target.value)} />
                <FieldError message={errors.projectDetails} />
              </div>
            </div>
          </section>

          <section className={`brief-step${currentStep === 3 ? " is-active" : ""}`} data-brief-step="3" hidden={currentStep !== 3} aria-labelledby="briefBudgetTitle">
            <StepHeading kicker={content.budget.kicker} id="briefBudgetTitle" prefix={content.budget.heading.prefix} accent={content.budget.heading.accent} description={content.budget.description} />
            <div className="brief-choices brief-choices--budget">
              {content.budget.options.map((option) => (
                <label className="brief-choice" key={option.value}>
                  <input type="radio" name="budget" value={option.value} checked={form.budget === option.value} onChange={() => update("budget", option.value)} />
                  <span className="brief-choice__index" aria-hidden="true">{option.index}</span>
                  <span className="brief-choice__content"><strong>{option.title}</strong><small>{option.description}</small></span>
                  <span className="brief-choice__mark" aria-hidden="true">✓</span>
                </label>
              ))}
            </div>
            <p className="brief-error brief-error--group">{errors.budget}</p>
          </section>

          <section className={`brief-step${currentStep === 4 ? " is-active" : ""}`} data-brief-step="4" hidden={currentStep !== 4} aria-labelledby="briefReviewTitle">
            <StepHeading kicker={content.review.kicker} id="briefReviewTitle" prefix={content.review.heading.prefix} accent={content.review.heading.accent} description={content.review.description} />
            <div className="brief-review">
              {reviewItems.map((item) => (
                <div className={`brief-review__item${item.wide ? " brief-review__item--wide" : ""}`} key={item.key}>
                  <span>{item.label}</span><strong>{item.value || content.review.emptyValue}</strong>
                </div>
              ))}
            </div>
            <p className="brief-privacy"><span aria-hidden="true">✓</span>{content.review.privacy}</p>
          </section>
        </div>

        <div className="brief-actions">
          <p className={`brief-save${saveMessage === content.actions.saving ? " is-saving" : ""}`} aria-live="polite"><span aria-hidden="true">✓</span>{saveMessage}</p>
          <div className="brief-actions__buttons">
            <button className="brief-button brief-button--back" type="button" hidden={currentStep === 0} onClick={() => goToStep(currentStep - 1)}><span aria-hidden="true">←</span>{content.actions.back}</button>
            <button className="brief-button brief-button--primary" type="button" hidden={currentStep === lastStep} onClick={handleNext}>{content.actions.continue}<span aria-hidden="true">→</span></button>
            <button className="brief-button brief-button--primary" type="submit" hidden={currentStep !== lastStep} disabled={isSubmitting}>{isSubmitting ? content.actions.submitting : content.actions.submit}<span aria-hidden="true">↗</span></button>
          </div>
        </div>
        {errors.submit && <p className="brief-error brief-error--group" role="alert">{errors.submit}</p>}
      </form>

      <section className="brief-success" aria-hidden={!isSuccess} hidden={!isSuccess} aria-labelledby="briefSuccessTitle">
        <div className="brief-success__visual" aria-hidden="true">
          <Image {...content.intro.images.orbits} alt={content.intro.images.orbits.alt} />
          <Image {...content.intro.images.star} alt={content.intro.images.star.alt} />
          <span>✓</span>
        </div>
        <p className="brief-step__kicker">{content.success.kicker}</p>
        <h2 id="briefSuccessTitle" tabIndex={-1}>{content.success.heading.prefix}<span>{content.success.heading.accent}</span></h2>
        <p>{content.success.description}</p>
        <div className="brief-success__actions">
          <Link className="brief-button brief-button--primary" href={siteContent.routes.home}>{content.success.homeLabel}<span aria-hidden="true">→</span></Link>
          <a className="brief-button brief-button--back" href={content.success.whatsappHref} target="_blank" rel="noopener noreferrer">{content.success.whatsappLabel}<span aria-hidden="true">↗</span></a>
        </div>
        <button className="brief-success__again" type="button" onClick={submitAnother}>{content.success.anotherLabel}</button>
      </section>
    </section>
  );
}
