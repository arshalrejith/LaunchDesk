import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireClientSession, assertOwnsWebsite } from "@/lib/scope";
import { updateOfferAction } from "../../actions";
import { currencySymbol } from "@/lib/businessConfig";
import OfferForm from "../../offer-form";

function toDateInput(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : "";
}

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { website } = await requireClientSession();
  const offer = await prisma.offer.findUnique({ where: { id } });
  if (!offer) notFound();
  assertOwnsWebsite(offer.websiteId, website.id);

  const asset = offer.imageAssetId ? await prisma.mediaAsset.findUnique({ where: { id: offer.imageAssetId } }) : null;

  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Edit Offer</h1>
      <OfferForm
        action={updateOfferAction}
        submitLabel="Save Changes"
        currencySymbol={currencySymbol(website.settings?.currency, website.settings?.locale)}
        initial={{
          id: offer.id,
          name: offer.name,
          description: offer.description,
          originalPrice: offer.originalPrice,
          offerPrice: offer.offerPrice,
          startDate: toDateInput(offer.startDate),
          endDate: toDateInput(offer.endDate),
          cta: offer.cta,
          ctaType: offer.ctaType,
          ctaValue: offer.ctaValue,
          imageUrl: asset?.url,
        }}
      />
    </div>
  );
}
