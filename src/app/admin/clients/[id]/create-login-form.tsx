"use client";

import { useActionState } from "react";
import { createClientLoginAction } from "../../actions";

export default function CreateLoginForm({ clientId }: { clientId: string }) {
  const [state, formAction, pending] = useActionState(createClientLoginAction, undefined);

  if (state?.created) {
    return (
      <div className="rounded-lg bg-emerald-50 p-3 text-sm">
        <p className="font-semibold text-emerald-900">Login created — send them these details:</p>
        <p className="mt-1 text-emerald-800">
          <code className="rounded bg-[var(--surface)] px-1.5 py-0.5">/login</code> — email <code className="rounded bg-[var(--surface)] px-1.5 py-0.5">{state.created.email}</code>,
          password <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono">{state.created.password}</code>
        </p>
        <p className="mt-1 text-xs text-emerald-700">Shown once — copy it now. Reload this page and it&rsquo;ll be gone.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="clientId" value={clientId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="loginEmail" className="text-xs font-semibold text-[var(--gray-600)]">Their email</label>
        <input id="loginEmail" name="email" type="email" placeholder="owner@business.com" required
          className="w-56 rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
        {pending ? "Creating…" : "Create Login"}
      </button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
