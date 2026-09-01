"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createClientAction } from "./actions";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/lib/businessConfig";

export default function NewClientForm() {
  const [state, formAction, pending] = useActionState(createClientAction, undefined);

  if (state?.created) {
    const hasLogin = state.created.email && state.created.password;
    return (
      <div className="max-w-md rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-semibold text-emerald-900">
          {hasLogin ? "Client created — send them these details:" : "Client created."}
        </p>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div><dt className="inline font-semibold">Preview URL:</dt> <dd className="inline">/sites/{state.created.slug}</dd></div>
          {hasLogin && (
            <>
              <div><dt className="inline font-semibold">Dashboard:</dt> <dd className="inline">/login</dd></div>
              <div><dt className="inline font-semibold">Email:</dt> <dd className="inline">{state.created.email}</dd></div>
              <div><dt className="inline font-semibold">Temporary password:</dt> <dd className="inline font-mono">{state.created.password}</dd></div>
            </>
          )}
        </dl>
        {hasLogin ? (
          <p className="mt-3 text-xs text-emerald-700">This password is shown once — copy it now.</p>
        ) : (
          <p className="mt-3 text-xs text-emerald-700">
            No login yet — you can build their design previews now, and add a login later from their Manage page once you have an email to send it to.
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <Link href={`/admin/clients/${state.created.clientId}`} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
            Manage This Client
          </Link>
          <Link href="/admin" className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
            All Clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex max-w-lg flex-col gap-4">
      <Field name="businessName" label="Business Name" required />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-[var(--gray-700)]">Business Category</label>
        <select id="category" name="category" className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm">
          <option value="">Select…</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <Field name="tagline" label="Tagline" />
      <Field name="loginEmail" label="Client Login Email" type="email" hint="Leave blank if you don't have it yet — add it later once they've confirmed." />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="countryCode" className="text-sm font-medium text-[var(--gray-700)]">Country</label>
          <select id="countryCode" name="countryCode" defaultValue="IN" className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm">
            {COUNTRY_OPTIONS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className="text-sm font-medium text-[var(--gray-700)]">Currency</label>
          <select id="currency" name="currency" defaultValue="INR" className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm">
            {CURRENCY_OPTIONS.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="locale" label="Locale" defaultValue="en-IN" />
        <Field name="phoneCountryCode" label="Phone Country Code" defaultValue="+91" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="phone" label="Phone" />
        <Field name="whatsapp" label="WhatsApp" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field name="area" label="Area" />
        <Field name="city" label="City" />
      </div>
      <Field name="mapsUrl" label="Google Maps URL" />
      <Field name="hours" label="Business Hours" />
      <Field name="instagram" label="Instagram" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-[var(--gray-700)]">Description</label>
        <textarea id="description" name="description" rows={3} className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      </div>

      {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}

      <button type="submit" disabled={pending} className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
        {pending ? "Creating…" : "Create Client"}
      </button>
    </form>
  );
}

function Field({ name, label, required, type, hint, defaultValue }: { name: string; label: string; required?: boolean; type?: string; hint?: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-[var(--gray-700)]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input id={name} name={name} type={type ?? "text"} required={required} defaultValue={defaultValue} className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      {hint && <p className="text-xs text-[var(--gray-400)]">{hint}</p>}
    </div>
  );
}
