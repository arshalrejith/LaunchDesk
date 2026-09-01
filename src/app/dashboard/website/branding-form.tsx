"use client";

import { useActionState, useState } from "react";
import { saveBrandingAction } from "./actions";

const DEFAULT_ACCENT = "#0F766E";
const DEFAULT_BG = "#FFFFFF";

function normalizeHex(v: string) {
  const s = v.trim();
  if (!s) return "";
  return s.startsWith("#") ? s : `#${s}`;
}

function ColorField({
  label, name, value, onChange, fallback,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; fallback: string;
}) {
  const swatch = /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
  return (
    <div className="flex-1">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--gray-200)] p-0.5"
          aria-label={`${label} picker`}
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(normalizeHex(e.target.value))}
          placeholder={fallback}
          className="w-28 rounded-lg border border-[var(--gray-300)] px-2.5 py-2 text-sm font-mono"
        />
      </div>
    </div>
  );
}

export default function BrandingForm({ initial }: { initial: { accentColor?: string | null; backgroundColor?: string | null } }) {
  const [state, formAction, pending] = useActionState(saveBrandingAction, undefined);
  const [accent, setAccent] = useState(initial.accentColor ?? "");
  const [bg, setBg] = useState(initial.backgroundColor ?? "");

  const previewAccent = /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : DEFAULT_ACCENT;
  const previewBg = /^#[0-9a-fA-F]{6}$/.test(bg) ? bg : DEFAULT_BG;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-[var(--gray-500)]">
        Sets the background and button/link color on your live site. Leave blank to keep the design&rsquo;s defaults.
      </p>
      <div className="flex flex-wrap gap-4">
        <ColorField label="Background" name="backgroundColor" value={bg} onChange={setBg} fallback={DEFAULT_BG} />
        <ColorField label="Accent (buttons &amp; links)" name="accentColor" value={accent} onChange={setAccent} fallback={DEFAULT_ACCENT} />
      </div>

      <div
        className="rounded-xl border border-[var(--gray-200)] p-4"
        style={{ background: previewBg }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: previewAccent }}>Preview</p>
        <p className="mt-1 text-sm text-[var(--gray-700)]">This is roughly how your site&rsquo;s colors will look.</p>
        <span
          className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ background: previewAccent }}
        >
          Sample Button
        </span>
      </div>

      {state?.error && <p className="text-sm font-semibold text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-emerald-700">✓ Colors saved</p>}
      <div>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Saving…" : "Save Colors"}
        </button>
      </div>
    </form>
  );
}
