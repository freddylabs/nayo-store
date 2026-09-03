export const DELIVERY_FEE = 9.99;
export const FREE_DELIVERY_THRESHOLD = 100;

export type FulfillmentMethod = "delivery" | "pickup";

export function getDeliveryFee(
  subtotal: number,
  method: FulfillmentMethod
): number {
  if (method === "pickup") return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}

export function slugifyName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 22);
}

export function createLineId(name: string): string {
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()
      : Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${slugifyName(name)}-${unique}`;
}
