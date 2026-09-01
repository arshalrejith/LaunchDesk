"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { parseCsv } from "@/lib/csv";
import { logChange } from "@/lib/changelog";

const EXPECTED_HEADERS = ["name", "category", "price", "offerprice", "unit", "sku", "stockqty", "shortdesc"];

export async function bulkImportProductsAction(_prevState: { error?: string; result?: { added: number; skipped: string[] } } | undefined, formData: FormData) {
  const { website } = await requireClientSession();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "Choose a CSV file first." };

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length === 0) return { error: "That file has no rows." };

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = ["name"].filter((h) => !header.includes(h));
  if (missing.length) {
    return { error: `Missing required column: ${missing.join(", ")}. Expected columns: ${EXPECTED_HEADERS.join(", ")}.` };
  }
  const col = (key: string) => header.indexOf(key);

  const categories = await prisma.category.findMany({ where: { websiteId: website.id } });
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
  let categoryCount = categories.length;
  let productCount = await prisma.product.count({ where: { websiteId: website.id } });

  const skipped: string[] = [];
  let added = 0;

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const name = r[col("name")]?.trim();
    if (!name) {
      skipped.push(`Row ${i + 1}: missing product name`);
      continue;
    }

    let categoryId: string | null = null;
    const categoryName = col("category") >= 0 ? r[col("category")]?.trim() : "";
    if (categoryName) {
      const existing = categoryByName.get(categoryName.toLowerCase());
      if (existing) {
        categoryId = existing;
      } else {
        const created = await prisma.category.create({
          data: { websiteId: website.id, name: categoryName, order: categoryCount },
        });
        categoryByName.set(categoryName.toLowerCase(), created.id);
        categoryId = created.id;
        categoryCount += 1;
      }
    }

    const price = col("price") >= 0 && r[col("price")] ? Number(r[col("price")]) : null;
    const offerPrice = col("offerprice") >= 0 && r[col("offerprice")] ? Number(r[col("offerprice")]) : null;
    const stockQty = col("stockqty") >= 0 && r[col("stockqty")] ? Number(r[col("stockqty")]) : null;
    if (price !== null && (!Number.isFinite(price) || price < 0)) { skipped.push(`Row ${i + 1}: invalid price`); continue; }
    if (offerPrice !== null && (!Number.isFinite(offerPrice) || offerPrice < 0)) { skipped.push(`Row ${i + 1}: invalid offer price`); continue; }
    if (offerPrice !== null && price === null) { skipped.push(`Row ${i + 1}: offer price requires a regular price`); continue; }
    if (offerPrice !== null && price !== null && offerPrice > price) { skipped.push(`Row ${i + 1}: offer price cannot be higher than price`); continue; }
    if (stockQty !== null && (!Number.isInteger(stockQty) || stockQty < 0)) { skipped.push(`Row ${i + 1}: invalid stock quantity`); continue; }

    await prisma.product.create({
      data: {
        websiteId: website.id,
        categoryId,
        name,
        shortDesc: col("shortdesc") >= 0 ? r[col("shortdesc")]?.trim() || null : null,
        unit: col("unit") >= 0 ? r[col("unit")]?.trim() || null : null,
        sku: col("sku") >= 0 ? r[col("sku")]?.trim() || null : null,
        price: Number.isFinite(price) ? price : null,
        offerPrice: Number.isFinite(offerPrice) ? offerPrice : null,
        stockQty: Number.isFinite(stockQty) ? stockQty : null,
        order: productCount,
      },
    });
    productCount += 1;
    added += 1;
  }

  if (added > 0) {
    await logChange(website.id, `Bulk-uploaded ${added} product${added === 1 ? "" : "s"} from CSV`);
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/categories");
  }

  return { result: { added, skipped } };
}
