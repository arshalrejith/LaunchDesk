import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { createProductAction } from "../actions";
import { currencySymbol, terminology } from "@/lib/businessConfig";
import ProductForm from "../product-form";

export default async function NewProductPage() {
  const { website } = await requireClientSession();
  const t = terminology(website.settings?.category);
  const categories = await prisma.category.findMany({
    where: { websiteId: website.id },
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">{`Add ${t.item}`}</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Name, category and price are usually enough to start.</p>
      <ProductForm action={createProductAction} categories={categories} submitLabel="Save Product" currencySymbol={currencySymbol(website.settings?.currency, website.settings?.locale)} itemLabel={t.item} />
    </div>
  );
}
