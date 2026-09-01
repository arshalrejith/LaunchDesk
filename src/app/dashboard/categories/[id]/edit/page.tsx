import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { updateCategoryAction } from "../../actions";
import CategoryForm from "../../category-form";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { website } = await requireClientSession();
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();
  assertOwnsWebsite(category.websiteId, website.id);

  const asset = category.imageAssetId
    ? await prisma.mediaAsset.findUnique({ where: { id: category.imageAssetId } })
    : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Edit Category</h1>
      <CategoryForm
        action={updateCategoryAction}
        initial={{ id: category.id, name: category.name, description: category.description, imageUrl: asset?.url }}
        submitLabel="Save Changes"
      />
    </div>
  );
}
