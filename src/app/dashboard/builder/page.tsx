import { requireClientSession } from "@/lib/scope";
import { prisma } from "@/lib/prisma";
import { defaultSections } from "@/components/builder/sections";
import { terminology } from "@/lib/businessConfig";
import { resolveLinkTarget } from "@/lib/linkTargets";
import { normalizeBuilderAccent, normalizeBuilderFont, parseBuilderSections } from "@/lib/builderValidation";
import BuilderEditor from "./BuilderEditor";

export default async function BuilderPage() {
  const { website } = await requireClientSession();

  const [customPage, products, galleryImages] = await Promise.all([
    prisma.customPage.findUnique({ where: { websiteId: website.id } }),
    prisma.product.findMany({ where: { websiteId: website.id, hidden: false }, orderBy: { order: "asc" } }),
    prisma.galleryImage.findMany({ where: { websiteId: website.id, hidden: false }, orderBy: { order: "asc" } }),
  ]);

  const assetIds = new Set<string>();
  for (const p of products) if (p.imageAssetId) assetIds.add(p.imageAssetId);
  for (const g of galleryImages) assetIds.add(g.assetId);
  const assets = assetIds.size ? await prisma.mediaAsset.findMany({ where: { id: { in: [...assetIds] } } }) : [];
  const urlFor = (id: string | null | undefined) => (id ? assets.find((a) => a.id === id)?.url ?? null : null);

  const settings = website.settings;
  const terms = terminology(settings?.category);
  const realProducts = products.map((p) => ({ id: p.id, name: p.name, price: p.price, offerPrice: p.offerPrice, available: p.available, image: urlFor(p.imageAssetId) }));
  const realImages = galleryImages.map((g) => urlFor(g.assetId)).filter((u): u is string => !!u);
  const realContact = {
    phone: settings?.phone ?? null,
    whatsapp: settings?.whatsapp ?? null,
    address: [settings?.address, settings?.area, settings?.city, settings?.state].filter(Boolean).join(", ") || null,
    callHref: settings?.phone ? resolveLinkTarget({ type: "call", value: null, phone: settings.phone, whatsapp: settings.whatsapp, phoneCountryCode: settings.phoneCountryCode, mapsUrl: settings.mapsUrl, previewSlug: website.previewSlug })?.href ?? null : null,
    whatsappHref: settings?.whatsapp ? resolveLinkTarget({ type: "whatsapp", value: null, phone: settings.phone, whatsapp: settings.whatsapp, phoneCountryCode: settings.phoneCountryCode, mapsUrl: settings.mapsUrl, previewSlug: website.previewSlug })?.href ?? null : null,
  };

  const accent = normalizeBuilderAccent(customPage?.accent);
  const font = normalizeBuilderFont(customPage?.font);
  let initialSections = defaultSections(accent);
  if (customPage?.sectionsJson) {
    try {
      initialSections = parseBuilderSections(JSON.parse(customPage.sectionsJson), accent);
    } catch {
      // A damaged legacy row should never take the entire Builder down.
      initialSections = defaultSections(accent);
    }
  }

  return (
    <div className="-m-5 -mt-5 h-screen md:-m-9">
      <BuilderEditor
        initialSections={initialSections}
        initialAccent={accent}
        initialFont={font}
        isActiveTemplate={website.templateId === "custom-builder"}
        realProducts={realProducts}
        realImages={realImages}
        realContact={realContact}
        currency={settings?.currency ?? "INR"}
        locale={settings?.locale ?? "en-IN"}
        itemLabel={terms.items}
      />
    </div>
  );
}
