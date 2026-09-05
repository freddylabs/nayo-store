import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";

export async function GET() {
  const ok = await isAdminRequest();
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
