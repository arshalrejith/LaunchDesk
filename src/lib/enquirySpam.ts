/**
 * The public enquiry endpoint uses two cheap protections:
 * - a honeypot field for basic bots
 * - a persistent per-website database-backed rate limit
 */
import { isRateLimited as isRateLimitedGeneric } from "@/lib/rateLimit";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export function isHoneypotTripped(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export async function isRateLimited(websiteId: string): Promise<boolean> {
  return isRateLimitedGeneric(`enquiry:${websiteId}`, MAX_PER_WINDOW, WINDOW_MS);
}
