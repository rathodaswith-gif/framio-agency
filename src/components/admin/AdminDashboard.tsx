"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { adminContent } from "@/content/admin";
import { siteContent } from "@/content/site";
import type { ApiResponse, LeadStatusValue, ProjectSubmissionRecord } from "@/types/submission";

function dateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return adminContent.formatting.emptyValue;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function StatusBadge({ status }: { status: LeadStatusValue }) {
  const label = adminContent.statusLabels[status];
  return <span className="admin-status" data-status={label}>{label}</span>;
}

function StatCard({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return <article className="admin-stat"><div className="admin-stat__label">{label}</div><div className="admin-stat__value">{value}{accent && <span>+</span>}</div></article>;
}

export function AdminDashboard({ initialSubmissions, initialError = "" }: { initialSubmissions: ProjectSubmissionRecord[]; initialError?: string }) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatusValue | "ALL">("ALL");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<LeadStatusValue>("NEW");
  const [activeNote, setActiveNote] = useState("");
  const [message, setMessage] = useState(initialError);
  const [saving, setSaving] = useState(false);

  const active = submissions.find((item) => item.id === activeId) ?? null;
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((lead) => {
      const haystack = [lead.name, lead.brand, lead.email, lead.phone, lead.goal, lead.budget, ...lead.services].join(" ").toLowerCase();
      return (!query || haystack.includes(query)) && (status === "ALL" || lead.status === status);
    });
  }, [search, status, submissions]);

  const now = new Date();
  const stats = {
    total: submissions.length,
    new: submissions.filter((lead) => lead.status === "NEW").length,
    qualified: submissions.filter((lead) => lead.status === "QUALIFIED").length,
    month: submissions.filter((lead) => {
      const date = new Date(lead.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length
  };

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveId(null); };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [active]);

  const openLead = (lead: ProjectSubmissionRecord) => {
    setActiveId(lead.id);
    setActiveStatus(lead.status);
    setActiveNote(lead.adminNote);
    setMessage("");
  };

  const refresh = async () => {
    setMessage("");
    try {
      const response = await fetch("/api/admin/submissions", { cache: "no-store" });
      const result = await response.json() as ApiResponse<ProjectSubmissionRecord[]>;
      if (!response.ok || !result.ok) {
        if (response.status === 401) router.replace("/admin/login");
        setMessage(adminContent.messages.loadFailed);
        return;
      }
      setSubmissions(result.data);
    } catch {
      setMessage(adminContent.messages.loadFailed);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const saveLead = async () => {
    if (!active || saving) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/submissions/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: activeStatus, adminNote: activeNote })
      });
      const result = await response.json() as ApiResponse<ProjectSubmissionRecord>;
      if (!response.ok || !result.ok) {
        setMessage(adminContent.messages.saveFailed);
        return;
      }
      setSubmissions((items) => items.map((item) => item.id === result.data.id ? result.data : item));
      setActiveId(null);
    } catch {
      setMessage(adminContent.messages.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const deleteLead = async () => {
    if (!active || !window.confirm(adminContent.messages.deleteConfirm)) return;
    setMessage("");
    try {
      const response = await fetch(`/api/admin/submissions/${active.id}`, { method: "DELETE" });
      if (!response.ok) {
        setMessage(adminContent.messages.deleteFailed);
        return;
      }
      setSubmissions((items) => items.filter((item) => item.id !== active.id));
      setActiveId(null);
    } catch {
      setMessage(adminContent.messages.deleteFailed);
    }
  };

  const statusEntries = Object.entries(adminContent.statusLabels) as [LeadStatusValue, string][];
  const detailEntries = active ? [
    { label: adminContent.modal.details.name, value: active.name },
    { label: adminContent.modal.details.email, value: active.email },
    { label: adminContent.modal.details.phone, value: active.phone },
    { label: adminContent.modal.details.budget, value: active.budget },
    { label: adminContent.modal.details.services, value: active.services.join(adminContent.formatting.detailSeparator), full: true },
    { label: adminContent.modal.details.goal, value: active.goal },
    { label: adminContent.modal.details.timeline, value: active.timeline },
    { label: adminContent.modal.details.projectDetails, value: active.projectDetails, full: true }
  ] : [];

  return (
    <>
      <main className="admin-shell">
        <header className="admin-header">
          <Link className="admin-brand" href={siteContent.routes.home}>
            <Image {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} />
            <span className="admin-brand__divider" />
            <span className="admin-brand__name">{adminContent.header.brandName}</span>
          </Link>
          <div className="admin-header__actions">
            <button className="admin-btn" type="button" onClick={refresh}>{adminContent.header.refresh}</button>
            <button className="admin-btn" type="button" onClick={logout}>{adminContent.header.logout}</button>
            <Link className="admin-btn admin-btn--primary" href={siteContent.routes.home}>{adminContent.header.website}</Link>
          </div>
        </header>

        <section className="admin-hero">
          <div>
            <p className="admin-kicker">{adminContent.hero.kicker}</p>
            <h1>{adminContent.hero.heading.prefix}<span>{adminContent.hero.heading.accent}</span></h1>
          </div>
          <p>{adminContent.hero.description}</p>
        </section>

        <section className="admin-stats">
          <StatCard label={adminContent.stats.total} value={stats.total} />
          <StatCard label={adminContent.stats.new} value={stats.new} accent />
          <StatCard label={adminContent.stats.qualified} value={stats.qualified} />
          <StatCard label={adminContent.stats.month} value={stats.month} />
        </section>

        <section className="admin-controls">
          <input className="admin-input" type="search" placeholder={adminContent.controls.searchPlaceholder} value={search} onChange={(event) => setSearch(event.target.value)} />
          <select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value as LeadStatusValue | "ALL")}>
            <option value="ALL">{adminContent.controls.allStatuses}</option>
            {statusEntries.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
          <a className="admin-btn" href={submissions.length ? "/api/admin/submissions/export" : undefined} onClick={(event) => {
            if (!submissions.length) { event.preventDefault(); window.alert(adminContent.messages.noExport); }
          }}>{adminContent.controls.export}</a>
        </section>

        {message && <p className="admin-note" role="alert">{message}</p>}

        <section className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>{adminContent.tableHeadings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
            <tbody>
              {visible.map((lead) => (
                <tr key={lead.id}>
                  <td><div className="admin-lead-name">{lead.name}</div><div className="admin-lead-brand">{lead.brand}{adminContent.formatting.leadSeparator}{lead.email}</div></td>
                  <td>{lead.services.join(adminContent.formatting.itemSeparator) || adminContent.formatting.emptyValue}</td>
                  <td>{lead.budget || adminContent.formatting.emptyValue}</td>
                  <td>{dateLabel(lead.createdAt)}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td><div className="admin-row-actions"><button className="admin-row-btn" type="button" onClick={() => openLead(lead)}>{adminContent.actions.view}</button><a className="admin-row-btn" href={`mailto:${lead.email}`}>{adminContent.actions.email}</a></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="admin-mobile-list">
          {visible.map((lead) => (
            <article className="admin-lead-card" key={lead.id}>
              <div className="admin-lead-card__top"><div><div className="admin-lead-name">{lead.name}</div><div className="admin-lead-brand">{lead.brand}</div></div><StatusBadge status={lead.status} /></div>
              <div className="admin-lead-card__meta">
                <div><label>{adminContent.modal.details.budget}</label><span>{lead.budget || adminContent.formatting.emptyValue}</span></div>
                <div><label>{adminContent.tableHeadings[3]}</label><span>{dateLabel(lead.createdAt)}</span></div>
                <div><label>{adminContent.modal.details.services}</label><span>{lead.services.join(adminContent.formatting.itemSeparator) || adminContent.formatting.emptyValue}</span></div>
                <div><label>{adminContent.modal.details.contact}</label><span>{lead.phone || lead.email || adminContent.formatting.emptyValue}</span></div>
              </div>
              <div className="admin-row-actions"><button className="admin-row-btn" type="button" onClick={() => openLead(lead)}>{adminContent.actions.viewBrief}</button><a className="admin-row-btn" href={`mailto:${lead.email}`}>{adminContent.actions.email}</a></div>
            </article>
          ))}
        </section>

        <section className={`admin-empty${visible.length ? "" : " is-visible"}`}>
          <h2>{adminContent.empty.heading}</h2><p>{adminContent.empty.description}</p>
        </section>
      </main>

      <div className={`admin-modal${active ? " is-open" : ""}`} aria-hidden={!active}>
        <div className="admin-modal__backdrop" onClick={() => setActiveId(null)} />
        {active && <section className="admin-modal__panel" role="dialog" aria-modal="true" aria-labelledby="leadModalTitle">
          <div className="admin-modal__top">
            <div><div className="admin-modal__id">{active.publicId} / {dateLabel(active.createdAt)}</div><h2 id="leadModalTitle">{active.brand || adminContent.modal.fallbackTitle}</h2></div>
            <button className="admin-btn" type="button" onClick={() => setActiveId(null)}>{adminContent.actions.close}</button>
          </div>
          <div className="admin-detail-grid">
            {detailEntries.map((detail) => <div className={`admin-detail${detail.full ? " admin-detail--full" : ""}`} key={detail.label}><label>{detail.label}</label><div>{detail.value || adminContent.formatting.emptyValue}</div></div>)}
          </div>
          <div className="admin-modal__edit">
            <select className="admin-select" value={activeStatus} onChange={(event) => setActiveStatus(event.target.value as LeadStatusValue)}>
              {statusEntries.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
            <textarea className="admin-input" placeholder={adminContent.modal.notePlaceholder} value={activeNote} onChange={(event) => setActiveNote(event.target.value)} />
          </div>
          <div className="admin-header__actions admin-modal__actions">
            <button className="admin-btn admin-btn--danger" type="button" onClick={deleteLead}>{adminContent.actions.delete}</button>
            <button className="admin-btn admin-btn--primary" type="button" onClick={saveLead} disabled={saving}>{saving ? adminContent.actions.saving : adminContent.actions.save}</button>
          </div>
        </section>}
      </div>
    </>
  );
}
