"use client";

import { useActionState } from "react";
import { bulkImportProductsAction } from "./actions";

export default function BulkForm() {
  const [state, formAction, pending] = useActionState(bulkImportProductsAction, undefined);

  return (
    <div className="mt-6 flex max-w-lg flex-col gap-4">
      <div className="card p-5">
        <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">Expected columns</p>
        <code className="mt-2 block overflow-x-auto rounded bg-[var(--gray-50)] p-2 text-xs">
          name, category, price, offerPrice, unit, sku, stockQty, shortDesc
        </code>
        <p className="mt-2 text-xs text-[var(--gray-500)]">
          Only <code>name</code> is required. A category that doesn&rsquo;t exist yet gets created automatically.
          Export your spreadsheet as CSV (File → Save As → CSV) before uploading — direct .xlsx isn&rsquo;t read yet.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3 rounded-xl border border-dashed border-[var(--gray-300)] bg-[var(--surface)] p-5">
        <input name="file" type="file" accept=".csv,text/csv" className="text-sm" />
        {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}
        {state?.result && (
          <div className="rounded-[var(--radius-md)] bg-[var(--success-50)] px-3 py-2 text-[13px] text-emerald-700">
            <p>✓ Added {state.result.added} product{state.result.added === 1 ? "" : "s"}.</p>
            {state.result.skipped.length > 0 && (
              <ul className="mt-1 list-disc pl-5 text-xs text-emerald-800">
                {state.result.skipped.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </div>
        )}
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Uploading…" : "Upload CSV"}
        </button>
      </form>
    </div>
  );
}
