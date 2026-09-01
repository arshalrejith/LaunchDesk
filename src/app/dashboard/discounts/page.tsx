import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { toggleDiscountAction, deleteDiscountAction } from "./actions";
import DiscountForm from "./discount-form";
import { currencySymbol, formatMoney } from "@/lib/businessConfig";

export default async function DiscountsPage() {
  const { website } = await requireClientSession();
  const discounts = await prisma.discount.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Discounts</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        Reward-style discounts (no start/end date, unlike Offers) — active ones show as a small banner on your site.
      </p>

      <div className="mt-6">
        <DiscountForm currencySymbol={currencySymbol(website.settings?.currency, website.settings?.locale)} />
      </div>

      {discounts.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--gray-500)]">No discounts yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {discounts.map((d) => (
            <div key={d.id} className={`flex items-center justify-between gap-3 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] px-4 py-3 ${!d.active ? "opacity-50" : ""}`}>
              <div>
                <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                  {d.name} — {d.type === "percent" ? `${d.value}% off` : `${formatMoney(d.value, website.settings)} off`}
                  {d.code && <span className="ml-2 rounded bg-[var(--gray-100)] px-1.5 py-0.5 font-mono text-xs">{d.code}</span>}
                </p>
              </div>
              <div className="flex gap-1.5">
                <form action={toggleDiscountAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className="btn btn-secondary !px-2.5 !py-1 !text-xs">
                    {d.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={deleteDiscountAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button type="submit" className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
