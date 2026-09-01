import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import SeoForm from "./seo-form";

export default async function SeoPage() {
  const { website } = await requireClientSession();
  const seo = await prisma.seoSettings.findUnique({ where: { websiteId: website.id } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">SEO</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        Leave a field blank and use &ldquo;Suggest with AI&rdquo; for a starting draft — these are heuristic
        drafts from your business details in this pass, not a live model call yet. Always review before saving.
      </p>
      <div className="mt-6">
        <SeoForm
          seo={{
            title: seo?.title ?? null,
            metaDesc: seo?.metaDesc ?? null,
            keywords: seo?.keywords ?? null,
            serviceAreas: seo?.serviceAreas ?? null,
            gbpUrl: seo?.gbpUrl ?? null,
          }}
          facts={{
            businessName: website.settings?.businessName ?? "",
            category: website.settings?.category ?? null,
            area: website.settings?.area ?? null,
            city: website.settings?.city ?? null,
            signature: website.settings?.tagline ?? null,
            priceRange: null, // no price-range field on Settings yet — a Phase 1 addition to flag
          }}
        />
      </div>
    </div>
  );
}
