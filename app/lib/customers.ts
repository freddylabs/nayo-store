import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import path from "path";
import { mkdir, readFile, writeFile } from "fs/promises";
import { cookies } from "next/headers";
import { db, hasDatabase } from "@/app/lib/db";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

export type Customer = {
  id: string;
  email: string;
  pinHash: string | null;
  createdAt: string;
};

const COOKIE = "nayo_customer_session";
const SESSION_DAYS = 30;
const LINK_DAYS = 7;
const ID_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const customersFile = path.join(process.cwd(), "data", "customers.json");

function sessionSecret(): string {
  const explicit = process.env.CUSTOMER_SESSION_SECRET;
  if (explicit) return explicit;
  const base = process.env.STRIPE_SECRET_KEY;
  if (base) return createHash("sha256").update(`nayo-customer:${base}`).digest("hex");
  if (process.env.NODE_ENV !== "production") return "nayo-dev-customer-secret";
  throw new Error("Set CUSTOMER_SESSION_SECRET to enable customer accounts.");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Accepts "NY-K7Q2MX", "ny k7q2mx" or "K7Q2MX". */
export function normalizeCustomerId(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = raw.startsWith("NY") && raw.length === 8 ? raw.slice(2) : raw;
  return `NY-${body}`;
}

function newCustomerId(): string {
  let body = "";
  for (let i = 0; i < 6; i++) body += ID_ALPHABET[randomInt(ID_ALPHABET.length)];
  return `NY-${body}`;
}

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

// ---- storage ---------------------------------------------------------------

type CustomerRow = { id: string; email: string; pin_hash: string | null; created_at: Date };

function fromRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    email: row.email,
    pinHash: row.pin_hash,
    createdAt: row.created_at.toISOString(),
  };
}

async function readFileCustomers(): Promise<Customer[]> {
  try {
    const list = JSON.parse(await readFile(customersFile, "utf8")) as Customer[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writeFileCustomers(list: Customer[]) {
  await mkdir(path.dirname(customersFile), { recursive: true });
  await writeFile(customersFile, JSON.stringify(list, null, 2), "utf8");
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  const needle = normalizeEmail(email);
  if (!needle) return null;
  if (!hasDatabase()) {
    return (await readFileCustomers()).find((c) => normalizeEmail(c.email) === needle) ?? null;
  }
  const sql = await db();
  const rows = await sql<CustomerRow[]>`SELECT * FROM customers WHERE lower(email) = ${needle}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const needle = normalizeCustomerId(id);
  if (!hasDatabase()) {
    return (await readFileCustomers()).find((c) => c.id === needle) ?? null;
  }
  const sql = await db();
  const rows = await sql<CustomerRow[]>`SELECT * FROM customers WHERE id = ${needle}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

/** Finds a customer by email or customer ID. */
export async function findCustomer(identifier: string): Promise<Customer | null> {
  const value = identifier.trim();
  if (!value) return null;
  return value.includes("@") ? getCustomerByEmail(value) : getCustomerById(value);
}

/** Returns the customer for this email, creating one with a fresh ID if needed. */
export async function ensureCustomer(email: string): Promise<Customer> {
  const existing = await getCustomerByEmail(email);
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    const customer: Customer = {
      id: newCustomerId(),
      email: normalizeEmail(email),
      pinHash: null,
      createdAt: new Date().toISOString(),
    };
    if (!hasDatabase()) {
      const list = await readFileCustomers();
      if (list.some((c) => c.id === customer.id)) continue;
      list.push(customer);
      await writeFileCustomers(list);
      return customer;
    }
    const sql = await db();
    const rows = await sql<CustomerRow[]>`
      INSERT INTO customers (id, email) VALUES (${customer.id}, ${customer.email})
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    if (rows[0]) return fromRow(rows[0]);
    const raced = await getCustomerByEmail(email);
    if (raced) return raced;
  }
  throw new Error("Could not create a customer ID.");
}

async function hashPin(pin: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(pin, salt, 32);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPin(customer: Customer, pin: string): Promise<boolean> {
  if (!customer.pinHash || !isValidPin(pin)) return false;
  const [scheme, saltHex, hashHex] = customer.pinHash.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(pin, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

export async function setCustomerPin(customerId: string, pin: string): Promise<Customer | null> {
  const pinHash = await hashPin(pin);
  if (!hasDatabase()) {
    const list = await readFileCustomers();
    const index = list.findIndex((c) => c.id === customerId);
    if (index < 0) return null;
    list[index] = { ...list[index], pinHash };
    await writeFileCustomers(list);
    return list[index];
  }
  const sql = await db();
  const rows = await sql<CustomerRow[]>`
    UPDATE customers SET pin_hash = ${pinHash} WHERE id = ${customerId} RETURNING *
  `;
  return rows[0] ? fromRow(rows[0]) : null;
}

// ---- signed tokens -----------------------------------------------------------

type TokenPurpose = "session" | "pin-link";
type TokenBody = { c: string; p: TokenPurpose; e: number; v: string };

/** Ties tokens to the current PIN so changing it signs out old sessions and links. */
function pinVersion(customer: Customer): string {
  return createHash("sha256").update(customer.pinHash ?? "no-pin").digest("hex").slice(0, 16);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function makeToken(customer: Customer, purpose: TokenPurpose, days: number): string {
  const body: TokenBody = {
    c: customer.id,
    p: purpose,
    e: Date.now() + days * 864e5,
    v: pinVersion(customer),
  };
  const payload = Buffer.from(JSON.stringify(body)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

async function readToken(token: string, purpose: TokenPurpose): Promise<Customer | null> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  let body: TokenBody;
  try {
    body = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as TokenBody;
  } catch {
    return null;
  }
  if (body.p !== purpose || typeof body.e !== "number" || body.e < Date.now()) return null;

  const customer = await getCustomerById(body.c);
  if (!customer || pinVersion(customer) !== body.v) return null;
  return customer;
}

export function makePinLinkToken(customer: Customer): string {
  return makeToken(customer, "pin-link", LINK_DAYS);
}

export function pinLinkUrl(customer: Customer, base: string): string {
  return `${base}/account/pin?token=${encodeURIComponent(makePinLinkToken(customer))}`;
}

export function readPinLinkToken(token: string): Promise<Customer | null> {
  return readToken(token, "pin-link");
}

export const customerCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  },
};

export function makeSessionToken(customer: Customer): string {
  return makeToken(customer, "session", SESSION_DAYS);
}

/** The signed-in customer for this request, if any. */
export async function getSessionCustomer(): Promise<Customer | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return readToken(token, "session").catch(() => null);
}
