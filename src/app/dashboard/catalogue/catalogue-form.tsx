"use client";

import { useActionState } from "react";
import { saveCatalogueAction } from "./actions";

type Category = { id: string; name: string; productCount: number };

export default function CatalogueForm({
  catalogue,
  categories,
}: {
  catalogue: { title: string | null; description: string | null; showPrices: boolean; showDescriptions: boolean; showWhatsapp: boolean; showEnquiry: boolean; categoryIds: string[] };
  categories: Category[];
}) {
  const [state, formAction, pending] = useActionState(saveCatalogueAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Catalogue details</h2>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="label">Catalogue Title</label>
            <input id="title" name="title" defaultValue={catalogue.title ?? ""} placeholder="e.g. Ambika Sarees — New Arrivals"
              className="input" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="label">Description</label>
            <textarea id="description" name="description" rows={2} defaultValue={catalogue.description ?? ""}
              className="input" />
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Categories to include</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">Order follows the order set on the Categories page.</p>
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--gray-500)]">Add categories first — the catalogue is built from them.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--gray-200)] px-3 py-2.5">
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-[var(--gray-800)]">{c.name}</span>
                  <span className="text-xs text-[var(--gray-400)]">{c.productCount} product{c.productCount === 1 ? "" : "s"}</span>
                </span>
                <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={catalogue.categoryIds.includes(c.id)} className="h-5 w-5 accent-indigo-600" />
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Display options</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 label">
            <input type="checkbox" name="showPrices" defaultChecked={catalogue.showPrices} className="h-4 w-4 accent-indigo-600" /> Show prices
          </label>
          <label className="flex items-center gap-2 label">
            <input type="checkbox" name="showDescriptions" defaultChecked={catalogue.showDescriptions} className="h-4 w-4 accent-indigo-600" /> Show descriptions
          </label>
          <label className="flex items-center gap-2 label">
            <input type="checkbox" name="showWhatsapp" defaultChecked={catalogue.showWhatsapp} className="h-4 w-4 accent-indigo-600" /> Show WhatsApp button
          </label>
          <label className="flex items-center gap-2 label">
            <input type="checkbox" name="showEnquiry" defaultChecked={catalogue.showEnquiry} className="h-4 w-4 accent-indigo-600" /> Show enquiry button
          </label>
        </div>
      </div>

      {state?.ok && <p className="rounded-[var(--radius-md)] bg-[var(--success-50)] px-3 py-2 text-[13px] text-emerald-700">✓ Changes saved</p>}

      <div>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Saving…" : "Save Catalogue Settings"}
        </button>
      </div>
    </form>
  );
}
