import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Stateless, cookie-based sessions signed with an HMAC (no external deps).
 *
 * The token format is `base64url(payload).base64url(signature)`. The payload
 * carries only the minimum needed to identify the user (id + expiry), never
 * sensitive data. For production, swap the secret for a strong value provided
 * via the SESSION_SECRET environment variable.
 */

const SESSION_COOKIE = "nayo_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const SECRET =
  process.env.SESSION_SECRET ??
  "nayo-dev-session-secret-change-me-in-production";

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(data: string): string {
  return base64url(createHmac("sha256", SECRET).update(data).digest());
}

export function encodeSession(payload: SessionPayload): string {
  const body = base64url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
    ) as SessionPayload;
    if (!payload.userId || !payload.expiresAt) return null;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const token = encodeSession({ userId, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export { SESSION_COOKIE };
