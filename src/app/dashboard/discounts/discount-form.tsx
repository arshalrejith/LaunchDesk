"use client";

import { useActionState } from "react";
import { createDiscountAction } from "./actions";

export default function DiscountForm({ currencySymbol = "Currency" }: { currencySymbol?: string }) {
  const [state, formAction, pending] = useActionState(createDiscountAction, undefined);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs font-semibold text-[var(--gray-600)]">Name</label>
        <input id="name" name="name" placeholder="e.g. Loyalty Discount" required className="w-44 rounded-lg border border-[var(--gray-300)] px-2.5 py-1.5 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-xs font-semibold text-[var(--gray-600)]">Type</label>
        <select id="type" name="type" className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-2.5 py-1.5 text-sm">
          <option value="percent">% off</option>
          <option value="flat">{currencySymbol} off</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="value" className="text-xs font-semibold text-[var(--gray-600)]">Value</label>
        <input id="value" name="value" type="number" min="0.01" step="0.01" required className="w-24 rounded-lg border border-[var(--gray-300)] px-2.5 py-1.5 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="code" className="text-xs font-semibold text-[var(--gray-600)]">Code (optional)</label>
        <input id="code" name="code" placeholder="SAVE10" className="w-32 rounded-lg border border-[var(--gray-300)] px-2.5 py-1.5 text-sm uppercase" />
      </div>
      <button type="submit" disabled={pending} className="btn btn-accent">
        {pending ? "Adding…" : "Add Discount"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
      <p className="w-full text-xs text-[var(--gray-500)]">
        This shows as a promotional banner on your site — there&rsquo;s no checkout, so nothing is applied
        automatically. Customers see the code and mention it when they call, WhatsApp, or enquire.
      </p>
    </form>
  );
}
