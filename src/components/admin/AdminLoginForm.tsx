"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { adminContent } from "@/content/admin";
import { siteContent } from "@/content/site";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        setError(response.status === 401 ? adminContent.login.invalidMessage : adminContent.login.unavailableMessage);
        return;
      }
      router.replace(siteContent.routes.admin);
      router.refresh();
    } catch {
      setError(adminContent.login.unavailableMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <Image className="admin-login__logo" {...siteContent.brand.logo} alt={siteContent.brand.logo.alt} priority />
        <h1>{adminContent.login.heading.prefix}<span>{adminContent.login.heading.accent}</span></h1>
        <p>{adminContent.login.description}</p>
        <label htmlFor="adminPassword">{adminContent.login.passwordLabel}</label>
        <input
          id="adminPassword"
          type="password"
          autoComplete="current-password"
          placeholder={adminContent.login.passwordPlaceholder}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoFocus
        />
        <button type="submit" disabled={submitting}>{submitting ? adminContent.login.submittingLabel : adminContent.login.submitLabel}</button>
        <p className="admin-login__error" role="alert">{error}</p>
      </form>
    </div>
  );
}
