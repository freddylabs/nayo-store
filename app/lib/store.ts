import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Lightweight file-backed data store for the demo.
 *
 * In a real deployment this module would be replaced by a proper database
 * (Postgres, etc.). It intentionally exposes a small, async-friendly API so the
 * rest of the app never depends on where the data actually lives. Passwords are
 * salted + hashed with scrypt and card numbers are never persisted (only the
 * last four digits + brand are stored on an order).
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
}

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shipping_address: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  payment: {
    brand: string;
    last4: string;
  };
}

interface Database {
  users: StoredUser[];
  orders: Order[];
}

const DATA_DIR = join(process.cwd(), ".data");
const DB_FILE = join(DATA_DIR, "db.json");

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length !== derived.length) return false;
  return timingSafeEqual(keyBuffer, derived);
}

function seed(): Database {
  const now = Date.now();
  const demoUser: StoredUser = {
    id: "usr_demo",
    name: "Ada Okoye",
    email: "demo@nayo.store",
    passwordHash: hashPassword("password123"),
    phone: "+234 800 123 4567",
    address: "14 Victoria Island Blvd, Lagos, Nigeria",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 120).toISOString(),
  };

  const seededOrder: Order = {
    id: "NAYO-8F3A21",
    userId: demoUser.id,
    items: [
      {
        id: "f-002",
        name: "Onyx Blazer",
        price: 495,
        image: "/fashion-blazer.png",
        category: "fashion",
        qty: 1,
      },
      {
        id: "c-002",
        name: "Kente Draped Robe",
        price: 275,
        image: "/culture-kente.png",
        category: "culture",
        qty: 1,
      },
    ],
    subtotal: 770,
    shipping: 0,
    tax: 61.6,
    total: 831.6,
    status: "delivered",
    createdAt: new Date(now - 1000 * 60 * 60 * 24 * 21).toISOString(),
    shipping_address: {
      name: "Ada Okoye",
      email: "demo@nayo.store",
      address: "14 Victoria Island Blvd",
      city: "Lagos",
      country: "Nigeria",
      zip: "101241",
    },
    payment: { brand: "Visa", last4: "4242" },
  };

  return { users: [demoUser], orders: [seededOrder] };
}

let cache: Database | null = null;

function load(): Database {
  if (cache) return cache;
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    if (existsSync(DB_FILE)) {
      cache = JSON.parse(readFileSync(DB_FILE, "utf8")) as Database;
    } else {
      cache = seed();
      persist();
    }
  } catch {
    cache = seed();
  }
  return cache;
}

function persist() {
  if (!cache) return;
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DB_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    // Best-effort persistence; in-memory cache remains authoritative.
  }
}

function newId(prefix: string): string {
  return `${prefix}_${randomBytes(9).toString("hex")}`;
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const db = load();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized);
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const db = load();
  return db.users.find((u) => u.id === id);
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<StoredUser> {
  const db = load();
  const user: StoredUser = {
    id: newId("usr"),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  persist();
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<StoredUser, "name" | "phone" | "address">>
): Promise<StoredUser | undefined> {
  const db = load();
  const user = db.users.find((u) => u.id === id);
  if (!user) return undefined;
  if (patch.name !== undefined) user.name = patch.name.trim();
  if (patch.phone !== undefined) user.phone = patch.phone.trim();
  if (patch.address !== undefined) user.address = patch.address.trim();
  persist();
  return user;
}

export async function createOrder(
  order: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }
): Promise<Order> {
  const db = load();
  const record: Order = {
    ...order,
    id: `NAYO-${randomBytes(3).toString("hex").toUpperCase()}`,
    status: order.status ?? "processing",
    createdAt: new Date().toISOString(),
  };
  db.orders.unshift(record);
  persist();
  return record;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  const db = load();
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = load();
  return db.orders.find((o) => o.id === id);
}
