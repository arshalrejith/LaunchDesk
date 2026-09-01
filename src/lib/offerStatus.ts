export type OfferStatus = "active" | "scheduled" | "expired";

/** Status is always computed from today's date — never stored, so it can never go stale. */
export function computeOfferStatus(offer: { startDate: Date | string | null; endDate: Date | string | null }): OfferStatus {
  const now = Date.now();
  if (offer.endDate && new Date(offer.endDate).getTime() < now) return "expired";
  if (offer.startDate && new Date(offer.startDate).getTime() > now) return "scheduled";
  return "active";
}
