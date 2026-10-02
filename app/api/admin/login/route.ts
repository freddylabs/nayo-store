import { NextResponse } from "next/server";
import {
  adminCookie,
  credentialsMatch,
  makeAdminToken,
} from "@/app/lib/admin-auth";

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

  if (!credentialsMatch(body.email || "", body.password || "")) {
    return NextResponse.json(
      { error: "That email and password did not match." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie.name, token, adminCookie.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 });
  return res;
}
