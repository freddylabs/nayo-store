import { NextResponse } from "next/server";
import {
  adminCookie,
  makeAdminToken,
  passwordMatches,
} from "@/app/lib/admin-auth";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!passwordMatches(body.password || "")) {
    return NextResponse.json(
      { error: "That password did not match." },
      { status: 401 }
    );
  }

  const token = makeAdminToken();
  if (!token) {
    return NextResponse.json(
      { error: "Set ADMIN_PASSWORD in .env.local first." },
      { status: 503 }
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
