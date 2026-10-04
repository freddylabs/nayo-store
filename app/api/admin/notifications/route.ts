import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getInboxSummary, OUTLOOK_URL } from "@/app/lib/outlook";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const inbox = await getInboxSummary();
  return NextResponse.json({ inbox, outlookUrl: OUTLOOK_URL });
}
