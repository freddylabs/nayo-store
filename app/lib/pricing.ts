import type { Product } from "@/app/data/products";
import { mealNote, mealUnitPrice } from "@/app/lib/meal";

export const MAX_LINE_QTY = 50;

export type CartLineRequest = {
  productId: string;
  qty: number;
  optionsKey?: string;
};

export type PricedLine = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  note?: string;
};

function parseOptions(product: Product, optionsKey?: string) {
  if (!product.meal || !optionsKey) return { dropped: [], extras: [] };
  try {
    const parsed = JSON.parse(optionsKey) as { d?: unknown; e?: unknown };
    const ids = (value: unknown) =>
      Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
    const included = new Set(product.meal.included.map((item) => item.id));
    const extras = new Set(product.meal.extras.map((item) => item.id));
    return {
      dropped: [...new Set(ids(parsed.d))].filter((id) => included.has(id)),
      extras: [...new Set(ids(parsed.e))].filter((id) => extras.has(id)),
    };
  } catch {
    return { dropped: [], extras: [] };
  }
}

/**
 * Prices cart lines from the catalog. Anything the browser sends besides the
 * product, quantity and meal options is ignored so totals cannot be tampered with.
 */
export function priceCart(
  lines: CartLineRequest[],
  catalog: Product[]
): { items: PricedLine[] } | { error: string } {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const items: PricedLine[] = [];

  for (const line of lines) {
    const product = byId.get(line?.productId);
    if (!product) {
      return { error: "An item in your cart is no longer available. Please remove it and try again." };
    }
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_LINE_QTY) {
      return { error: `Quantities must be between 1 and ${MAX_LINE_QTY}.` };
    }

    const { dropped, extras } = parseOptions(product, line.optionsKey);
    const price = product.meal ? mealUnitPrice(product, extras) : product.price;
    if (!(price > 0)) {
      return { error: `${product.name} cannot be ordered right now.` };
    }

    items.push({
      productId: product.id,
      name: product.name,
      price: Math.round(price * 100) / 100,
      qty,
      image: product.image,
      note: product.meal ? mealNote(product, dropped, extras) || undefined : undefined,
    });
  }

  return { items };
}
