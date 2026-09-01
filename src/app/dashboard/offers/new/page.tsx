import { createOfferAction } from "../actions";
import OfferForm from "../offer-form";
import { requireClientSession } from "@/lib/scope";
import { currencySymbol } from "@/lib/businessConfig";

export default async function NewOfferPage() {
  const { website } = await requireClientSession();
  return (
    <div className="max-w-lg">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Add Offer</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Set start and end dates to control when it&apos;s live automatically.</p>
      <OfferForm action={createOfferAction} submitLabel="Save Offer" currencySymbol={currencySymbol(website.settings?.currency, website.settings?.locale)} />
    </div>
  );
}
