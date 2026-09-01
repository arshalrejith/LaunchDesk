"use client";

import { useActionState, useState } from "react";
import { saveSeoAction } from "./actions";

type BusinessFacts = {
  businessName: string;
  category: string | null;
  area: string | null;
  city: string | null;
  signature: string | null;
  priceRange: string | null;
};

export default function SeoForm({
  seo,
  facts,
}: {
  seo: { title: string | null; metaDesc: string | null; keywords: string | null; serviceAreas: string | null; gbpUrl: string | null };
  facts: BusinessFacts;
}) {
  const [state, formAction, pending] = useActionState(saveSeoAction, undefined);
  const [title, setTitle] = useState(seo.title ?? "");
  const [metaDesc, setMetaDesc] = useState(seo.metaDesc ?? "");
  const [keywords, setKeywords] = useState(seo.keywords ?? "");
  const [serviceAreas, setServiceAreas] = useState(seo.serviceAreas ?? "");
  const [suggested, setSuggested] = useState<string | null>(null);

  const loc = [facts.area, facts.city].filter(Boolean).join(", ") || "your area";
  const categoryShort = (facts.category ?? "business").split(" / ")[0];

  function suggestAll() {
    setTitle(`${facts.businessName} — ${categoryShort} in ${loc}`);
    setMetaDesc(
      `${facts.signature ? facts.signature + ". " : ""}${facts.businessName} in ${loc}${facts.priceRange ? `, ${facts.priceRange}` : ""}. Call or WhatsApp to order.`
    );
    setKeywords([categoryShort, facts.area, facts.city, facts.businessName].filter(Boolean).join(", ").toLowerCase());
    setServiceAreas([facts.area, facts.city].filter(Boolean).join(", "));
    setSuggested("These are heuristic drafts built from your business details — review and edit before saving.");
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex justify-end">
        <button type="button" onClick={suggestAll} className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
          Suggest All with AI
        </button>
      </div>
      {suggested && <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-700">{suggested}</p>}

      <Field label="SEO Title" name="title" value={title} onChange={setTitle} />
      <TextAreaField label="Meta Description" name="metaDesc" value={metaDesc} onChange={setMetaDesc} />
      <Field label="Main Keywords" name="keywords" value={keywords} onChange={setKeywords} />
      <Field label="Service Areas" name="serviceAreas" value={serviceAreas} onChange={setServiceAreas} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="gbpUrl" className="label">Google Business Profile URL <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span></label>
        <input id="gbpUrl" name="gbpUrl" defaultValue={seo.gbpUrl ?? ""} className="input" />
      </div>

      {state?.ok && <p className="rounded-[var(--radius-md)] bg-[var(--success-50)] px-3 py-2 text-[13px] text-emerald-700">✓ Changes saved</p>}

      <div>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Saving…" : "Save SEO Settings"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="label">
        {label} <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span>
      </label>
      <input id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)}
        className="input" />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="label">
        {label} <span className="text-[11px] font-normal text-[var(--gray-400)]">optional</span>
      </label>
      <textarea id={name} name={name} rows={2} value={value} onChange={(e) => onChange(e.target.value)}
        className="input" />
    </div>
  );
}
