import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { normalizePhone } from "@/lib/businessConfig";
import { markCampaignSentAction } from "./actions";
import CampaignForm from "./campaign-form";

export default async function CampaignsPage() {
  const { website } = await requireClientSession();
  const [campaigns, enquiries] = await Promise.all([
    prisma.campaign.findMany({ where: { websiteId: website.id }, orderBy: { createdAt: "desc" } }),
    prisma.enquiry.findMany({ where: { websiteId: website.id, phone: { not: null } }, orderBy: { createdAt: "desc" } }),
  ]);

  const recipients = new Map<string, string>();
  for (const e of enquiries) {
    if (e.phone && !recipients.has(e.phone)) recipients.set(e.phone, e.name || "Customer");
  }
  const recipientList = [...recipients.entries()];

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Campaigns</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">
        Send a message to people who&rsquo;ve enquired before. There&rsquo;s no bulk-send API here, so each recipient
        gets an individual WhatsApp link, pre-filled — one click per person, honestly, not a fake &ldquo;auto-sent&rdquo; button.
      </p>

      <div className="mt-6">
        <CampaignForm />
      </div>

      <div className="mt-4 rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4">
        <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">Reach right now</p>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">
          {recipientList.length === 0
            ? "No past enquirers with a phone number yet — this fills in as people use your Enquire form."
            : `${recipientList.length} customer${recipientList.length === 1 ? "" : "s"} who've enquired before.`}
        </p>
      </div>

      {campaigns.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                    {c.title}{" "}
                    <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {c.status}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-[var(--gray-600)]">{c.message}</p>
                </div>
                {c.status !== "sent" && (
                  <form action={markCampaignSentAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="whitespace-nowrap btn btn-secondary !px-2.5 !py-1 !text-xs">
                      Mark All Sent
                    </button>
                  </form>
                )}
              </div>
              {recipientList.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipientList.map(([phone, name]) => (
                    <a
                      key={phone}
                      href={`${normalizePhone(phone, website.settings?.phoneCountryCode)?.replace("+", "https://wa.me/") ?? "#"}?text=${encodeURIComponent(c.message)}`}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      {name} ({phone}) ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
