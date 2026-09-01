import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";

const DAYS = 14;

export default async function AnalyticsPage() {
  const { website } = await requireClientSession();
  const since = new Date();
  since.setDate(since.getDate() - (DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [enquiries, totalProducts, totalCategories, handledCount, totalEnquiries] = await Promise.all([
    prisma.enquiry.findMany({ where: { websiteId: website.id, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.product.count({ where: { websiteId: website.id } }),
    prisma.category.count({ where: { websiteId: website.id } }),
    prisma.enquiry.count({ where: { websiteId: website.id, handled: true } }),
    prisma.enquiry.count({ where: { websiteId: website.id } }),
  ]);

  const buckets: { date: string; label: string; count: number }[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.push({ date: d.toDateString(), label: d.toLocaleDateString(website.settings?.locale || "en-US", { day: "numeric", month: "short" }), count: 0 });
  }
  for (const e of enquiries) {
    const key = new Date(e.createdAt).toDateString();
    const bucket = buckets.find((b) => b.date === key);
    if (bucket) bucket.count += 1;
  }
  const max = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="max-w-3xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Analytics</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        Built from what we actually track — enquiries, products and categories. No Sales/Orders here since this
        platform is enquiry-and-catalogue-led, not a checkout system, so those numbers would be invented.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Enquiries (all time)" value={totalEnquiries} />
        <Stat label="Handled" value={`${handledCount} / ${totalEnquiries}`} />
        <Stat label="Products" value={totalProducts} />
        <Stat label="Categories" value={totalCategories} />
      </div>

      <div className="mt-6 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Enquiries, last {DAYS} days</h2>
        <div className="mt-4 flex items-end gap-1.5" style={{ height: 140 }}>
          {buckets.map((b) => (
            <div key={b.date} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${b.label}: ${b.count}`}>
              <div
                className="w-full rounded-t bg-indigo-600"
                style={{ height: `${Math.max(4, (b.count / max) * 110)}px` }}
              />
              <span className="text-[10px] text-[var(--gray-400)]">{b.label.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--gray-500)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--gray-900)]">{value}</p>
    </div>
  );
}
