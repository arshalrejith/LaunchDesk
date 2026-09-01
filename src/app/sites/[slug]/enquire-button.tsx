"use client";

import { useActionState } from "react";
import { submitEnquiryAction } from "./actions";

export default function EnquireButton({ slug, productName }: { slug: string; productName: string }) {
  const [state, formAction, pending] = useActionState(submitEnquiryAction.bind(null, slug), undefined);

  if (state?.ok) {
    return <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Sent ✓</span>;
  }

  return (
    <form action={formAction}>
      {/* Honeypot — real visitors never see this field; left blank on genuine submissions. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input type="hidden" name="message" value={`Enquiry about ${productName}`} />
      <button type="submit" disabled={pending} className="rounded-full border border-[color-mix(in_srgb,var(--site-ink)_20%,transparent)] px-3 py-1.5 text-xs font-semibold text-[var(--site-ink)] hover:bg-[color-mix(in_srgb,var(--site-accent)_8%,transparent)] disabled:opacity-60">
        {pending ? "Sending…" : "Enquire"}
      </button>
    </form>
  );
}
