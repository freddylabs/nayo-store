import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/dal";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
