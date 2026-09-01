import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { restoreVersionAction } from "./actions";

export default async function HistoryPage() {
  const { website } = await requireClientSession();
  const [pending, versions] = await Promise.all([
    prisma.changeLogEntry.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "asc" } }),
    prisma.versionSnapshot.findMany({ where: { websiteId: website.id }, orderBy: { number: "desc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">History</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        {website.clientPublishEnabled
          ? "Every Publish creates a version. Restore rolls the live site back to that point."
          : "Every Publish creates a version. Publishing is currently locked on your account, so Restore will bring the content back but won't make it live — contact your agency to enable publishing."}
      </p>

      {pending.length > 0 && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">Since last publish</h2>
          <p className="mt-1 text-xs text-amber-700">Saved as a draft, not live yet.</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-900">
            {pending.map((p) => (
              <li key={p.id}>{p.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {versions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--gray-300)] bg-[var(--surface)] p-8 text-center">
            <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">No published versions yet</p>
            <p className="mt-1 text-[13px] text-[var(--gray-500)]">Publish the website once to start version history.</p>
          </div>
        ) : (
          versions.map((v) => {
            const summary: string[] = JSON.parse(v.summary);
            const isCurrent = website.currentVersionId === v.id;
            return (
              <div key={v.id} className={`rounded-xl border bg-[var(--surface)] p-4 ${isCurrent ? "border-indigo-300 ring-1 ring-indigo-100" : "border-[var(--gray-200)]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                      {v.label} {isCurrent && <span className="ml-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">Live now</span>}
                    </p>
                    <p className="text-xs text-[var(--gray-500)]">{new Date(v.createdAt).toLocaleString(website.settings?.locale || "en-US")}</p>
                  </div>
                  {!isCurrent && (
                    <form action={restoreVersionAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button type="submit" className="btn btn-secondary !px-2.5 !py-1 !text-xs">
                        Restore
                      </button>
                    </form>
                  )}
                </div>
                <ul className="mt-2 list-disc pl-5 text-sm text-[var(--gray-600)]">
                  {summary.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
