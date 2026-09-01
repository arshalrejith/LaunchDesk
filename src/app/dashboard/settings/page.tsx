import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { unpublishAction } from "./actions";
import PublishButton from "./publish-button";

export default async function SettingsPage() {
  const { website, client } = await requireClientSession();
  const isPublished = website.publishStatus === "PUBLISHED";
  const pendingCount = await prisma.changeLogEntry.count({ where: { websiteId: website.id } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Settings</h1>

      <section className="mt-6 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Publishing</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">
          Status: <span className={isPublished ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
            ● {isPublished ? "Published" : website.publishStatus === "UNPUBLISHED" ? "Unpublished" : "Draft"}
          </span>
          {website.lastPublishedAt && ` · Last published ${new Date(website.lastPublishedAt).toLocaleString(website.settings?.locale || "en-US")}`}
        </p>
        <p className="mt-2 text-sm text-[var(--gray-500)]">
          {pendingCount > 0
            ? `${pendingCount} change${pendingCount === 1 ? "" : "s"} saved as a draft, not live yet.`
            : "No changes since the last publish."}{" "}
          <Link href="/dashboard/history" className="font-semibold text-indigo-600 hover:underline">View history</Link>
        </p>

        {!website.clientPublishEnabled && (
          <p className="mt-3 rounded-[var(--radius-md)] bg-[var(--warning-50)] px-3 py-2 text-[13px] text-amber-800">
            <span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} /> Publishing is locked on your account. You can keep editing and previewing — contact your agency to go live.</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-start gap-2">
          <PublishButton isPublished={isPublished} pendingCount={pendingCount} />
          {isPublished && (
            <form action={unpublishAction}>
              <button type="submit" className="btn btn-secondary">
                Unpublish
              </button>
            </form>
          )}
          <a href={`/sites/${website.previewSlug}`} target="_blank" rel="noopener"
            className="btn btn-secondary">
            View Website ↗
          </a>
          {isPublished && (
            <a href="/dashboard/export"
              className="btn btn-secondary">
              Download as File ⬇
            </a>
          )}
        </div>
        {isPublished && (
          <p className="mt-2 text-xs text-[var(--gray-500)]">
            Saves one file with your photos built in — attach it to email or WhatsApp so anyone can open it directly, no link or internet connection to a website needed.
          </p>
        )}
      </section>

      <section className="mt-4 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Domain</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">Preview URL: <code>/sites/{website.previewSlug}</code></p>
        <div className="mt-3 flex flex-col gap-1.5">
          <label className="label">Custom Domain</label>
          {website.customDomain ? (
            <p className="text-sm text-[var(--gray-800)]">
              <code className="rounded bg-[var(--gray-100)] px-2 py-1">{website.customDomain}</code>{" "}
              <span className="text-emerald-700">— connected</span>
            </p>
          ) : (
            <p className="text-sm text-[var(--gray-500)]">Not connected yet.</p>
          )}
          <p className="text-xs text-[var(--gray-400)]">Your agency connects and manages this for you — you don&rsquo;t need to touch DNS.</p>
        </div>
      </section>

      <section className="mt-4 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Account</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">Client ID: <code className="text-xs">{client.id}</code></p>
      </section>
    </div>
  );
}
