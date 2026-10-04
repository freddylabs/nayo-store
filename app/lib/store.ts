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
  type OrderStatus,
  type SiteCopy,
} from "@/app/lib/site-data";
import { db, hasDatabase } from "@/app/lib/db";

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

async function readSetting<T>(key: string): Promise<T | undefined> {
  const sql = await db();
  const rows = await sql<{ value: T }[]>`
    SELECT value FROM site_settings WHERE key = ${key}
  `;
  return rows[0]?.value;
}

async function writeSetting(key: string, value: unknown) {
  const sql = await db();
  const json = sql.json(value as Parameters<typeof sql.json>[0]);
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${key}, ${json}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

type StoredCatalog = Product[] | { products: Product[]; migrations?: string[] };

/** One-time changes applied to catalogs the owner saved before the change shipped. */
const catalogMigrations: { id: string; run: (list: Product[]) => Product[] }[] = [
  {
    id: "2026-10-ghana-jerseys",
    run: (list) => {
      const jerseyIds = fashionProducts.map((item) => item.id);
      const kept = list.filter(
        (item) => item.category !== "fashion" || jerseyIds.includes(item.id)
      );
      const missing = fashionProducts.filter((item) => !kept.some((p) => p.id === item.id));
      const firstFood = kept.findIndex((item) => item.category !== "fashion");
      const at = firstFood < 0 ? kept.length : firstFood;
      return [...kept.slice(0, at), ...missing, ...kept.slice(at)];
    },
  },
];

async function writeCatalog(products: Product[]) {
  const value = { products, migrations: catalogMigrations.map((m) => m.id) };
  if (hasDatabase()) return writeSetting("catalog", value);
  await writeJson(catalogFile, value);
}

export async function getCatalog(): Promise<Product[]> {
  const stored = hasDatabase()
    ? await readSetting<StoredCatalog>("catalog")
    : await readJson<StoredCatalog | undefined>(catalogFile, undefined);
  if (!stored) return seedProducts;
  let list = Array.isArray(stored) ? stored : stored.products;
  if (!list.length) return seedProducts;

  const applied = Array.isArray(stored) ? [] : stored.migrations ?? [];
  const pending = catalogMigrations.filter((m) => !applied.includes(m.id));
  if (pending.length) {
    for (const migration of pending) list = migration.run(list);
    await writeCatalog(list);
  }
  return list;
}

export async function saveCatalog(products: Product[]) {
  await writeCatalog(products);
}

export async function getCopy(): Promise<SiteCopy> {
  const stored = hasDatabase()
    ? await readSetting<Partial<SiteCopy>>("copy")
    : await readJson<Partial<SiteCopy>>(copyFile, {});
  return { ...defaultCopy, ...stored };
}

export async function saveCopy(copy: SiteCopy) {
  if (hasDatabase()) return writeSetting("copy", copy);
  await writeJson(copyFile, copy);
}

type OrderRow = {
  id: string;
  order_number: string;
  created_at: Date;
  updated_at: Date | null;
  customer_name: string;
  email: string;
  phone: string;
  fulfillment: Order["fulfillment"];
  address: Order["address"] | null;
  items: Order["items"];
  subtotal: string;
  delivery_fee: string;
  total: string;
  status: OrderStatus;
  payment_status: NonNullable<Order["paymentStatus"]>;
  paid_at: Date | null;
  receipt_sent_at: Date | null;
  tracking_number: string | null;
  label_note: string | null;
  delivery_method: Order["deliveryMethod"] | null;
  shipped_at: Date | null;
  delivered_at: Date | null;
  shipping_email_sent_at: Date | null;
};

function fromRow(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    fulfillment: row.fulfillment,
    address: row.address ?? undefined,
    items: row.items,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status,
    paymentStatus: row.payment_status,
    paidAt: row.paid_at?.toISOString(),
    receiptSentAt: row.receipt_sent_at?.toISOString(),
    trackingNumber: row.tracking_number ?? undefined,
    labelNote: row.label_note ?? undefined,
    deliveryMethod: row.delivery_method ?? undefined,
    shippedAt: row.shipped_at?.toISOString(),
    deliveredAt: row.delivered_at?.toISOString(),
    shippingEmailSentAt: row.shipping_email_sent_at?.toISOString(),
  };
}

async function readOrderFile(): Promise<Order[]> {
  const stored = await readJson<Order[]>(ordersFile, []);
  return Array.isArray(stored) ? stored : [];
}

async function changeOrderFile(
  id: string,
  change: (order: Order) => Order | null
): Promise<Order | null> {
  const orders = await readOrderFile();
  const index = orders.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const next = change(orders[index]);
  if (!next) return null;
  orders[index] = next;
  await writeJson(ordersFile, orders);
  return next;
}

export async function getOrders(): Promise<Order[]> {
  if (!hasDatabase()) return readOrderFile();
  const sql = await db();
  const rows = await sql<OrderRow[]>`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows.map(fromRow);
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!hasDatabase()) {
    return (await readOrderFile()).find((item) => item.id === id) ?? null;
  }
  const sql = await db();
  const rows = await sql<OrderRow[]>`SELECT * FROM orders WHERE id = ${id}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function addOrder(order: Order) {
  if (!hasDatabase()) {
    const orders = await readOrderFile();
    if (!orders.some((item) => item.id === order.id)) {
      orders.unshift(order);
      await writeJson(ordersFile, orders);
    }
    return order;
  }
  const sql = await db();
  const address = order.address
    ? sql.json(order.address as unknown as Parameters<typeof sql.json>[0])
    : null;
  const items = sql.json(order.items as unknown as Parameters<typeof sql.json>[0]);
  await sql`
    INSERT INTO orders (
      id, order_number, created_at, customer_name, email, phone, fulfillment,
      address, items, subtotal, delivery_fee, total, status, payment_status,
      paid_at
    ) VALUES (
      ${order.id}, ${order.orderNumber}, ${order.createdAt}, ${order.customerName},
      ${order.email}, ${order.phone}, ${order.fulfillment}, ${address}, ${items},
      ${order.subtotal}, ${order.deliveryFee}, ${order.total}, ${order.status},
      ${order.paymentStatus ?? "pending"}, ${order.paidAt ?? null}
    )
    ON CONFLICT (id) DO NOTHING
  `;
  return order;
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const needle = email.trim().toLowerCase();
  if (!needle) return [];
  if (!hasDatabase()) {
    return (await readOrderFile())
      .filter((order) => order.email.trim().toLowerCase() === needle)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const sql = await db();
  const rows = await sql<OrderRow[]>`
    SELECT * FROM orders WHERE lower(email) = ${needle} ORDER BY created_at DESC
  `;
  return rows.map(fromRow);
}

/** `null` for deliveryMethod and "" for text fields clear the stored value. */
export type OrderPatch = {
  status?: OrderStatus;
  deliveryMethod?: Order["deliveryMethod"] | null;
  trackingNumber?: string;
  labelNote?: string;
};

export async function updateOrder(
  id: string,
  patch: OrderPatch
): Promise<Order | null> {
  const merge = (order: Order): Order => {
    const next: Order = {
      ...order,
      ...Object.fromEntries(
        Object.entries(patch)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, value === null || value === "" ? undefined : value])
      ),
      updatedAt: new Date().toISOString(),
    };
    const now = new Date().toISOString();
    if ((next.status === "sent" || next.status === "shipped") && !next.shippedAt) {
      next.shippedAt = now;
    }
    if (next.status === "delivered" && !next.deliveredAt) next.deliveredAt = now;
    if (next.status !== "delivered") next.deliveredAt = undefined;
    if (next.status === "to_send") next.shippedAt = undefined;
    return next;
  };

  if (!hasDatabase()) return changeOrderFile(id, merge);

  const current = await getOrder(id);
  if (!current) return null;
  const next = merge(current);
  const sql = await db();
  const rows = await sql<OrderRow[]>`
    UPDATE orders SET
      status = ${next.status},
      delivery_method = ${next.deliveryMethod ?? null},
      tracking_number = ${next.trackingNumber ?? null},
      label_note = ${next.labelNote ?? null},
      shipped_at = ${next.shippedAt ?? null},
      delivered_at = ${next.deliveredAt ?? null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? fromRow(rows[0]) : null;
}

/** Marks the shipping email as sent; returns false if it already went out. */
export async function claimShippingEmail(id: string): Promise<boolean> {
  if (!hasDatabase()) {
    let claimed = false;
    await changeOrderFile(id, (order) => {
      if (order.shippingEmailSentAt) return null;
      claimed = true;
      return { ...order, shippingEmailSentAt: new Date().toISOString() };
    });
    return claimed;
  }
  const sql = await db();
  const rows = await sql`
    UPDATE orders SET shipping_email_sent_at = now()
    WHERE id = ${id} AND shipping_email_sent_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function releaseShippingEmail(id: string) {
  if (!hasDatabase()) {
    await changeOrderFile(id, (order) => ({ ...order, shippingEmailSentAt: undefined }));
    return;
  }
  const sql = await db();
  await sql`UPDATE orders SET shipping_email_sent_at = NULL WHERE id = ${id}`;
}

export async function markOrderPaid(id: string): Promise<Order | null> {
  if (!hasDatabase()) {
    return changeOrderFile(id, (order) => ({
      ...order,
      paymentStatus: "paid",
      paidAt: order.paidAt ?? new Date().toISOString(),
    }));
  }
  const sql = await db();
  const rows = await sql<OrderRow[]>`
    UPDATE orders SET
      payment_status = 'paid',
      paid_at = COALESCE(paid_at, now())
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? fromRow(rows[0]) : null;
}

/** Marks the receipt as sent; returns false if another request already claimed it. */
export async function claimReceipt(id: string): Promise<boolean> {
  if (!hasDatabase()) {
    let claimed = false;
    await changeOrderFile(id, (order) => {
      if (order.receiptSentAt) return null;
      claimed = true;
      return { ...order, receiptSentAt: new Date().toISOString() };
    });
    return claimed;
  }
  const sql = await db();
  const rows = await sql`
    UPDATE orders SET receipt_sent_at = now()
    WHERE id = ${id} AND receipt_sent_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function releaseReceipt(id: string) {
  if (!hasDatabase()) {
    await changeOrderFile(id, (order) => ({ ...order, receiptSentAt: undefined }));
    return;
  }
  const sql = await db();
  await sql`UPDATE orders SET receipt_sent_at = NULL WHERE id = ${id}`;
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
