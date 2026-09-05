import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  fashionProducts,
  foodProducts,
  healthProducts,
  cultureProducts,
  type Product,
} from "@/app/data/products";
import {
  defaultCopy,
  type Order,
  type SiteCopy,
} from "@/app/lib/site-data";

const dir = path.join(process.cwd(), "data");
const catalogFile = path.join(dir, "catalog.json");
const copyFile = path.join(dir, "copy.json");
const ordersFile = path.join(dir, "orders.json");

const seedProducts: Product[] = [
  ...fashionProducts,
  ...foodProducts,
  ...healthProducts,
  ...cultureProducts,
];

async function ensureDir() {
  await mkdir(dir, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await ensureDir();
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

export async function getCatalog(): Promise<Product[]> {
  const stored = await readJson<Product[] | { products: Product[] }>(
    catalogFile,
    seedProducts
  );
  const list = Array.isArray(stored) ? stored : stored.products;
  return list.length ? list : seedProducts;
}

export async function saveCatalog(products: Product[]) {
  await writeJson(catalogFile, products);
}

export async function getCopy(): Promise<SiteCopy> {
  const stored = await readJson<Partial<SiteCopy>>(copyFile, {});
  return { ...defaultCopy, ...stored };
}

export async function saveCopy(copy: SiteCopy) {
  await writeJson(copyFile, copy);
}

export async function getOrders(): Promise<Order[]> {
  const stored = await readJson<Order[]>(ordersFile, []);
  return Array.isArray(stored) ? stored : [];
}

export async function saveOrders(orders: Order[]) {
  await writeJson(ordersFile, orders);
}

export async function addOrder(order: Order) {
  const orders = await getOrders();
  orders.unshift(order);
  await saveOrders(orders);
  return order;
}

export function productsByCategory(
  products: Product[],
  category: Product["category"]
) {
  return products.filter((item) => item.category === category);
}

export function createOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  return `NAYO-${stamp}`;
}
