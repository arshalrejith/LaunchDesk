import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { terminology } from "@/lib/businessConfig";
import { deleteCategoryAction, toggleHideCategoryAction, moveCategoryAction } from "./actions";

export default async function CategoriesPage() {
  const { website } = await requireClientSession();
  const { category: categoryLabel, item: itemLabel } = terminology(website.settings?.category);
  const categories = await prisma.category.findMany({
    where: { websiteId: website.id },
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">{categoryLabel}</h1>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Unlimited categories — reorder, hide, edit or delete.</p>
        </div>
        <Link
          href="/dashboard/categories/new"
          className="btn btn-accent"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">No categories yet</p>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Add one like &ldquo;Cold Pressed Oils&rdquo; or &ldquo;Maroon &amp; Gold&rdquo;.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex flex-wrap items-center gap-3 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] px-4 py-3 ${cat.hidden ? "opacity-50" : ""}`}
            >
              <div className="flex-1">
                <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                  {cat.name} {cat.hidden && <span className="ml-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">Hidden</span>}
                </p>
                <p className="text-xs text-[var(--gray-500)]">
                  {cat._count.products} {itemLabel.toLowerCase()}{cat._count.products === 1 ? "" : "s"}
                  {cat.description ? ` · ${cat.description}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <form action={moveCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button type="submit" disabled={i === 0} className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs disabled:opacity-30">↑</button>
                </form>
                <form action={moveCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button type="submit" disabled={i === categories.length - 1} className="rounded-md border border-[var(--gray-200)] px-2 py-1 text-xs disabled:opacity-30">↓</button>
                </form>
                <form action={toggleHideCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="btn btn-secondary !px-2 !py-1 !text-xs">
                    {cat.hidden ? "Show" : "Hide"}
                  </button>
                </form>
                <Link href={`/dashboard/categories/${cat.id}/edit`} className="btn btn-secondary !px-2 !py-1 !text-xs">
                  Edit
                </Link>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
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
