import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  toggleClientStatusAction,
  setCustomDomainAction,
} from "./actions";
import DeleteClientButton from "./delete-client-button";

export default async function AdminPage() {
  const clients = await prisma.client.findMany({
    include: {
      website: {
        include: {
          settings: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--gray-900)]">
            All Clients
          </h1>

          <p className="mt-1 text-sm text-[var(--gray-500)]">
            {clients.length} client{clients.length === 1 ? "" : "s"} on the
            platform. Disable a client&apos;s account without deleting their
            data — their site stops resolving and they can&apos;t sign in
            until re-enabled.
          </p>
        </div>

        <Link
          href="/admin/clients/new"
          className="whitespace-nowrap rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + Add Client
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--gray-200)] bg-[var(--surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--gray-200)] text-left text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[var(--gray-100)] last:border-0"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clients/${c.id}`}
                    className="font-semibold text-[var(--gray-900)] hover:text-teal-700 hover:underline"
                  >
                    {c.website?.settings?.businessName ?? c.slug}
                  </Link>

                  <p className="text-xs text-[var(--gray-500)]">
                    {c.website?.settings?.category ?? "—"}
                  </p>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.status === "DISABLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    ● {c.status === "DISABLED" ? "Disabled" : "Active"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.website?.publishStatus === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {c.website?.publishStatus ?? "—"}
                  </span>

                  {c.website && !c.website.clientPublishEnabled && (
                    <span
                      className="ml-1 inline-flex rounded-full bg-[var(--gray-100)] px-2 py-0.5 text-xs font-semibold text-[var(--gray-500)]"
                      title="Client can't publish themselves yet"
                    >
                      <LockKeyhole size={12} strokeWidth={2} />
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {c.website && (
                    <form
                      action={setCustomDomainAction}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="hidden"
                        name="websiteId"
                        value={c.website.id}
                      />

                      <input
                        name="domain"
                        defaultValue={c.website.customDomain ?? ""}
                        placeholder="www.business.com"
                        className="w-36 rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs"
                      />

                      <button
                        type="submit"
                        className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs font-semibold hover:bg-[var(--gray-50)]"
                      >
                        Save
                      </button>
                    </form>
                  )}
                </td>

                <td className="px-4 py-3 text-[var(--gray-600)]">
                  {new Date(c.updatedAt).toLocaleString(
                    c.website?.settings?.locale || "en-US"
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs font-semibold hover:bg-[var(--gray-50)]"
                    >
                      Manage
                    </Link>

                    {c.website && (
                      <a
                        href={`/sites/${c.website.previewSlug}`}
                        target="_blank"
                        rel="noopener"
                        className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs font-semibold hover:bg-[var(--gray-50)]"
                      >
                        Open
                      </a>
                    )}

                    <form action={toggleClientStatusAction}>
                      <input type="hidden" name="id" value={c.id} />

                      <button
                        type="submit"
                        className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs font-semibold hover:bg-[var(--gray-50)]"
                      >
                        {c.status === "DISABLED" ? "Enable" : "Disable"}
                      </button>
                    </form>

                    <DeleteClientButton
                      clientId={c.id}
                      clientName={
                        c.website?.settings?.businessName ?? c.slug
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}