import Link from "next/link";
import { ArrowUpRight, Check, Circle, ExternalLink } from "lucide-react";
import { requireClientSession } from "@/lib/scope";
import { prisma } from "@/lib/prisma";
import { terminology } from "@/lib/businessConfig";



export default async function DashboardHome() {
  const { website } = await requireClientSession();
  const t = terminology(website.settings?.category);
  const quickActions = [
    { href: "/dashboard/website", label: "Edit website design" },
    { href: "/dashboard/products", label: t.add },
    { href: "/dashboard/categories", label: `Manage ${t.category.toLowerCase()}` },
    { href: "/dashboard/business", label: "Edit business details" },
    { href: "/dashboard/offers", label: "Manage offers" },
  ];

  const [productCount, categoryCount, galleryCount] = await Promise.all([
    prisma.product.count({ where: { websiteId: website.id } }),
    prisma.category.count({ where: { websiteId: website.id } }),
    prisma.galleryImage.count({ where: { websiteId: website.id } }),
  ]);

  const published = website.publishStatus === "PUBLISHED";
  const steps = [
    { label: "Business details", done: !!(website.settings?.phone || website.settings?.whatsapp), href: "/dashboard/business" },
    { label: t.category, done: categoryCount > 0, href: "/dashboard/categories" },
    { label: t.items, done: productCount > 0, href: "/dashboard/products" },
    { label: "Gallery", done: galleryCount > 0, href: "/dashboard/gallery" },
    { label: "SEO", done: !!(await prisma.seoSettings.findUnique({ where: { websiteId: website.id } }))?.title, href: "/dashboard/seo" },
    { label: "Published", done: published, href: "/dashboard/settings" },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="flex max-w-3xl flex-col gap-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">
            Welcome, {website.settings?.businessName ?? "there"}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-[13px] text-[var(--gray-500)]">
            <span className={`badge ${published ? "badge-success" : "badge-warning"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
              {published ? "Published" : "Draft"}
            </span>
            <span>Last updated {new Date(website.updatedAt).toLocaleString(website.settings?.locale || "en-US")}</span>
          </p>
        </div>
        <a
          href={`/sites/${website.previewSlug}`}
          target="_blank"
          rel="noopener"
          className="btn btn-secondary"
        >
          View website
          <ExternalLink size={13} />
        </a>
      </div>

      {pct < 100 && (
        <div className="card p-5 hover-lift animate-rise-in">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[var(--gray-900)]">Website setup</h2>
            <span className="text-[13px] font-semibold text-indigo-600">{pct}%</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--gray-100)]">
            <div className="h-full rounded-full bg-indigo-600 transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 text-[13px]">
            {steps.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className={`flex items-center gap-1.5 font-medium transition-colors ${
                  s.done ? "text-emerald-600" : "text-[var(--gray-500)] hover:text-[var(--gray-900)]"
                }`}
              >
                {s.done ? <Check size={14} strokeWidth={2.5} /> : <Circle size={14} />}
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={t.category} value={categoryCount} delay="stagger-1" />
        <Stat label={t.items} value={productCount} delay="stagger-2" />
        <Stat label="Template" value={website.templateId} small delay="stagger-3" />
      </div>

      <div>
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {quickActions.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              style={{ animationDelay: `${i * 40}ms` }}
              className="card hover-lift animate-rise-in group flex items-center justify-between px-4 py-3 text-[13px] font-medium text-[var(--gray-800)] hover:border-[var(--gray-300)]"
            >
              {a.label}
              <ArrowUpRight size={14} className="text-[var(--gray-300)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--gray-500)]" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, small, delay }: { label: string; value: string | number; small?: boolean; delay?: string }) {
  return (
    <div className={`card hover-lift animate-rise-in p-4 ${delay ?? ""}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">{label}</p>
      <p className={small ? "mt-1 truncate text-[14px] font-semibold text-[var(--gray-800)]" : "mt-1 text-[22px] font-semibold text-[var(--gray-900)]"}>
        {value}
      </p>
    </div>
  );
}
