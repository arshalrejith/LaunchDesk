import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  toggleClientStatusAction,
  setCustomDomainAction,
  adminPublishAction,
  setClientPublishEnabledAction,
  setTemplateAdminAction,
} from "../../actions";
import CreateLoginForm from "./create-login-form";
import { TEMPLATES } from "@/lib/templates";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { website: { include: { settings: true } }, users: { where: { role: "CLIENT" } } },
  });
  if (!client || !client.website) notFound();

  const website = client.website;
  const [pendingCount, versionCount] = await Promise.all([
    prisma.changeLogEntry.count({ where: { websiteId: website.id } }),
    prisma.versionSnapshot.count({ where: { websiteId: website.id } }),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/admin" className="text-sm font-semibold text-teal-700 hover:underline">← All Clients</Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--gray-900)]">{website.settings?.businessName ?? client.slug}</h1>
          <p className="text-sm text-[var(--gray-500)]">{website.settings?.category ?? "—"}</p>
        </div>
        <div className="flex gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${client.status === "DISABLED" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            ● {client.status === "DISABLED" ? "Disabled" : "Active"}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${website.publishStatus === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {website.publishStatus}
          </span>
        </div>
      </div>

      {/* Design — settable before the client has any login at all */}
      <section className="mt-6 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--gray-900)]">Website Design</h2>
        <p className="mt-1 text-sm text-[var(--gray-500)]">Preview links show each design with this client&rsquo;s real content. Set which is active once they&rsquo;ve told you which they picked.</p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <div key={t.id} className={`rounded-lg border p-3 ${website.templateId === t.id ? "border-teal-600 ring-2 ring-teal-100" : "border-[var(--gray-200)]"}`}>
              <p className="text-sm font-semibold text-[var(--gray-900)]">{t.label}</p>
              <p className="mt-0.5 text-xs text-[var(--gray-500)]">{t.desc}</p>
              <div className="mt-2 flex items-center gap-2">
                {website.templateId === t.id ? (
                  <span className="text-xs font-semibold text-teal-700">✓ Active</span>
                ) : (
                  <form action={setTemplateAdminAction}>
                    <input type="hidden" name="websiteId" value={website.id} />
                    <input type="hidden" name="templateId" value={t.id} />
                    <button type="submit" className="text-xs font-semibold text-teal-700 hover:underline">Make Active</button>
                  </form>
                )}
                <a href={`/admin/clients/${client.id}/export?template=${t.id}&draft=1&inline=1`} target="_blank" rel="noopener" className="text-xs font-semibold text-[var(--gray-500)] hover:underline">Preview ↗</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publishing control — the payment gate */}
      <section className="mt-6 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--gray-900)]">Publishing</h2>
        <p className="mt-1 text-sm text-[var(--gray-500)]">
          {pendingCount > 0 ? `${pendingCount} unpublished change${pendingCount === 1 ? "" : "s"}.` : "No changes since last publish."}
          {" "}{versionCount} version{versionCount === 1 ? "" : "s"} published so far.
          {website.lastPublishedAt && ` Last: ${new Date(website.lastPublishedAt).toLocaleString(website.settings?.locale || "en-US")}.`}
        </p>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-[var(--gray-50)] px-3 py-2.5">
          <div>
            <p className="text-sm font-semibold text-[var(--gray-800)]">Client can publish themselves</p>
            <p className="text-xs text-[var(--gray-500)]">Turn on once payment is confirmed. Off by default for every new client.</p>
          </div>
          <form action={setClientPublishEnabledAction}>
            <input type="hidden" name="websiteId" value={website.id} />
            <button type="submit" className={`rounded-full px-3 py-1.5 text-xs font-semibold ${website.clientPublishEnabled ? "bg-emerald-600 text-white" : "bg-[var(--gray-200)] text-[var(--gray-600)]"}`}>
              {website.clientPublishEnabled ? "Enabled — turn off" : "Locked — turn on"}
            </button>
          </form>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <form action={adminPublishAction}>
            <input type="hidden" name="websiteId" value={website.id} />
            <button type="submit" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
              Publish Now {pendingCount > 0 ? `(${pendingCount})` : ""}
            </button>
          </form>
          <a href={`/sites/${website.previewSlug}`} target="_blank" rel="noopener" className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
            View Site ↗
          </a>
          {website.publishStatus === "PUBLISHED" && (
            <a href={`/admin/clients/${client.id}/export`} className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
              Download as File ⬇
            </a>
          )}
        </div>
        {website.publishStatus === "PUBLISHED" && (
          <p className="mt-2 text-xs text-[var(--gray-500)]">
            &ldquo;Download as File&rdquo; saves one portable .html file with photos built in — attach it directly to email or WhatsApp so the customer can open it without any link at all, even before the site has a real domain.
          </p>
        )}
        <p className="mt-2 text-xs text-[var(--gray-400)]">Full version history is visible from the client&rsquo;s own dashboard for now — an agency-side history view isn&rsquo;t built yet.</p>
      </section>

      {/* Client access */}
      <section className="mt-4 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--gray-900)]">Client Access</h2>
        {client.users[0] ? (
          <>
            <p className="mt-1 text-sm text-[var(--gray-500)]">
              Login: <code className="rounded bg-[var(--gray-100)] px-1.5 py-0.5">/login</code> as{" "}
              <code className="rounded bg-[var(--gray-100)] px-1.5 py-0.5">{client.users[0].email}</code>
            </p>
            <p className="mt-2 text-xs text-[var(--gray-400)]">Password was shown once, at creation — if lost, you&rsquo;ll need to reset it directly in the database for now (no reset flow built yet).</p>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-[var(--gray-500)]">No login yet. Add one once you know their email — typically once they&rsquo;ve confirmed a design and you&rsquo;re ready to hand off editing.</p>
            <div className="mt-3">
              <CreateLoginForm clientId={client.id} />
            </div>
          </>
        )}
        <form action={toggleClientStatusAction} className="mt-3">
          <input type="hidden" name="id" value={client.id} />
          <button type="submit" className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold text-[var(--gray-700)] hover:bg-[var(--gray-50)]">
            {client.status === "DISABLED" ? "Enable Account" : "Disable Account"}
          </button>
        </form>
      </section>

      {/* Domain */}
      <section className="mt-4 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--gray-900)]">Domain</h2>
        <p className="mt-1 text-sm text-[var(--gray-500)]">Preview: <code>/sites/{website.previewSlug}</code></p>
        <form action={setCustomDomainAction} className="mt-3 flex gap-2">
          <input type="hidden" name="websiteId" value={website.id} />
          <input name="domain" defaultValue={website.customDomain ?? ""} placeholder="www.business.com" className="flex-1 rounded-lg border border-[var(--gray-300)] px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg border border-[var(--gray-300)] px-4 py-2 text-sm font-semibold hover:bg-[var(--gray-50)]">Save</button>
        </form>
      </section>
    </div>
  );
}
