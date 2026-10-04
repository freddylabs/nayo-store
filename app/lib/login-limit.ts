import { db, hasDatabase } from "@/app/lib/db";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

type Attempt = { failures: number; windowStart: number; lockedUntil: number };

const memory = new Map<string, Attempt>();

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `admin-login:${ip}`;
}

/** Minutes left on a lockout, or 0 when this client may try to sign in. */
export async function lockedMinutes(key: string): Promise<number> {
  let lockedUntil = 0;
  if (hasDatabase()) {
    const sql = await db();
    const rows = await sql<{ locked_until: Date | null }[]>`
      SELECT locked_until FROM login_attempts WHERE key = ${key}
    `;
    lockedUntil = rows[0]?.locked_until?.getTime() ?? 0;
  } else {
    lockedUntil = memory.get(key)?.lockedUntil ?? 0;
  }
  const left = lockedUntil - Date.now();
  return left > 0 ? Math.ceil(left / 60000) : 0;
}

export async function recordFailure(key: string): Promise<void> {
  const now = Date.now();
  if (hasDatabase()) {
    const sql = await db();
    const windowStart = new Date(now - WINDOW_MS);
    const lockUntil = new Date(now + LOCK_MS);
    await sql`
      INSERT INTO login_attempts (key, failures, window_start)
      VALUES (${key}, 1, now())
      ON CONFLICT (key) DO UPDATE SET
        failures = CASE
          WHEN login_attempts.window_start < ${windowStart} THEN 1
          ELSE login_attempts.failures + 1
        END,
        window_start = CASE
          WHEN login_attempts.window_start < ${windowStart} THEN now()
          ELSE login_attempts.window_start
        END
    `;
    await sql`
      UPDATE login_attempts
      SET locked_until = ${lockUntil}, failures = 0, window_start = now()
      WHERE key = ${key} AND failures >= ${MAX_FAILURES}
    `;
    return;
  }

  const current = memory.get(key);
  const fresh = !current || now - current.windowStart > WINDOW_MS;
  const next: Attempt = fresh
    ? { failures: 1, windowStart: now, lockedUntil: current?.lockedUntil ?? 0 }
    : { ...current, failures: current.failures + 1 };
  if (next.failures >= MAX_FAILURES) {
    next.lockedUntil = now + LOCK_MS;
    next.failures = 0;
    next.windowStart = now;
  }
  memory.set(key, next);
}

export async function clearFailures(key: string): Promise<void> {
  if (hasDatabase()) {
    const sql = await db();
    await sql`DELETE FROM login_attempts WHERE key = ${key}`;
    return;
  }
  memory.delete(key);
}
