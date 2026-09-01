"use client";

import { useActionState, useEffect, useRef } from "react";
import { addGalleryImagesAction } from "./actions";

export default function GalleryUploadForm() {
  const [state, formAction, pending] = useActionState(addGalleryImagesAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // useActionState re-runs the action in place (no full navigation), so the
  // file input never gets a fresh DOM node on its own — reset it manually
  // once an upload succeeds, or the previously-picked files stay shown.
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-[var(--gray-300)] bg-[var(--surface)] p-5"
    >
      <div>
        <label htmlFor="images" className="text-[13.5px] font-semibold text-[var(--gray-800)]">
          Upload Images
        </label>
        <p className="text-xs text-[var(--gray-500)]">JPG, PNG or WEBP, up to 10MB each. Select multiple at once.</p>
      </div>
      <input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="text-sm" />
      {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-emerald-700">✓ Uploaded</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-accent"
        >
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
