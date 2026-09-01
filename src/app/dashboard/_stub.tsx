import { Construction } from "lucide-react";

export function StubPage({ title, phase, blurb }: { title: string; phase: string; blurb: string }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">{title}</h1>
      <div className="mt-4 flex flex-col items-start gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-50)] text-indigo-600">
          <Construction size={16} />
        </span>
        <p className="text-[13px] font-semibold text-indigo-700">{phase}</p>
        <p className="text-[13.5px] leading-relaxed text-[var(--gray-500)]">{blurb}</p>
      </div>
    </div>
  );
}
