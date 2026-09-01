import { prisma } from "@/lib/prisma";
import { requireClientSession } from "@/lib/scope";
import { deleteGalleryImageAction, toggleHideGalleryImageAction, setCoverGalleryImageAction, moveGalleryImageAction } from "./actions";
import GalleryUploadForm from "./upload-form";

export default async function GalleryPage() {
  const { website } = await requireClientSession();
  const images = await prisma.galleryImage.findMany({ where: { websiteId: website.id }, orderBy: { order: "asc" } });
  const assets = await prisma.mediaAsset.findMany({ where: { id: { in: images.map((i) => i.assetId) } } });
  const assetUrl = (id: string) => assets.find((a) => a.id === id)?.url;

  return (
    <div className="max-w-3xl">
      <h1 className="text-[22px] font-semibold tracking-tight text-[var(--gray-900)]">Gallery</h1>
      <p className="mt-1 text-[13px] text-[var(--gray-500)]">Upload photos of the store, products in use, or events — enabled if the Gallery section is on.</p>

      <div className="mt-6">
        <GalleryUploadForm />
      </div>

      {images.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--gray-500)]">No gallery images yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.id} className={`overflow-hidden rounded-xl border border-[var(--gray-200)] bg-[var(--surface)] ${img.hidden ? "opacity-50" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetUrl(img.assetId)} alt="" className="h-32 w-full object-cover" />
              <div className="flex flex-wrap items-center gap-1 p-2">
                {img.isCover && <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">Cover</span>}
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button type="submit" disabled={i === 0} className="rounded border border-[var(--gray-200)] px-1.5 py-0.5 text-xs disabled:opacity-30">↑</button>
                </form>
                <form action={moveGalleryImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button type="submit" disabled={i === images.length - 1} className="rounded border border-[var(--gray-200)] px-1.5 py-0.5 text-xs disabled:opacity-30">↓</button>
                </form>
                <form action={setCoverGalleryImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" className="rounded border border-[var(--gray-200)] px-1.5 py-0.5 text-xs font-semibold hover:bg-[var(--gray-50)]">Set Cover</button>
                </form>
                <form action={toggleHideGalleryImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" className="rounded border border-[var(--gray-200)] px-1.5 py-0.5 text-xs font-semibold hover:bg-[var(--gray-50)]">
                    {img.hidden ? "Show" : "Hide"}
                  </button>
                </form>
                <form action={deleteGalleryImageAction}>
                  <input type="hidden" name="id" value={img.id} />
                  <button type="submit" className="rounded border border-red-200 px-1.5 py-0.5 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
