import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { resolveLinkTarget } from "@/lib/linkTargets";
import { toggleHandledAction } from "./actions";

export default async function MessagesPage() {
  const { website } = await requireClientSession();
  const enquiries = await prisma.enquiry.findMany({
    where: { websiteId: website.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Messages</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Enquiries submitted through your website land here.</p>

      {enquiries.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center">
          <p className="text-[13.5px] font-semibold text-[var(--gray-800)]">No enquiries yet</p>
          <p className="mt-1 text-[13px] text-[var(--gray-500)]">They&rsquo;ll show up here as soon as someone uses the Enquire or contact form on your site.</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {enquiries.map((e) => (
            <div key={e.id} className={`rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] p-4 ${e.handled ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-[var(--gray-900)]">
                    {e.name || "Someone"} {e.handled && <span className="ml-1 rounded-full bg-[var(--gray-100)] px-2 py-0.5 text-xs font-semibold text-[var(--gray-500)]">Handled</span>}
                  </p>
                  <p className="text-xs text-[var(--gray-400)]">{new Date(e.createdAt).toLocaleString(website.settings?.locale || "en-US")}</p>
                </div>
                <form action={toggleHandledAction}>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" className="btn btn-secondary !px-2.5 !py-1 !text-xs">
                    {e.handled ? "Mark Unhandled" : "Mark Handled"}
                  </button>
                </form>
              </div>
              {e.message && <p className="mt-2 text-sm text-[var(--gray-700)]">{e.message}</p>}
              {e.phone && (
                <div className="mt-2 flex gap-2">
                  <a href={resolveLinkTarget({ type: "call", value: null, phone: e.phone, whatsapp: null, phoneCountryCode: website.settings?.phoneCountryCode, mapsUrl: null, previewSlug: website.previewSlug })?.href ?? `tel:${e.phone}`} className="rounded-full bg-[var(--inverse-bg)] px-3 py-1 text-xs font-semibold text-[var(--inverse-fg)]">Call {e.phone}</a>
                  <a href={resolveLinkTarget({ type: "whatsapp", value: null, phone: e.phone, whatsapp: e.phone, phoneCountryCode: website.settings?.phoneCountryCode, mapsUrl: null, previewSlug: website.previewSlug })?.href ?? `https://wa.me/${e.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">WhatsApp</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
