"use client";

import { useActionState } from "react";
import { submitEnquiryAction } from "./actions";

export default function EnquiryForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiryAction.bind(null, slug), undefined);

  if (state?.ok) {
    return <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Thanks — we&rsquo;ll get back to you soon.</p>;
  }

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-3">
      {/* Honeypot — real visitors never see this field; left blank on genuine submissions. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input name="name" placeholder="Your name" className="rounded-lg border bg-[var(--site-bg)] px-3 py-2 text-sm" style={{ borderColor: "color-mix(in srgb, var(--site-ink) 20%, transparent)", color: "var(--site-ink)" }} />
      <input name="phone" placeholder="Phone number" className="rounded-lg border bg-[var(--site-bg)] px-3 py-2 text-sm" style={{ borderColor: "color-mix(in srgb, var(--site-ink) 20%, transparent)", color: "var(--site-ink)" }} />
      <textarea name="message" placeholder="What are you looking for?" rows={3} className="rounded-lg border bg-[var(--site-bg)] px-3 py-2 text-sm" style={{ borderColor: "color-mix(in srgb, var(--site-ink) 20%, transparent)", color: "var(--site-ink)" }} />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-[var(--site-accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
        {pending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
