import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { uploadToSupabaseStorage } from "@/lib/storage";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

function localStorageEnabled() {
  return process.env.UPLOAD_STORAGE === "local";
}

function assertImageContent(buf: Buffer, mime: string) {
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isWebp =
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;

  if (!isJpg && !isPng && !isWebp) {
    throw new Error("That file's content doesn't match an accepted image format.");
  }

  return isPng ? "png" : isWebp ? "webp" : "jpg";
}

/**
 * Validates the actual file bytes before storing the image.
 *
 * Supabase Storage is the default destination. Set UPLOAD_STORAGE=local only
 * for intentionally offline/local development. Production refuses local storage.
 */
export async function saveUploadedImage(
  file: File | null | undefined,
  websiteId: string,
  kind: string,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_BYTES) throw new Error("Image must be smaller than 10MB.");
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("Only JPG, PNG or WEBP images are accepted.");
  }

  if (process.env.NODE_ENV === "production" && localStorageEnabled()) {
    throw new Error("Local image storage is disabled in production.");
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = assertImageContent(buf, file.type);
  const filename = `${kind}-${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;

  if (localStorageEnabled()) {
    const dir = path.join(process.cwd(), "public", "uploads", websiteId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buf);
    return `/uploads/${websiteId}/${filename}`;
  }

  const objectPath = `websites/${websiteId}/${kind}/${filename}`;
  return uploadToSupabaseStorage(buf, objectPath, file.type);
}
