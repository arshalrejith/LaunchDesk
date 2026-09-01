import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { updateProductAction } from "../../actions";
import { currencySymbol, terminology } from "@/lib/businessConfig";
import ProductForm from "../../product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { website } = await requireClientSession();
  const t = terminology(website.settings?.category);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  assertOwnsWebsite(product.websiteId, website.id);

  const [categories, asset] = await Promise.all([
    prisma.category.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" }, select: { id: true, name: true } }),
    product.imageAssetId ? prisma.mediaAsset.findUnique({ where: { id: product.imageAssetId } }) : null,
  ]);

  let tags: string[] = [];
  try {
    tags = product.tags ? JSON.parse(product.tags) : [];
  } catch {
    tags = [];
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">{`Edit ${t.item}`}</h1>
      <ProductForm
        action={updateProductAction}
        categories={categories}
        submitLabel="Save Changes"
        currencySymbol={currencySymbol(website.settings?.currency, website.settings?.locale)}
        itemLabel={t.item}
        initial={{
          id: product.id,
          name: product.name,
          categoryId: product.categoryId,
          shortDesc: product.shortDesc,
          fullDesc: product.fullDesc,
          price: product.price,
          offerPrice: product.offerPrice,
          unit: product.unit,
          sku: product.sku,
          tags,
          stockQty: product.stockQty,
          available: product.available,
          featured: product.featured,
          imageUrl: asset?.url,
        }}
      />
    </div>
  );
}
