import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getCatalog, saveCatalog } from "@/app/lib/store";
import type { Product } from "@/app/data/products";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  const products = await getCatalog();
  return NextResponse.json({ products });
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }
  let body: { products?: Product[] };
  try {
    body = (await request.json()) as { products?: Product[] };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!Array.isArray(body.products)) {
    return NextResponse.json({ error: "Products are required." }, { status: 400 });
  }
  const invalid = body.products.find(
    (p) =>
      !p?.id ||
      !p.name?.trim() ||
      !Number.isFinite(p.price) ||
      p.price <= 0 ||
      (p.meal?.extras ?? []).some((x) => !Number.isFinite(x.price) || x.price < 0)
  );
  if (invalid) {
    return NextResponse.json(
      { error: `Check “${invalid.name || "an item"}”: it needs a name and a price above $0.` },
      { status: 400 }
    );
  }
  await saveCatalog(body.products);
  return NextResponse.json({ products: body.products });
}
