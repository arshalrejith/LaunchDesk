import { requireClientSession } from "@/lib/scope";
import { prisma } from "@/lib/prisma";
import WebsiteEditor from "./website-editor";
import HeroCtaForm from "./hero-cta-form";
import BrandingForm from "./branding-form";

export default async function WebsitePage() {
  const { website } = await requireClientSession();
  const [toggles, homepage, brand] = await Promise.all([
    prisma.sectionToggle.findMany({ where: { websiteId: website.id } }),
    prisma.homepageContent.findUnique({ where: { websiteId: website.id } }),
    prisma.brandSettings.findUnique({ where: { websiteId: website.id } }),
  ]);
  const sections: Record<string, boolean> = {};
  for (const t of toggles) sections[t.key] = t.enabled;

  return (
    <div className="max-w-3xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Website Design</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Pick the active design and what appears on the site.</p>
      <div className="mt-6">
        <WebsiteEditor templateId={website.templateId} category={website.settings?.category} sections={sections} />
      </div>

      <div className="mt-8 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Colors</h2>
        <div className="mt-4">
          <BrandingForm initial={{ accentColor: brand?.primaryColor, backgroundColor: brand?.backgroundColor }} />
        </div>
      </div>

      <div className="mt-8 card p-5">
        <h2 className="text-[13.5px] font-semibold text-[var(--gray-900)]">Homepage Buttons</h2>
        <p className="mt-1 text-[13px] text-[var(--gray-500)]">
          Choose what each button does — call, WhatsApp, jump to a section, or a custom link. Leave blank to keep the site&rsquo;s defaults.
        </p>
        <div className="mt-4">
          <HeroCtaForm initial={homepage ?? {}} />
        </div>
      </div>
    </div>
  );
}
