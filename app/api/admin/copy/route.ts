import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getCopy, saveCopy } from "@/app/lib/store";
import type { SiteCopy } from "@/app/lib/site-data";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const copy = await getCopy();
  return NextResponse.json({ copy });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  let body: { copy?: SiteCopy };
  try {
    body = (await request.json()) as { copy?: SiteCopy };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.copy) {
    return NextResponse.json({ error: "Copy is required." }, { status: 400 });
  }
  await saveCopy(body.copy);
  return NextResponse.json({ copy: body.copy });
}
