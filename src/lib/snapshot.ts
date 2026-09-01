import { prisma } from "@/lib/prisma";

/**
 * A WebsiteSnapshot is the entire published state of one site — everything the
 * public renderer needs, with no further queries against the live (draft)
 * tables. This is what makes Draft vs. Published a real separation: the
 * renderer only ever reads the latest PUBLISHED VersionSnapshot.contentJson,
 * never the live Category/Product/etc. rows directly.
 */
export type WebsiteSnapshot = {
  templateId: string;
  settings: Awaited<ReturnType<typeof prisma.settings.findUnique>>;
  brand: Awaited<ReturnType<typeof prisma.brandSettings.findUnique>>;
  homepage: Awaited<ReturnType<typeof prisma.homepageContent.findUnique>>;
  seo: Awaited<ReturnType<typeof prisma.seoSettings.findUnique>>;
  catalogue: Awaited<ReturnType<typeof prisma.catalogue.findUnique>>;
  customPage: Awaited<ReturnType<typeof prisma.customPage.findUnique>>;
  sections: Awaited<ReturnType<typeof prisma.sectionToggle.findMany>>;
  categories: Awaited<ReturnType<typeof prisma.category.findMany>>;
  products: Awaited<ReturnType<typeof prisma.product.findMany>>;
  offers: Awaited<ReturnType<typeof prisma.offer.findMany>>;
  gallery: Awaited<ReturnType<typeof prisma.galleryImage.findMany>>;
  mediaAssets: Awaited<ReturnType<typeof prisma.mediaAsset.findMany>>;
  discounts: Awaited<ReturnType<typeof prisma.discount.findMany>>;
};

export async function buildWebsiteSnapshot(websiteId: string): Promise<WebsiteSnapshot> {
  const [website, settings, brand, homepage, seo, catalogue, customPage, sections, categories, products, offers, gallery, discounts] =
    await Promise.all([
      prisma.website.findUniqueOrThrow({ where: { id: websiteId } }),
      prisma.settings.findUnique({ where: { websiteId } }),
      prisma.brandSettings.findUnique({ where: { websiteId } }),
      prisma.homepageContent.findUnique({ where: { websiteId } }),
      prisma.seoSettings.findUnique({ where: { websiteId } }),
      prisma.catalogue.findUnique({ where: { websiteId } }),
      prisma.customPage.findUnique({ where: { websiteId } }),
      prisma.sectionToggle.findMany({ where: { websiteId } }),
      prisma.category.findMany({ where: { websiteId }, orderBy: { order: "asc" } }),
      prisma.product.findMany({ where: { websiteId }, orderBy: { order: "asc" } }),
      prisma.offer.findMany({ where: { websiteId } }),
      prisma.galleryImage.findMany({ where: { websiteId }, orderBy: { order: "asc" } }),
      prisma.discount.findMany({ where: { websiteId, active: true } }),
    ]);

  const assetIds = new Set<string>();
  for (const c of categories) if (c.imageAssetId) assetIds.add(c.imageAssetId);
  for (const p of products) if (p.imageAssetId) assetIds.add(p.imageAssetId);
  for (const o of offers) if (o.imageAssetId) assetIds.add(o.imageAssetId);
  for (const g of gallery) assetIds.add(g.assetId);
  if (brand?.logoAssetId) assetIds.add(brand.logoAssetId);

  const mediaAssets = assetIds.size
    ? await prisma.mediaAsset.findMany({ where: { id: { in: [...assetIds] } } })
    : [];

  return { templateId: website.templateId, settings, brand, homepage, seo, catalogue, customPage, sections, categories, products, offers, gallery, mediaAssets, discounts };
}

/** Overwrites every live table for this website with what a past snapshot held. Used by version Restore. */
export async function restoreWebsiteSnapshot(websiteId: string, snapshot: WebsiteSnapshot) {
  await prisma.$transaction(async (tx) => {
    for (const asset of snapshot.mediaAssets) {
      await tx.mediaAsset.upsert({
        where: { id: asset.id },
        create: { id: asset.id, websiteId, kind: asset.kind, url: asset.url, width: asset.width, height: asset.height, altText: asset.altText },
        update: { kind: asset.kind, url: asset.url, width: asset.width, height: asset.height, altText: asset.altText },
      });
    }

    await tx.product.deleteMany({ where: { websiteId } });
    await tx.category.deleteMany({ where: { websiteId } });
    await tx.offer.deleteMany({ where: { websiteId } });
    await tx.galleryImage.deleteMany({ where: { websiteId } });
    await tx.discount.deleteMany({ where: { websiteId } });
    await tx.sectionToggle.deleteMany({ where: { websiteId } });

    for (const cat of snapshot.categories) {
      await tx.category.create({
        data: { id: cat.id, websiteId, name: cat.name, description: cat.description, imageAssetId: cat.imageAssetId, order: cat.order, hidden: cat.hidden },
      });
    }
    for (const p of snapshot.products) {
      await tx.product.create({
        data: {
          id: p.id, websiteId, categoryId: p.categoryId, name: p.name, shortDesc: p.shortDesc, fullDesc: p.fullDesc,
          price: p.price, offerPrice: p.offerPrice, unit: p.unit, sku: p.sku, imageAssetId: p.imageAssetId,
          additionalImageIds: p.additionalImageIds, tags: p.tags, available: p.available, featured: p.featured,
          order: p.order, hidden: p.hidden,
        },
      });
    }
    for (const o of snapshot.offers) {
      await tx.offer.create({
        data: {
          id: o.id, websiteId, name: o.name, description: o.description, originalPrice: o.originalPrice,
          offerPrice: o.offerPrice, startDate: o.startDate, endDate: o.endDate, imageAssetId: o.imageAssetId,
          cta: o.cta, ctaType: o.ctaType, ctaValue: o.ctaValue, whatsappMsg: o.whatsappMsg,
        },
      });
    }
    for (const d of snapshot.discounts) {
      await tx.discount.create({ data: { id: d.id, websiteId, name: d.name, type: d.type, value: d.value, code: d.code, active: d.active } });
    }
    for (const g of snapshot.gallery) {
      await tx.galleryImage.create({ data: { id: g.id, websiteId, assetId: g.assetId, order: g.order, hidden: g.hidden, isCover: g.isCover } });
    }
    for (const s of snapshot.sections) {
      await tx.sectionToggle.create({ data: { id: s.id, websiteId, key: s.key, enabled: s.enabled } });
    }

    if (snapshot.settings) {
      const { websiteId: _w, ...rest } = snapshot.settings;
      await tx.settings.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }
    if (snapshot.brand) {
      const { websiteId: _w, ...rest } = snapshot.brand;
      await tx.brandSettings.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }
    if (snapshot.homepage) {
      const { websiteId: _w, ...rest } = snapshot.homepage;
      await tx.homepageContent.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }
    if (snapshot.seo) {
      const { websiteId: _w, ...rest } = snapshot.seo;
      await tx.seoSettings.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }
    if (snapshot.catalogue) {
      const { websiteId: _w, id: _id, ...rest } = snapshot.catalogue;
      await tx.catalogue.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }
    if (snapshot.customPage) {
      const { websiteId: _w, updatedAt: _u, ...rest } = snapshot.customPage;
      await tx.customPage.upsert({ where: { websiteId }, create: { websiteId, ...rest }, update: rest });
    }

    await tx.website.update({ where: { id: websiteId }, data: { templateId: snapshot.templateId } });
  });
}
