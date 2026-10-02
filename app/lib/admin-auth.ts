import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "nayo_admin_session";

export function getAdminPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? "" : "nayo-admin")
  );
}

export function getAdminEmail(): string {
  return normalizeEmail(process.env.ADMIN_EMAIL || "info@nayo.market");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function tokenFor(email: string, password: string): string {
  return createHmac("sha256", password)
    .update(`nayo-admin:${normalizeEmail(email)}`)
    .digest("hex");
}

export function makeAdminToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return tokenFor(getAdminEmail(), password);
}

export function credentialsMatch(email: string, input: string): boolean {
  const password = getAdminPassword();
  if (!password || !email || !input) return false;
  const a = Buffer.from(tokenFor(email, input));
  const b = Buffer.from(tokenFor(getAdminEmail(), password));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminRequest(): Promise<boolean> {
  const expected = makeAdminToken();
  if (!expected) return false;
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value;
  if (!got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const adminCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  },
};
