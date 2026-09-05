import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getOrders, saveOrders } from "@/app/lib/store";
import type { Order, OrderStatus } from "@/app/lib/site-data";

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

  const orders = await getOrders();
  const index = orders.findIndex((item) => item.id === body.id);
  if (index < 0) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const next: Order = { ...orders[index], updatedAt: new Date().toISOString() };
  if (body.status && statuses.includes(body.status)) next.status = body.status;
  if (typeof body.trackingNumber === "string") {
    next.trackingNumber = body.trackingNumber.trim();
  }
  if (typeof body.labelNote === "string") next.labelNote = body.labelNote.trim();
  orders[index] = next;
  await saveOrders(orders);
  return NextResponse.json({ order: next });
}
