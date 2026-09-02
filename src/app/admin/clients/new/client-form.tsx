"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createClientAction } from "./actions";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/lib/businessConfig";

export default function NewClientForm() {
  const [state, formAction, pending] = useActionState(
    createClientAction,
    undefined
  );

  if (state?.created) {
    const hasLogin = Boolean(
      state.created.email && state.created.password
    );

    const copyCredentials = async () => {
      if (!hasLogin) return;

      const text = [
        `Dashboard: /login`,
        `Email: ${state.created.email}`,
        `Temporary password: ${state.created.password}`,
      ].join("\n");

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard access can be unavailable in some browsers.
      }
    };

    return (
      <div className="max-w-md rounded-2xl border border-emerald-300 bg-emerald-50 p-5 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-950/40">
        <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
          {hasLogin
            ? "Client created — send them these details:"
            : "Client created."}
        </p>

        <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
          {hasLogin
            ? "Copy the login details below and send them securely to your client."
            : "The client record and website have been created successfully."}
        </p>

        <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <dl className="flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Preview URL
              </dt>
              <dd className="mt-1 break-all font-mono text-sm text-zinc-800 dark:text-zinc-200">
                /sites/{state.created.slug}
              </dd>
            </div>

            {hasLogin && (
              <>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Dashboard
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-cyan-700 dark:text-cyan-300">
                    /login
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Email
                  </dt>
                  <dd className="mt-1 break-all rounded-lg bg-zinc-100 px-3 py-2 font-mono text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white">
                    {state.created.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Temporary password
                  </dt>
                  <dd className="mt-1 break-all rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 font-mono text-sm font-bold text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-950/40 dark:text-yellow-200">
                    {state.created.password}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {hasLogin ? (
          <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-500/30 dark:bg-yellow-950/30">
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
              Important: this temporary password is shown only once.
            </p>
            <p className="mt-1 text-xs text-yellow-800 dark:text-yellow-300">
              Copy it now and send it securely to the client.
            </p>
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            No login yet — you can build their design previews now, and add a
            login later from their Manage page once you have an email to send
            it to.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/admin/clients/${state.created.clientId}`}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Manage This Client
          </Link>

          {hasLogin && (
            <button
              type="button"
              onClick={copyCredentials}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Copy Credentials
            </button>
          )}

          <Link
            href="/admin"
            className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold text-[var(--gray-700)] transition hover:bg-[var(--gray-50)] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
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
        <label
          htmlFor="category"
          className="text-sm font-medium text-[var(--gray-700)]"
        >
          Business Category
        </label>

        <select
          id="category"
          name="category"
          className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm"
        >
          <option value="">Select…</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Field name="tagline" label="Tagline" />

      <Field
        name="loginEmail"
        label="Client Login Email"
        type="email"
        hint="Leave blank if you don't have it yet — add it later once they've confirmed."
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="countryCode"
            className="text-sm font-medium text-[var(--gray-700)]"
          >
            Country
          </label>

          <select
            id="countryCode"
            name="countryCode"
            defaultValue="IN"
            className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="currency"
            className="text-sm font-medium text-[var(--gray-700)]"
          >
            Currency
          </label>

          <select
            id="currency"
            name="currency"
            defaultValue="INR"
            className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm"
          >
            {CURRENCY_OPTIONS.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field name="locale" label="Locale" defaultValue="en-IN" />
        <Field
          name="phoneCountryCode"
          label="Phone Country Code"
          defaultValue="+91"
        />
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
        <label
          htmlFor="description"
          className="text-sm font-medium text-[var(--gray-700)]"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={3}
          className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create Client"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  type,
  hint,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--gray-700)]"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type ?? "text"}
        required={required}
        defaultValue={defaultValue}
        className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm"
      />

      {hint && (
        <p className="text-xs text-[var(--gray-400)]">{hint}</p>
      )}
    </div>
  );
}
