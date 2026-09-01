import "server-only";

const DEFAULT_BUCKET = "launchdesk-media";

function config() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }
  return { url, key, bucket };
}

function storageObjectUrl(baseUrl: string, bucket: string, objectPath: string) {
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}

export async function uploadToSupabaseStorage(
  data: Uint8Array,
  objectPath: string,
  contentType: string,
): Promise<string> {
  const { url, key, bucket } = config();
  const encodedPath = objectPath.split("/").map(encodeURIComponent).join("/");
  const endpoint = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "false",
    },
    body: data as unknown as BodyInit,
    cache: "no-store",
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      detail = body.message || body.error || "";
    } catch {
      // Keep the generic message if Supabase did not return JSON.
    }
    throw new Error(detail ? `Image upload failed: ${detail}` : "Image upload failed.");
  }

  return storageObjectUrl(url, bucket, objectPath);
}

export async function deleteFromSupabaseStorage(objectPath: string): Promise<void> {
  const { url, key, bucket } = config();
  const endpoint = `${url}/storage/v1/object/${encodeURIComponent(bucket)}/remove`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: [objectPath] }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Image deletion failed.");
  }
}

export function supabaseObjectPathFromUrl(value: string): string | null {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
  if (!url) return null;
  const prefix = `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/`;
  if (!value.startsWith(prefix)) return null;
  const encoded = value.slice(prefix.length);
  try {
    return encoded.split("/").map(decodeURIComponent).join("/");
  } catch {
    return null;
  }
}
