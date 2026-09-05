import type { Product } from "@/app/data/products";

export function mealExtrasTotal(product: Product, extraIds: string[]): number {
  return (product.meal?.extras ?? [])
    .filter((item) => extraIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);
}

export function mealUnitPrice(product: Product, extraIds: string[]): number {
  return product.price + mealExtrasTotal(product, extraIds);
}

export function mealOptionsKey(droppedIds: string[], extraIds: string[]): string {
  return JSON.stringify({
    d: [...droppedIds].sort(),
    e: [...extraIds].sort(),
  });
}

export function mealNote(
  product: Product,
  droppedIds: string[],
  extraIds: string[]
): string {
  if (!product.meal) return "";

  const parts: string[] = [];
  const dropped = product.meal.included
    .filter((item) => droppedIds.includes(item.id))
    .map((item) => item.name);
  if (dropped.length) parts.push(`No ${dropped.join(", ")}`);

  const extras = product.meal.extras
    .filter((item) => extraIds.includes(item.id))
    .map((item) => item.name);
  if (extras.length) parts.push(`Extra ${extras.join(", ")}`);

  const free = product.meal.complimentary.map((item) => item.name);
  if (free.length) parts.push(`Served free: ${free.join(", ")}`);

  return parts.join(" · ");
}

export function mealCartPayload(
  product: Product,
  droppedIds: string[],
  extraIds: string[]
) {
  return {
    productId: product.id,
    name: product.name,
    price: mealUnitPrice(product, extraIds),
    image: product.image,
    category: product.category,
    note: mealNote(product, droppedIds, extraIds),
    optionsKey: mealOptionsKey(droppedIds, extraIds),
  };
}

export function productImageSize(src: string): { width: number; height: number } {
  if (src.includes("health-team-three")) return { width: 1024, height: 576 };
  if (src.includes("food-jollof-goat")) return { width: 1024, height: 683 };
  if (src.includes("food-fried-rice")) return { width: 683, height: 1024 };
  if (src.includes("food-jollof-chicken")) return { width: 819, height: 1024 };
  if (src.includes("food-ampesi-kontomire")) return { width: 1024, height: 731 };
  if (src.includes("food-ampesi-plantain")) return { width: 496, height: 618 };
  if (src.includes("hero-food")) return { width: 511, height: 512 };
  if (
    src.includes("fashion-blazer") ||
    src.includes("fashion-velvet") ||
    src.includes("culture-kente")
  ) {
    return { width: 1024, height: 1024 };
  }
  return { width: 819, height: 1024 };
}
