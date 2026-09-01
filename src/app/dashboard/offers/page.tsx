import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { deleteOfferAction } from "./actions";
import { computeOfferStatus } from "@/lib/offerStatus";
import { formatMoney } from "@/lib/businessConfig";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  scheduled: "bg-amber-50 text-amber-700",
  expired: "bg-red-50 text-red-700",
};

export default async function OffersPage() {
  const { website } = await requireClientSession();
  const offers = await prisma.offer.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Offers</h1>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Status is computed from today&apos;s date — expired offers won&apos;t show on the live site.</p>
        </div>
        <Link href="/dashboard/offers/new" className="btn btn-accent">
          + Add Offer
        </Link>
      </div>

      {offers.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">No offers yet</p>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Create a limited-time offer — it&apos;ll show and hide itself automatically.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {offers.map((o) => {
            const status = computeOfferStatus(o);
            return (
              <div key={o.id} className={`flex flex-wrap items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] px-4 py-3 ${status === "expired" ? "opacity-50" : ""}`}>
                <div className="flex-1">
                  <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                    {o.name}{" "}
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>{status}</span>
                  </p>
                  <p className="text-xs text-[var(--gray-500)]">
                    {o.startDate ? new Date(o.startDate).toLocaleDateString(website.settings?.locale || "en-US") : "—"} → {o.endDate ? new Date(o.endDate).toLocaleDateString(website.settings?.locale || "en-US") : "—"}
                  </p>
                </div>
                {(o.originalPrice != null || o.offerPrice != null) && (
                  <p className="font-mono text-sm">
                    {o.offerPrice ? (
                      <><span className="mr-1 text-[var(--gray-400)] line-through">{formatMoney(o.originalPrice, website.settings)}</span>{formatMoney(o.offerPrice, website.settings)}</>
                    ) : (
                      <>{formatMoney(o.originalPrice, website.settings)}</>
                    )}
                  </p>
                )}
                <div className="flex gap-1.5">
                  <Link href={`/dashboard/offers/${o.id}/edit`} className="btn btn-secondary !px-2 !py-1 !text-xs">Edit</Link>
                  <form action={deleteOfferAction}>
                    <input type="hidden" name="id" value={o.id} />
                    <button type="submit" className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
