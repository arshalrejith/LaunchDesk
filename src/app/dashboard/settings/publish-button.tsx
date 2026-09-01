"use client";

import { useActionState } from "react";
import { publishAction } from "./actions";

export default function PublishButton({ isPublished, pendingCount }: { isPublished: boolean; pendingCount: number }) {
  const [state, formAction, pending] = useActionState(publishAction, undefined);

  return (
    <div>
      <form action={formAction}>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Publishing…" : isPublished ? "Republish" : "Publish Website"}{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </button>
      </form>
      {state?.error && (
        <p className="mt-2 rounded-[var(--radius-md)] bg-[var(--warning-50)] px-3 py-2 text-[13px] text-amber-800">{state.error}</p>
      )}
    </div>
  );
}
