"use client";

import { useActionState } from "react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { loginAction } from "./actions";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--surface-muted)] px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[380px] animate-rise-in">
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--gray-900)] text-[14px] font-bold text-[var(--background)]">
            A
          </span>
          <h1 className="text-[19px] font-semibold text-[var(--gray-900)]">Sign in to your console</h1>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Manage your website, orders, and offers</p>
        </div>

        <div className="card p-6">
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input id="email" name="email" type="email" required className="input" placeholder="you@business.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input id="password" name="password" type="password" required className="input" placeholder="••••••••" />
            </div>

            {state?.error && (
              <p className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                {state.error}
              </p>
            )}

            <button type="submit" disabled={pending} className="btn btn-primary mt-1 justify-center py-2.5">
              {pending ? "Signing in…" : "Sign in"}
              {!pending && <ArrowRight size={14} />}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
