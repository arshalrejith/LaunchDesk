"use client";

import { useActionState } from "react";
import Link from "next/link";

type Initial = {
  id?: string;
  name?: string;
  categoryId?: string | null;
  shortDesc?: string | null;
  fullDesc?: string | null;
  price?: number | null;
  offerPrice?: number | null;
  unit?: string | null;
  sku?: string | null;
  tags?: string[];
  stockQty?: number | null;
  available?: boolean;
  featured?: boolean;
  imageUrl?: string | null;
};

export default function ProductForm({
  action,
  initial,
  categories,
  submitLabel,
  currencySymbol = "Currency",
  itemLabel = "Product",
}: {
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
  initial?: Initial;
  categories: { id: string; name: string }[];
  submitLabel: string;
  currencySymbol?: string;
  itemLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 flex max-w-xl flex-col gap-4">
      {initial?.id && <input type="hidden" name="id" defaultValue={initial.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="label">
          {itemLabel} Name <span className="text-red-600">*</span>
        </label>
        <input id="name" name="name" required defaultValue={initial?.name}
          className="input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="categoryId" className="label">Category <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""}
            className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100">
            <option value="">Uncategorised</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="unit" className="label">Unit <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="unit" name="unit" placeholder="e.g. per piece" defaultValue={initial?.unit ?? ""}
            className="input" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="stockQty" className="label">Stock Quantity <span className="text-[11px] font-normal text-[var(--gray-400)]">optional — leave blank if you don&apos;t track counts</span></label>
        <input id="stockQty" name="stockQty" type="number" min="0" step="1" defaultValue={initial?.stockQty ?? ""}
          className="w-40 input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="label">Price ({currencySymbol}) <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="price" name="price" type="number" step="0.01" defaultValue={initial?.price ?? ""}
            className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="offerPrice" className="label">Offer Price ({currencySymbol}) <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="offerPrice" name="offerPrice" type="number" step="0.01" defaultValue={initial?.offerPrice ?? ""}
            className="input" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="shortDesc" className="label">Short Description <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
        <input id="shortDesc" name="shortDesc" defaultValue={initial?.shortDesc ?? ""}
          className="input" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullDesc" className="label">Full Description <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
        <textarea id="fullDesc" name="fullDesc" rows={3} defaultValue={initial?.fullDesc ?? ""}
          className="input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sku" className="label">SKU <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="sku" name="sku" defaultValue={initial?.sku ?? ""}
            className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="tags" className="label">Tags <span className="text-[11px] font-normal text-[var(--gray-400)]">comma separated, optional</span></label>
          <input id="tags" name="tags" defaultValue={initial?.tags?.join(", ") ?? ""}
            className="input" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="label">
          {itemLabel} Image <span className="text-[11px] font-normal text-[var(--gray-400)]">optional — JPG, PNG or WEBP, under 10MB</span>
        </label>
        {initial?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.imageUrl} alt="" className="h-20 w-20 rounded-lg border border-[var(--gray-200)] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 label">
          <input type="checkbox" name="available" defaultChecked={initial?.available ?? true} className="h-4 w-4 accent-indigo-600" />
          In stock
        </label>
        <label className="flex items-center gap-2 label">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="h-4 w-4 accent-indigo-600" />
          Featured product
        </label>
      </div>

      {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="btn btn-accent">
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/dashboard/products" className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
