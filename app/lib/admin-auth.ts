import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "nayo_admin_session";

export function getAdminPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? "" : "nayo-admin")
  );
}

function tokenFor(password: string): string {
  return createHmac("sha256", password).update("nayo-admin").digest("hex");
}

export function makeAdminToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return tokenFor(password);
}

export function passwordMatches(input: string): boolean {
  const password = getAdminPassword();
  if (!password || !input) return false;
  const a = Buffer.from(tokenFor(input));
  const b = Buffer.from(tokenFor(password));
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
