import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import CatalogueForm from "./catalogue-form";

export default async function CataloguePage() {
  const { website } = await requireClientSession();
  const [catalogue, categories] = await Promise.all([
    prisma.catalogue.findUnique({ where: { websiteId: website.id } }),
    prisma.category.findMany({
      where: { websiteId: website.id },
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  let categoryIds: string[] = [];
  try {
    categoryIds = catalogue?.categoryIds ? JSON.parse(catalogue.categoryIds) : [];
  } catch {
    categoryIds = [];
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Catalogue</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        A shareable digital catalogue built from your products — updates automatically as they change.
      </p>
      {website.publishStatus === "PUBLISHED" && (
        <a href={`/sites/${website.previewSlug}/catalogue`} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-semibold text-indigo-600 hover:underline">
          View live catalogue ↗
        </a>
      )}

      <div className="mt-6">
        <CatalogueForm
          catalogue={{
            title: catalogue?.title ?? null,
            description: catalogue?.description ?? null,
            showPrices: catalogue?.showPrices ?? true,
            showDescriptions: catalogue?.showDescriptions ?? true,
            showWhatsapp: catalogue?.showWhatsapp ?? true,
            showEnquiry: catalogue?.showEnquiry ?? true,
            categoryIds,
          }}
          categories={categories.map((c) => ({ id: c.id, name: c.name, productCount: c._count.products }))}
        />
      </div>
    </div>
  );
}
