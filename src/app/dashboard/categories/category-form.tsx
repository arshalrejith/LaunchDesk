"use client";

import { useActionState } from "react";
import Link from "next/link";

export default function CategoryForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: { error?: string } | undefined, formData: FormData) => Promise<{ error?: string } | undefined>;
  initial?: { id?: string; name?: string; description?: string | null; imageUrl?: string | null };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-6 flex max-w-lg flex-col gap-4">
      {initial?.id && <input type="hidden" name="id" defaultValue={initial.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="label">
          Category Name <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name}
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="label">
          Description <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className="input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="label">
          Category Image <span className="text-[11px] font-normal text-[var(--gray-400)]">optional — JPG, PNG or WEBP, under 10MB</span>
        </label>
        {initial?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={initial.imageUrl} alt="" className="h-20 w-20 rounded-lg border border-[var(--gray-200)] object-cover" />
        )}
        <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm" />
      </div>

      {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-accent"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link
          href="/dashboard/categories"
          className="btn btn-secondary"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
