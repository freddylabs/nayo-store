import { NextResponse } from "next/server";
import {
  adminCookie,
  credentialsMatch,
  makeAdminToken,
} from "@/app/lib/admin-auth";
import {
  clearFailures,
  clientKey,
  lockedMinutes,
  recordFailure,
} from "@/app/lib/login-limit";

async function safely<T>(task: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await task();
  } catch (error) {
    console.error("[admin login] attempt tracking failed", error);
    return fallback;
  }
}

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = makeAdminToken();
  if (!token) {
    return NextResponse.json(
      { error: "Admin sign in is not set up yet. Add ADMIN_PASSWORD first." },
      { status: 503 }
    );
  }

  const key = clientKey(request);
  const wait = await safely(() => lockedMinutes(key), 0);
  if (wait > 0) {
    return NextResponse.json(
      {
        error: `Too many wrong tries. Please wait ${wait} minute${wait === 1 ? "" : "s"} and try again.`,
      },
      { status: 429, headers: { "Retry-After": String(wait * 60) } }
    );
  }

  if (!credentialsMatch(body.email || "", body.password || "")) {
    await safely(() => recordFailure(key), undefined);
    return NextResponse.json(
      { error: "That email and password did not match." },
      { status: 401 }
    );
  }

  await safely(() => clearFailures(key), undefined);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie.name, token, adminCookie.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 });
  return res;
}
