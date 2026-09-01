import { requireClientSession } from "@/lib/scope";
import { CATEGORY_OPTIONS } from "@/lib/constants";
import BusinessForm from "./business-form";

export default async function BusinessPage() {
  const { website } = await requireClientSession();
  const settings = website.settings;

  return (
    <div className="max-w-3xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Business Information</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        This powers the contact details, hours and location shown across the website.
      </p>
      <BusinessForm settings={settings} categories={CATEGORY_OPTIONS as unknown as string[]} />
    </div>
  );
}
