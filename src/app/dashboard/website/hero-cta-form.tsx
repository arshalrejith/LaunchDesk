"use client";

import { useActionState } from "react";
import CtaPicker from "@/components/cta-picker";
import { saveHeroCtasAction } from "./actions";

type Initial = {
  primaryCta?: string | null; primaryCtaType?: string | null; primaryCtaValue?: string | null;
  secondaryCta?: string | null; secondaryCtaType?: string | null; secondaryCtaValue?: string | null;
};

export default function HeroCtaForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState(saveHeroCtasAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">Primary Button</p>
        <CtaPicker
          namePrefix="primaryCta"
          labelPlaceholder="e.g. Order Now"
          initialLabel={initial.primaryCta}
          initialType={initial.primaryCtaType}
          initialValue={initial.primaryCtaValue}
        />
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">Secondary Button</p>
        <CtaPicker
          namePrefix="secondaryCta"
          labelPlaceholder="e.g. View Catalogue"
          initialLabel={initial.secondaryCta}
          initialType={initial.secondaryCtaType}
          initialValue={initial.secondaryCtaValue}
        />
      </div>
      {state?.ok && <p className="text-sm font-semibold text-emerald-700">✓ Changes saved</p>}
      <div>
        <button type="submit" disabled={pending} className="btn btn-accent">
          {pending ? "Saving…" : "Save Buttons"}
        </button>
      </div>
    </form>
  );
}
