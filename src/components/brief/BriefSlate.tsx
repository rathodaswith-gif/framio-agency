"use client";

import type { CSSProperties } from "react";

import { projectFormContent } from "@/content/project-form";
import type { ProjectSubmissionInput } from "@/types/submission";

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The film slate beside the form. It fills in as the client types,
 * claps when they move to the next step, and closes on "That's a wrap".
 */
export function BriefSlate({
  form,
  step,
  total,
  clapKey,
  wrapped,
  date
}: {
  form: ProjectSubmissionInput;
  step: number;
  total: number;
  clapKey: number;
  wrapped: boolean;
  date: string;
}) {
  const labels = projectFormContent.slate;

  // Picked values (goal, budget…) replay a small "ink" animation when they change.
  // Typed values only animate when they first appear, so typing never flickers.
  const value = (text: string, typed = false) => (
    <span className={`bf-slate__value${text ? "" : " is-empty"}`} key={typed ? (text ? "filled" : "empty") : text || "empty"}>
      {text || labels.empty}
    </span>
  );

  return (
    <div
      className={`bf-slate${wrapped ? " is-wrapped" : ""}`}
      role="group"
      aria-label={labels.ariaLabel}
      style={{ "--scene-progress": (step + 1) / total } as CSSProperties}
    >
      <div className="bf-slate__sticks" aria-hidden="true">
        <span className={`bf-slate__clapper${clapKey ? " is-clapping" : ""}`} key={clapKey} />
        <span className="bf-slate__base" />
      </div>

      <div className="bf-slate__body">
        <div className="bf-slate__row bf-slate__row--title">
          <span className="bf-slate__label">{labels.production}</span>
          <span className={`bf-slate__value bf-slate__brand${form.brand.trim() ? "" : " is-empty"}`} key={form.brand.trim() ? "filled" : "empty"}>
            {form.brand.trim() || labels.brandFallback}
          </span>
        </div>

        <div className="bf-slate__split">
          <div className="bf-slate__row">
            <span className="bf-slate__label">{labels.client}</span>
            {value(form.name.trim(), true)}
          </div>
          <div className="bf-slate__row">
            <span className="bf-slate__label">{labels.budget}</span>
            {value(form.budget)}
          </div>
        </div>

        <div className="bf-slate__row">
          <span className="bf-slate__label">{labels.services}</span>
          {form.services.length ? (
            <span className="bf-slate__chips">
              {form.services.map((service) => <span className="bf-slate__chip" key={service}>{service}</span>)}
            </span>
          ) : value("")}
        </div>

        <div className="bf-slate__split">
          <div className="bf-slate__row">
            <span className="bf-slate__label">{labels.goal}</span>
            {value(form.goal)}
          </div>
          <div className="bf-slate__row">
            <span className="bf-slate__label">{labels.timeline}</span>
            {value(form.timeline)}
          </div>
        </div>

        <div className="bf-slate__meta">
          <div>
            <span className="bf-slate__label">{labels.scene}</span>
            <span className="bf-slate__big" key={`scene-${step}`}>{pad(step + 1)}<small>/{pad(total)}</small></span>
          </div>
          <div>
            <span className="bf-slate__label">{labels.take}</span>
            <span className="bf-slate__big">01</span>
          </div>
          <div>
            <span className="bf-slate__label">{labels.date}</span>
            <span className="bf-slate__big bf-slate__date">{date || "--.--.--"}</span>
          </div>
        </div>
      </div>

      <span className="bf-slate__stamp" aria-hidden={!wrapped}>{labels.wrapped}</span>
    </div>
  );
}
