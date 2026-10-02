import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getOrders, updateOrder, type OrderPatch } from "@/app/lib/store";
import type { OrderStatus } from "@/app/lib/site-data";

const statuses: OrderStatus[] = ["to_send", "sent", "shipped", "picked_up"];

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function PATCH(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  let body: {
    id?: string;
    status?: OrderStatus;
    trackingNumber?: string;
    labelNote?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Order id is required." }, { status: 400 });
  }

  const patch: OrderPatch = {};
  if (body.status && statuses.includes(body.status)) patch.status = body.status;
  if (typeof body.trackingNumber === "string") {
    patch.trackingNumber = body.trackingNumber.trim();
  }
  if (typeof body.labelNote === "string") patch.labelNote = body.labelNote.trim();

  const order = await updateOrder(body.id, patch);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  return NextResponse.json({ order });
}
