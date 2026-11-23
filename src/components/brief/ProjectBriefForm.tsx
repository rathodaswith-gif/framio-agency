"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import { projectFormContent } from "@/content/project-form";
import { siteContent } from "@/content/site";
import type { ApiResponse, ProjectSubmissionInput } from "@/types/submission";

import { BriefSlate } from "./BriefSlate";

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

// Module level so they're stable references for effects.
const ALLOWED_SERVICES = new Set<string>(projectFormContent.services.options.map((o) => o.value));
const ALLOWED_GOALS = new Set<string>(projectFormContent.project.goal.options);
const ALLOWED_TIMELINES = new Set<string>(projectFormContent.project.timeline.options);
const ALLOWED_BUDGETS = new Set<string>(projectFormContent.budget.options.map((o) => o.value));
const FIELD_STEPS: Record<string, number> = { name: 0, brand: 0, email: 0, phone: 0, services: 1, goal: 2, timeline: 2, projectDetails: 2, budget: 3 };

const pad = (value: number) => String(value).padStart(2, "0");
const anim = (index: number) => ({ "--i": index } as CSSProperties);

function FieldError({ id, message }: { id: string; message?: string }) {
  return <p className="bf-error" id={id} aria-live="polite">{message ?? ""}</p>;
}

function StepHeading({ id, kicker, prefix, accent, description }: {
  id: string;
  kicker: string;
  prefix: string;
  accent: string;
  description: string;
}) {
  return (
    <div className="bf-step__heading" data-anim style={anim(0)}>
      <p className="bf-step__kicker">{kicker}</p>
      <h2 id={id} tabIndex={-1}>{prefix}<span>{accent}</span></h2>
      <p>{description}</p>
    </div>
  );
}

function Check() {
  return (
    <span className="bf-check" aria-hidden="true">
      <svg viewBox="0 0 20 20" focusable="false"><path d="m5 10.5 3.2 3L15 6.5" /></svg>
    </span>
  );
}

export function ProjectBriefForm({ intro, trust }: { intro?: ReactNode; trust?: ReactNode }) {
  const content = projectFormContent;
  const panelRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<ProjectSubmissionInput>(initialForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [clapKey, setClapKey] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saveMessage, setSaveMessage] = useState<string>(content.actions.saved);
  const [initialized, setInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [today, setToday] = useState("");

  const steps = content.progressSteps;
  const lastStep = steps.length - 1;

  // Restore a saved draft (and set today's date for the slate) after mount.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const now = new Date();
      setToday(`${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${String(now.getFullYear()).slice(-2)}`);
      try {
        const stored = window.localStorage.getItem(DRAFT_KEY);
        if (stored) {
          const draft = JSON.parse(stored) as Partial<Draft>;
          // Only pick ProjectSubmissionInput fields; navigation keys must never reach the API.
          const services = Array.isArray(draft.services) ? draft.services.filter((s) => ALLOWED_SERVICES.has(s)) : [];
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

  // Save the draft on this device as the client types.
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
  }, [content.actions.saved, content.actions.unavailable, currentStep, form, furthestStep, initialized, isSuccess]);

  const reviewItems = useMemo(() => [
    { key: "name", label: content.review.labels.name, value: form.name, step: 0 },
    { key: "brand", label: content.review.labels.brand, value: form.brand, step: 0 },
    { key: "contact", label: content.review.labels.contact, value: [form.email, form.phone].filter(Boolean).join(content.review.valueSeparator), step: 0, wide: true },
    { key: "services", label: content.review.labels.services, value: form.services.join(content.review.valueSeparator), step: 1, wide: true },
    { key: "goal", label: content.review.labels.goal, value: form.goal, step: 2 },
    { key: "timeline", label: content.review.labels.timeline, value: form.timeline, step: 2 },
    { key: "projectDetails", label: content.review.labels.projectDetails, value: form.projectDetails, step: 2, wide: true },
    { key: "budget", label: content.review.labels.budget, value: form.budget, step: 3, wide: true }
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

  // If the top of the panel has scrolled out of view, bring it back once the new content is in.
  const revealPanel = () => {
    window.setTimeout(() => {
      const panel = panelRef.current;
      if (panel && panel.getBoundingClientRect().top < 0) {
        window.scrollTo({ top: Math.max(0, panel.getBoundingClientRect().top + window.scrollY - 16), behavior: "smooth" });
      }
    }, 40);
  };

  const goToStep = (step: number, focus = true, clearErrors = true) => {
    const next = Math.min(lastStep, Math.max(0, step));
    if (next === currentStep) return;
    setDirection(next > currentStep ? "forward" : "back");
    if (next > currentStep) setClapKey((key) => key + 1);
    setCurrentStep(next);
    setFurthestStep((current) => Math.max(current, next));
    if (clearErrors) setErrors({});
    setSaveMessage(content.actions.saving);
    if (focus) window.setTimeout(() => document.querySelector<HTMLElement>(`[data-brief-step="${next}"] h2`)?.focus({ preventScroll: true }), 80);
    revealPanel();
  };

  const handleNext = () => { if (validateStep(currentStep)) goToStep(currentStep + 1); };

  const jumpTo = (step: number) => {
    if (step === currentStep || step > furthestStep) return;
    if (step > currentStep && !validateStep(currentStep)) return;
    goToStep(step);
  };

  // Enter moves to the next step instead of sending the whole form early.
  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON" || target.tagName === "A") return;
    if (currentStep < lastStep) {
      event.preventDefault();
      handleNext();
    }
  };

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
        if (firstField && firstField in FIELD_STEPS) goToStep(FIELD_STEPS[firstField], false, false);
        return;
      }
      try { window.localStorage.removeItem(DRAFT_KEY); } catch { /* storage blocked: nothing to clear */ }
      setClapKey((key) => key + 1);
      setIsSuccess(true);
      revealPanel();
      window.setTimeout(() => document.getElementById("briefSuccessTitle")?.focus({ preventScroll: true }), 100);
    } catch {
      setErrors({ submit: content.validation.submitFailed });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAnother = () => {
    setForm(initialForm);
    setDirection("back");
    setCurrentStep(0);
    setFurthestStep(0);
    setErrors({});
    setIsSuccess(false);
    setSaveMessage(content.actions.saved);
    revealPanel();
    window.setTimeout(() => document.getElementById("briefName")?.focus({ preventScroll: true }), 80);
  };

  const fieldProps = (field: "name" | "brand" | "email" | "phone") => ({
    className: errors[field] ? "is-invalid" : undefined,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": `${field}Error`,
    name: field,
    value: form[field],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => update(field, event.target.value)
  });

  const about = content.about.fields;

  return (
    <div className={`bf-shell${isSuccess ? " is-success" : ""}`}>
      <aside className="bf-aside" aria-labelledby="briefIntroTitle">
        {intro}
        <BriefSlate form={form} step={isSuccess ? lastStep : currentStep} total={steps.length} clapKey={clapKey} wrapped={isSuccess} date={today} />
        {trust}
      </aside>

      <section className="bf-panel" ref={panelRef} aria-labelledby={isSuccess ? "briefSuccessTitle" : "briefStepTitle"}>
        <div className="bf-progress" hidden={isSuccess}>
          <p className="bf-progress__label">
            <span>{content.progressStepPrefix} {currentStep + 1} of {steps.length}</span>
            <strong key={steps[currentStep].name}>{steps[currentStep].name}</strong>
          </p>
          <ol className="bf-progress__steps" aria-label={content.progressAriaLabel}>
            {steps.map((step, index) => {
              const state = index < currentStep ? "is-done" : index === currentStep ? "is-current" : index <= furthestStep ? "is-visited" : "";
              return (
                <li key={step.name}>
                  <button
                    type="button"
                    className={state || undefined}
                    disabled={index > furthestStep}
                    aria-current={index === currentStep ? "step" : undefined}
                    aria-label={`${content.progressStepPrefix} ${index + 1}, ${step.name}`}
                    onClick={() => jumpTo(index)}
                  >
                    <span className="bf-progress__bar" aria-hidden="true" />
                    <span className="bf-progress__name">{step.shortLabel}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <form className="bf-form" noValidate hidden={isSuccess} onSubmit={handleSubmit} onKeyDown={handleKeyDown} data-direction={direction}>
          <p className="bf-honeypot" aria-hidden="true">
            <label>{content.honeypotLabel}<input name="companyWebsite" tabIndex={-1} autoComplete="off" value={form.companyWebsite} onChange={(event) => update("companyWebsite", event.target.value)} /></label>
          </p>

          {/* Step 1: about you */}
          <section className={`bf-step${currentStep === 0 ? " is-active" : ""}`} data-brief-step="0" hidden={currentStep !== 0} aria-labelledby="briefStepTitle">
            <StepHeading id="briefStepTitle" kicker={content.about.kicker} prefix={content.about.heading.prefix} accent={content.about.heading.accent} description={content.about.description} />
            <div className="bf-grid">
              <div className={`bf-field${errors.name ? " is-invalid" : ""}`} data-anim style={anim(1)}>
                <label htmlFor="briefName">{about.name.label}</label>
                <input id="briefName" type="text" autoComplete="name" placeholder={about.name.placeholder} {...fieldProps("name")} />
                <FieldError id="nameError" message={errors.name} />
              </div>
              <div className={`bf-field${errors.brand ? " is-invalid" : ""}`} data-anim style={anim(2)}>
                <label htmlFor="briefBrand">{about.brand.label}</label>
                <input id="briefBrand" type="text" autoComplete="organization" placeholder={about.brand.placeholder} {...fieldProps("brand")} />
                <FieldError id="brandError" message={errors.brand} />
              </div>
              <div className={`bf-field${errors.email ? " is-invalid" : ""}`} data-anim style={anim(3)}>
                <label htmlFor="briefEmail">{about.email.label}</label>
                <input id="briefEmail" type="email" autoComplete="email" inputMode="email" placeholder={about.email.placeholder} {...fieldProps("email")} />
                <FieldError id="emailError" message={errors.email} />
              </div>
              <div className={`bf-field${errors.phone ? " is-invalid" : ""}`} data-anim style={anim(4)}>
                <label htmlFor="briefPhone">{about.phone.label}</label>
                <input id="briefPhone" type="tel" autoComplete="tel" inputMode="tel" placeholder={about.phone.placeholder} {...fieldProps("phone")} />
                <FieldError id="phoneError" message={errors.phone} />
              </div>
            </div>
          </section>

          {/* Step 2: services */}
          <section className={`bf-step${currentStep === 1 ? " is-active" : ""}`} data-brief-step="1" hidden={currentStep !== 1} aria-labelledby="briefServicesTitle">
            <StepHeading id="briefServicesTitle" kicker={content.services.kicker} prefix={content.services.heading.prefix} accent={content.services.heading.accent} description={content.services.description} />
            <fieldset className={`bf-options bf-options--services${errors.services ? " is-invalid" : ""}`} aria-describedby="servicesError">
              <legend className="bf-sr">{content.progressSteps[1].name}</legend>
              {content.services.options.map((option, index) => (
                <label className={`bf-option${"wide" in option && option.wide ? " bf-option--wide" : ""}`} data-anim style={anim(index + 1)} key={option.value}>
                  <input type="checkbox" name="services" value={option.value} checked={form.services.includes(option.value)} onChange={(event) => toggleService(option.value, event.target.checked)} />
                  <span className="bf-option__body">
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                  <Check />
                </label>
              ))}
            </fieldset>
            <FieldError id="servicesError" message={errors.services} />
          </section>

          {/* Step 3: project */}
          <section className={`bf-step${currentStep === 2 ? " is-active" : ""}`} data-brief-step="2" hidden={currentStep !== 2} aria-labelledby="briefProjectTitle">
            <StepHeading id="briefProjectTitle" kicker={content.project.kicker} prefix={content.project.heading.prefix} accent={content.project.heading.accent} description={content.project.description} />
            <fieldset className={`bf-chips-group${errors.goal ? " is-invalid" : ""}`} data-anim style={anim(1)} aria-describedby="goalError">
              <legend>{content.project.goal.label}</legend>
              <div className="bf-chips">
                {content.project.goal.options.map((option) => (
                  <label className="bf-chip" key={option}>
                    <input type="radio" name="goal" value={option} checked={form.goal === option} onChange={() => update("goal", option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <FieldError id="goalError" message={errors.goal} />
            </fieldset>
            <fieldset className={`bf-chips-group${errors.timeline ? " is-invalid" : ""}`} data-anim style={anim(2)} aria-describedby="timelineError">
              <legend>{content.project.timeline.label}</legend>
              <div className="bf-chips">
                {content.project.timeline.options.map((option) => (
                  <label className="bf-chip" key={option}>
                    <input type="radio" name="timeline" value={option} checked={form.timeline === option} onChange={() => update("timeline", option)} />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <FieldError id="timelineError" message={errors.timeline} />
            </fieldset>
            <div className={`bf-field bf-field--area${errors.projectDetails ? " is-invalid" : ""}`} data-anim style={anim(3)}>
              <div className="bf-field__row">
                <label htmlFor="briefDetails">{content.project.details.label}</label>
                <span className="bf-count">{form.projectDetails.length} / {content.project.details.maxLength}</span>
              </div>
              <textarea
                id="briefDetails"
                name="projectDetails"
                className={errors.projectDetails ? "is-invalid" : undefined}
                aria-invalid={Boolean(errors.projectDetails)}
                aria-describedby="projectDetailsError"
                maxLength={content.project.details.maxLength}
                placeholder={content.project.details.placeholder}
                value={form.projectDetails}
                onChange={(event) => update("projectDetails", event.target.value)}
              />
              <FieldError id="projectDetailsError" message={errors.projectDetails} />
            </div>
          </section>

          {/* Step 4: budget */}
          <section className={`bf-step${currentStep === 3 ? " is-active" : ""}`} data-brief-step="3" hidden={currentStep !== 3} aria-labelledby="briefBudgetTitle">
            <StepHeading id="briefBudgetTitle" kicker={content.budget.kicker} prefix={content.budget.heading.prefix} accent={content.budget.heading.accent} description={content.budget.description} />
            <fieldset className={`bf-options bf-options--budget${errors.budget ? " is-invalid" : ""}`} aria-describedby="budgetError">
              <legend className="bf-sr">{content.progressSteps[3].name}</legend>
              {content.budget.options.map((option, index) => (
                <label className={`bf-option bf-option--budget${option.title.startsWith("₹") ? "" : " bf-option--words"}`} data-anim style={anim(index + 1)} key={option.value}>
                  <input type="radio" name="budget" value={option.value} checked={form.budget === option.value} onChange={() => update("budget", option.value)} />
                  <span className="bf-option__body">
                    <strong>{option.title}</strong>
                    <small>{option.description}</small>
                  </span>
                  <Check />
                </label>
              ))}
            </fieldset>
            <FieldError id="budgetError" message={errors.budget} />
          </section>

          {/* Step 5: review */}
          <section className={`bf-step${currentStep === 4 ? " is-active" : ""}`} data-brief-step="4" hidden={currentStep !== 4} aria-labelledby="briefReviewTitle">
            <StepHeading id="briefReviewTitle" kicker={content.review.kicker} prefix={content.review.heading.prefix} accent={content.review.heading.accent} description={content.review.description} />
            <dl className="bf-review">
              {reviewItems.map((item, index) => (
                <div className={`bf-review__item${item.wide ? " bf-review__item--wide" : ""}`} data-anim style={anim(index + 1)} key={item.key}>
                  <dt>{item.label}</dt>
                  <dd>{item.value || content.review.emptyValue}</dd>
                  <button type="button" className="bf-review__edit" onClick={() => goToStep(item.step)} aria-label={`${content.review.editLabel} ${item.label}`}>
                    {content.review.editLabel}
                  </button>
                </div>
              ))}
            </dl>
            <p className="bf-privacy" data-anim style={anim(reviewItems.length + 1)}>
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 2.5 4 5v4.5c0 3.7 2.6 6.7 6 8 3.4-1.3 6-4.3 6-8V5l-6-2.5Z" /></svg>
              {content.review.privacy}
            </p>
          </section>

          {errors.submit && (
            <p className="bf-alert" role="alert">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M10 6v5M10 14h.01M10 2.5l8 14.5H2L10 2.5Z" /></svg>
              {errors.submit}
            </p>
          )}

          <div className="bf-actions">
            <p className={`bf-save${saveMessage === content.actions.saving ? " is-saving" : ""}`} aria-live="polite">
              <span aria-hidden="true" />
              {saveMessage}
            </p>
            <div className="bf-actions__buttons">
              <button className="bf-btn bf-btn--ghost" type="button" hidden={currentStep === 0} onClick={() => goToStep(currentStep - 1)}>
                <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M12 5 7 10l5 5" /></svg>
                {content.actions.back}
              </button>
              <button className="bf-btn bf-btn--primary" type="button" hidden={currentStep === lastStep} onClick={handleNext}>
                {content.actions.continue}
                <span className="bf-btn__chip" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5 10h10M11 6l4 4-4 4" /></svg></span>
              </button>
              <button className={`bf-btn bf-btn--primary${isSubmitting ? " is-loading" : ""}`} type="submit" hidden={currentStep !== lastStep} disabled={isSubmitting}>
                {isSubmitting ? content.actions.submitting : content.actions.submit}
                <span className="bf-btn__chip" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M6 14 14 6M8 6h6v6" /></svg></span>
              </button>
            </div>
          </div>
        </form>

        <section className="bf-success" hidden={!isSuccess} aria-labelledby="briefSuccessTitle">
          <span className="bf-success__badge" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="m5 10.5 3.2 3L15 6.5" /></svg></span>
          <p className="bf-step__kicker">{content.success.kicker}</p>
          <h2 id="briefSuccessTitle" tabIndex={-1}>{content.success.heading.prefix}<span>{content.success.heading.accent}</span></h2>
          <p className="bf-success__copy">{content.success.description}</p>
          <div className="bf-success__actions">
            <Link className="bf-btn bf-btn--primary" href={siteContent.routes.home}>
              {content.success.homeLabel}
              <span className="bf-btn__chip" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5 10h10M11 6l4 4-4 4" /></svg></span>
            </Link>
            <a className="bf-btn bf-btn--ghost" href={content.success.whatsappHref} target="_blank" rel="noopener noreferrer">{content.success.whatsappLabel}</a>
          </div>
          <button className="bf-success__again" type="button" onClick={submitAnother}>{content.success.anotherLabel}</button>
        </section>
      </section>
    </div>
  );
}
