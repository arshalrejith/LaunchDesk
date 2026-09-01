"use client";

import { useState } from "react";
import { LINK_TYPES, SCROLL_SECTIONS } from "@/lib/linkTargets";

type Props = {
  namePrefix: string; // form field names become `${namePrefix}Label`, `${namePrefix}Type`, `${namePrefix}Value`
  labelPlaceholder: string;
  initialLabel?: string | null;
  initialType?: string | null;
  initialValue?: string | null;
};

/** One (button label, destination type, destination value) triple. The same
 * picker drives the homepage CTAs and each Offer's button, so a client only
 * has to learn this once. */
export default function CtaPicker({ namePrefix, labelPlaceholder, initialLabel, initialType, initialValue }: Props) {
  const [type, setType] = useState<string>(initialType || "");

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      <input
        name={`${namePrefix}Label`}
        defaultValue={initialLabel ?? ""}
        placeholder={labelPlaceholder}
        className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
      />
      <select
        name={`${namePrefix}Type`}
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
      >
        <option value="">Links to…</option>
        {LINK_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {type === "scroll" ? (
        <select name={`${namePrefix}Value`} defaultValue={initialValue ?? ""} className="rounded-lg border border-[var(--gray-300)] bg-[var(--surface)] px-3 py-2 text-sm">
          <option value="">Which section…</option>
          {SCROLL_SECTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      ) : type === "url" ? (
        <input name={`${namePrefix}Value`} defaultValue={initialValue ?? ""} placeholder="https://…" className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      ) : type === "whatsapp" ? (
        <input name={`${namePrefix}Value`} defaultValue={initialValue ?? ""} placeholder="Pre-filled message (optional)" className="rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
      ) : (
        <input name={`${namePrefix}Value`} defaultValue={initialValue ?? ""} type="hidden" />
      )}
    </div>
  );
}
