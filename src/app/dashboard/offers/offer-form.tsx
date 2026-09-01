"use client";

import { useActionState } from "react";
import Link from "next/link";
import CtaPicker from "@/components/cta-picker";

type Initial = {
  id?: string;
  name?: string;
  description?: string | null;
  originalPrice?: number | null;
  offerPrice?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  cta?: string | null;
  ctaType?: string | null;
  ctaValue?: string | null;
  imageUrl?: string | null;
};

export default function OfferForm({
  action,
  initial,
  submitLabel,
  currencySymbol = "Currency",
}: {
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
  initial?: Initial;
  submitLabel: string;
  currencySymbol?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 flex max-w-lg flex-col gap-4">
      {initial?.id && <input type="hidden" name="id" defaultValue={initial.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="label">Offer Name <span className="text-red-600">*</span></label>
        <input id="name" name="name" required defaultValue={initial?.name}
          className="input" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="label">Description <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
        <textarea id="description" name="description" rows={2} defaultValue={initial?.description ?? ""}
          className="input" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="originalPrice" className="label">Original Price ({currencySymbol})</label>
          <input id="originalPrice" name="originalPrice" type="number" step="0.01" defaultValue={initial?.originalPrice ?? ""}
            className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="offerPrice" className="label">Offer Price ({currencySymbol})</label>
          <input id="offerPrice" name="offerPrice" type="number" step="0.01" defaultValue={initial?.offerPrice ?? ""}
            className="input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="label">Start Date <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="startDate" name="startDate" type="date" defaultValue={initial?.startDate ?? ""}
            className="input" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="label">End Date <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
          <input id="endDate" name="endDate" type="date" defaultValue={initial?.endDate ?? ""}
            className="input" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="label">Button <span className="text-[11px] font-normal text-[var(--gray-400)]">optional — leave blank for no button</span></label>
        <CtaPicker
          namePrefix="cta"
          labelPlaceholder="e.g. Order Now"
          initialLabel={initial?.cta}
          initialType={initial?.ctaType}
          initialValue={initial?.ctaValue}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="label">Offer Image <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
        {initial?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.imageUrl} alt="" className="h-20 w-20 rounded-lg border border-[var(--gray-200)] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
      </div>

      {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={pending}
          className="btn btn-accent">
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/dashboard/offers" className="btn btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}
