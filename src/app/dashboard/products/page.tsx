import Link from "next/link";
import { ArrowUp, ArrowDown, Copy, Pencil, Trash2, Eye, EyeOff, Upload, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { formatMoney, terminology } from "@/lib/businessConfig";
import { deleteProductAction, toggleHideProductAction, duplicateProductAction, moveProductAction } from "./actions";

export default async function ProductsPage() {
  const { website } = await requireClientSession();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" } }),
    prisma.category.findMany({ where: { websiteId: website.id } }),
  ]);
  const t = terminology(website.settings?.category);
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">{t.items}</h1>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">Add, edit, duplicate, hide or reorder — the catalogue updates automatically.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/products/bulk" className="btn btn-secondary">
            <Upload size={14} />
            Upload in bulk
          </Link>
          <Link href="/dashboard/products/new" className="btn btn-accent">
            <Plus size={14} />
            {t.add}
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">No {t.items.toLowerCase()} yet</p>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">{t.emptyHint}</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {products.map((p, i) => (
            <div key={p.id} className={`card flex flex-wrap items-center gap-3 px-4 py-3 ${p.hidden ? "opacity-50" : ""}`}>
              <div className="flex-1">
                <p className="flex flex-wrap items-center gap-1.5 text-[13.5px] font-semibold text-[var(--gray-900)]">
                  {p.name}
                  {p.featured && <span className="badge badge-warning">★ Featured</span>}
                  {!p.available && <span className="badge badge-danger">Out of stock</span>}
                  {p.hidden && <span className="badge badge-danger">Hidden</span>}
                </p>
                <p className="mt-0.5 text-[12px] text-[var(--gray-500)]">
                  {categoryName(p.categoryId)}
                  {p.shortDesc ? ` · ${p.shortDesc}` : ""}
                  {p.stockQty !== null ? ` · Qty: ${p.stockQty}` : ""}
                </p>
              </div>
              {(p.price != null || p.offerPrice != null) && (
                <p className="font-mono text-[13px]">
                  {p.offerPrice ? (
                    <>
                      <span className="mr-1 text-[var(--gray-400)] line-through">{formatMoney(p.price, website.settings)}</span>{formatMoney(p.offerPrice, website.settings)}
                    </>
                  ) : (
                    <>{formatMoney(p.price, website.settings)}</>
                  )}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-1.5">
                <form action={moveProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button type="submit" disabled={i === 0} className="btn btn-ghost !px-1.5 !py-1.5" aria-label="Move up">
                    <ArrowUp size={13} />
                  </button>
                </form>
                <form action={moveProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button type="submit" disabled={i === products.length - 1} className="btn btn-ghost !px-1.5 !py-1.5" aria-label="Move down">
                    <ArrowDown size={13} />
                  </button>
                </form>
                <form action={toggleHideProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="btn btn-secondary !px-2 !py-1.5 !text-xs">
                    {p.hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                    {p.hidden ? "Show" : "Hide"}
                  </button>
                </form>
                <form action={duplicateProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="btn btn-secondary !px-2 !py-1.5 !text-xs">
                    <Copy size={13} />
                    Duplicate
                  </button>
                </form>
                <Link href={`/dashboard/products/${p.id}/edit`} className="btn btn-secondary !px-2 !py-1.5 !text-xs">
                  <Pencil size={13} />
                  Edit
                </Link>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="btn !px-2 !py-1.5 !text-xs border border-red-200 text-red-700 hover:bg-red-50">
                    <Trash2 size={13} />
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
