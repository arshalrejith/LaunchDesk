"use client";

import { useActionState } from "react";
import { updateBusinessAction } from "./actions";
import { COUNTRY_OPTIONS, CURRENCY_OPTIONS } from "@/lib/businessConfig";

type SettingsShape = {
  businessName?: string | null;
  tagline?: string | null;
  category?: string | null;
  description?: string | null;
  address?: string | null;
  area?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  mapsUrl?: string | null;
  hours?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  countryCode?: string | null;
  currency?: string | null;
  locale?: string | null;
  phoneCountryCode?: string | null;
} | null;

const TEXT_FIELDS: { name: string; label: string; opt?: boolean; span2?: boolean }[] = [
  { name: "tagline", label: "Tagline", opt: true },
  { name: "phone", label: "Phone Number" },
  { name: "whatsapp", label: "WhatsApp Number", opt: true },
  { name: "email", label: "Email", opt: true },
  { name: "hours", label: "Business Hours", opt: true },
  { name: "address", label: "Address", opt: true, span2: true },
  { name: "area", label: "Area" },
  { name: "city", label: "City" },
  { name: "state", label: "State", opt: true },
  { name: "pincode", label: "Pincode", opt: true },
  { name: "mapsUrl", label: "Google Maps URL", opt: true, span2: true },
  { name: "instagram", label: "Instagram", opt: true },
  { name: "facebook", label: "Facebook", opt: true },
];

export default function BusinessForm({ settings, categories }: { settings: SettingsShape; categories: string[] }) {
  const [state, formAction, pending] = useActionState(updateBusinessAction, undefined);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field name="businessName" label="Business Name" required defaultValue={settings?.businessName} span2 />
        <SelectField name="category" label="Business Category" required defaultValue={settings?.category} options={categories} />
        <SelectField name="countryCode" label="Country" defaultValue={settings?.countryCode ?? "IN"} options={COUNTRY_OPTIONS.map((c) => c.code)} optionLabels={Object.fromEntries(COUNTRY_OPTIONS.map((c) => [c.code, c.name]))} />
        <SelectField name="currency" label="Currency" defaultValue={settings?.currency ?? "INR"} options={CURRENCY_OPTIONS.map(([code]) => code)} optionLabels={Object.fromEntries(CURRENCY_OPTIONS)} />
        <Field name="locale" label="Locale" defaultValue={settings?.locale ?? "en-IN"} />
        <Field name="phoneCountryCode" label="Phone Country Code" defaultValue={settings?.phoneCountryCode ?? "+91"} />
        {TEXT_FIELDS.map((f) => (
          <Field key={f.name} name={f.name} label={f.label} opt={f.opt} span2={f.span2} defaultValue={String(settings?.[f.name as keyof NonNullable<SettingsShape>] ?? "")} />
        ))}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="label">
            Business Description <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span>
          </label>
          <textarea
            name="description"
            defaultValue={settings?.description ?? ""}
            rows={3}
            className="input"
          />
        </div>
      </div>

      {state?.error && <p className="rounded-[var(--radius-md)] bg-[var(--danger-50)] px-3 py-2 text-[13px] text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-[var(--radius-md)] bg-[var(--success-50)] px-3 py-2 text-[13px] text-emerald-700">✓ Changes saved</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-accent"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  opt,
  span2,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  opt?: boolean;
  span2?: boolean;
  defaultValue?: string | null;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${span2 ? "sm:col-span-2" : ""}`}>
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-600">*</span>}
        {opt && <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="input"
      />
    </div>
  );
}

function SelectField({
  name,
  label,
  required,
  defaultValue,
  options,
  optionLabels,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | null;
  options: string[];
  optionLabels?: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="label">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {optionLabels?.[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}
