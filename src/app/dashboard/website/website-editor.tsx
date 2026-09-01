"use client";

import { useState, useTransition } from "react";
import { SECTION_DEFS, CATEGORY_RECOMMENDATIONS, sectionNameFor } from "@/lib/constants";
import { TEMPLATES } from "@/lib/templates";
import { setTemplateAction, toggleSectionAction } from "./actions";

export default function WebsiteEditor({
  templateId,
  category,
  sections,
}: {
  templateId: string;
  category: string | null | undefined;
  sections: Record<string, boolean>;
}) {
  const [active, setActive] = useState(templateId);
  const [sectionState, setSectionState] = useState(sections);
  const [isPending, startTransition] = useTransition();
  const recommended = new Set(CATEGORY_RECOMMENDATIONS[category ?? ""] ?? CATEGORY_RECOMMENDATIONS["Other"]);

  function selectTemplate(id: string) {
    setActive(id);
    const fd = new FormData();
    fd.set("templateId", id);
    startTransition(() => setTemplateAction(fd));
  }

  function toggle(key: string, next: boolean) {
    setSectionState((s) => ({ ...s, [key]: next }));
    const fd = new FormData();
    fd.set("key", key);
    fd.set("enabled", String(next));
    startTransition(() => toggleSectionAction(fd));
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Choose the active design</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">Preview links show each design with your real, current content — even before you publish.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTemplate(t.id)}
              className={`rounded-xl border p-4 text-left transition ${
                active === t.id ? "border-indigo-600 ring-2 ring-indigo-100" : "border-[var(--gray-200)] hover:border-[var(--gray-300)]"
              }`}
            >
              <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">{t.label}</p>
              <p className="mt-1 text-xs text-[var(--gray-500)]">{t.desc}</p>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href={`/dashboard/export?template=${t.id}&draft=1&inline=1`}
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Open live preview ↗
                </a>
                {t.id === "custom-builder" && (
                  <a
                    href="/dashboard/builder"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Edit in Page Builder →
                  </a>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Sections on this website</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">
          {isPending ? "Saving…" : "Toggle what appears — recommended sections for this category are marked."}
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SECTION_DEFS.map((def) => (
            <label
              key={def.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--gray-200)] bg-[var(--surface)] px-3 py-2.5"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium text-[var(--gray-800)]">{sectionNameFor(category, def.key)}</span>
                <span className={`text-xs ${recommended.has(def.key) ? "text-indigo-600" : "text-[var(--gray-400)]"}`}>
                  {recommended.has(def.key) ? "Recommended for this category" : def.core ? "Core" : "Optional"}
                </span>
              </span>
              <input
                type="checkbox"
                checked={!!sectionState[def.key]}
                onChange={(e) => toggle(def.key, e.target.checked)}
                className="h-5 w-5 accent-indigo-600"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
