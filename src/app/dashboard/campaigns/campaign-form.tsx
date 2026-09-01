"use client";

import { useActionState } from "react";
import { createCampaignAction } from "./actions";

export default function CampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaignAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4">
      <input name="title" placeholder="Campaign title, e.g. Diwali Offer" required className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      <textarea name="message" placeholder="Message to send, e.g. Diwali sale is on — 15% off this week!" rows={3} required className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Creating…" : "Create Campaign"}
        </button>
      </div>
    </form>
  );
}
