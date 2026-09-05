"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  complimentarySides,
  type Product,
  type MealExtra,
} from "@/app/data/products";
import { defaultCopy, type Order, type OrderStatus, type SiteCopy } from "@/app/lib/site-data";

type Tab = "items" | "copy" | "orders";
type Category = "fashion" | "food" | "health";

const copyGroups: { title: string; keys: (keyof SiteCopy)[] }[] = [
  {
    title: "Landing page",
    keys: [
      "landingHeadline",
      "landingSubtitle",
      "brandEyebrow",
      "brandTitle",
      "brandBody",
      "brandCloser",
      "shopEyebrow",
      "shopFoodTitle",
      "shopApparelTitle",
      "shopHealthTitle",
      "landingCloseEyebrow",
      "landingCloseTitle",
      "landingCloseBody",
      "landingCloseCta",
    ],
  },
  {
    title: "Apparel",
    keys: [
      "apparelEyebrow",
      "apparelTitle",
      "apparelIntro",
      "apparelBand1Title",
      "apparelBand1Body",
      "apparelBand2Title",
      "apparelBand2Body",
      "apparelCollectionTitle",
      "apparelCollectionBody",
      "apparelCloseTitle",
      "apparelCloseBody",
    ],
  },
  {
    title: "Foods",
    keys: [
      "foodEyebrow",
      "foodTitle",
      "foodIntro",
      "foodBand1Title",
      "foodBand1Body",
      "foodBand2Title",
      "foodBand2Body",
      "foodCollectionTitle",
      "foodCollectionBody",
      "foodCloseTitle",
      "foodCloseBody",
    ],
  },
  {
    title: "Health",
    keys: [
      "healthEyebrow",
      "healthTitle",
      "healthIntro",
      "healthCollectionTitle",
      "healthCollectionBody",
      "healthCloseTitle",
      "healthCloseBody",
    ],
  },
];

const labels: Record<keyof SiteCopy, string> = {
  landingHeadline: "Headline under the carousel",
  landingSubtitle: "Line under the headline",
  brandEyebrow: "Brand band small line",
  brandTitle: "Brand band title",
  brandBody: "Brand band story",
  brandCloser: "Brand band closing line",
  shopEyebrow: "Shop rows small line",
  shopFoodTitle: "Food row title",
  shopApparelTitle: "Apparel row title",
  shopHealthTitle: "Health row title",
  landingCloseEyebrow: "Bottom band small line",
  landingCloseTitle: "Bottom band title",
  landingCloseBody: "Bottom band writing",
  landingCloseCta: "Bottom band button",
  apparelEyebrow: "Small line",
  apparelTitle: "Page title",
  apparelIntro: "Intro paragraph",
  apparelBand1Title: "First cream title",
  apparelBand1Body: "First cream writing",
  apparelBand2Title: "Second cream title",
  apparelBand2Body: "Second cream writing",
  apparelCollectionTitle: "Collection title",
  apparelCollectionBody: "Collection writing",
  apparelCloseTitle: "Bottom title",
  apparelCloseBody: "Bottom writing",
  foodEyebrow: "Small line",
  foodTitle: "Page title",
  foodIntro: "Intro paragraph",
  foodBand1Title: "First cream title",
  foodBand1Body: "First cream writing",
  foodBand2Title: "Second cream title",
  foodBand2Body: "Second cream writing",
  foodCollectionTitle: "Kitchen title",
  foodCollectionBody: "Kitchen writing",
  foodCloseTitle: "Bottom title",
  foodCloseBody: "Bottom writing",
  healthEyebrow: "Small line",
  healthTitle: "Page title",
  healthIntro: "Intro paragraph",
  healthCollectionTitle: "Collection title",
  healthCollectionBody: "Collection writing",
  healthCloseTitle: "Bottom title",
  healthCloseBody: "Bottom writing",
};

const longKeys = new Set<keyof SiteCopy>([
  "brandBody",
  "landingCloseBody",
  "apparelIntro",
  "apparelBand1Body",
  "apparelBand2Body",
  "apparelCollectionBody",
  "apparelCloseBody",
  "foodIntro",
  "foodBand1Body",
  "foodBand2Body",
  "foodCollectionBody",
  "foodCloseBody",
  "healthIntro",
  "healthCollectionBody",
  "healthCloseBody",
]);

function emptyProduct(category: Category): Product {
  const id = `${category.slice(0, 2)}-${Date.now()}`;
  const base: Product = {
    id,
    name: "",
    description: "",
    price: category === "food" ? 18.99 : 128,
    image: "/hero-food.png",
    category,
    badge: "New",
  };
  if (category === "food") {
    base.meal = {
      included: [{ id: "main", name: "Main plate" }],
      complimentary: complimentarySides,
      extras: [],
    };
  }
  return base;
}

export default function AdminDashboard() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("items");
  const [category, setCategory] = useState<Category>("food");
  const [products, setProducts] = useState<Product[]>([]);
  const [copy, setCopy] = useState<SiteCopy>(defaultCopy);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const [p, c, o] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/copy"),
      fetch("/api/admin/orders"),
    ]);
    if (!p.ok) {
      setAuthed(false);
      return;
    }
    const productsData = (await p.json()) as { products: Product[] };
    const copyData = (await c.json()) as { copy: SiteCopy };
    const ordersData = (await o.json()) as { orders: Order[] };
    setProducts(productsData.products);
    setCopy(copyData.copy);
    setOrders(ordersData.orders);
    setAuthed(true);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => {
        if (res.ok) return load();
        setAuthed(false);
      })
      .finally(() => setReady(true));
  }, []);

  const shown = useMemo(
    () => products.filter((item) => item.category === category),
    [products, category]
  );

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    setPassword("");
    await load();
  };

  const saveProducts = async (next: Product[]) => {
    setMessage("");
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: next }),
    });
    if (!res.ok) {
      setError("Could not save items.");
      return;
    }
    setProducts(next);
    setMessage("Items saved. They will show on the shop.");
    setEditing(null);
  };

  const saveCopy = async () => {
    setMessage("");
    const res = await fetch("/api/admin/copy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copy }),
    });
    if (!res.ok) {
      setError("Could not save the writing.");
      return;
    }
    setMessage("Page writing saved.");
  };

  const updateOrder = async (
    id: string,
    patch: { status?: OrderStatus; trackingNumber?: string; labelNote?: string }
  ) => {
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) return;
    const data = (await res.json()) as { order: Order };
    setOrders((current) =>
      current.map((item) => (item.id === id ? data.order : item))
    );
  };

  if (!ready) {
    return <p className="p-10 text-white/70">Loading…</p>;
  }

  if (!authed) {
    return (
      <form
        onSubmit={signIn}
        className="max-w-md mx-auto mt-24 rounded-2xl border border-nayo-gold/30 bg-white p-8 space-y-4"
      >
        <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
          Nayo Ltd.
        </p>
        <h1 className="text-display text-3xl font-bold text-nayo-black">
          Owner sign in
        </h1>
        <p className="text-sm text-nayo-black/55">
          Use this page to add items, change prices and writing, and follow
          orders.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-nayo-black/15 rounded-lg px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-gold w-full py-3 text-xs tracking-widest uppercase font-bold">
          Sign in
        </button>
      </form>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
            Nayo Ltd.
          </p>
          <h1 className="text-display text-3xl sm:text-4xl font-bold text-white mt-1">
            Owner desk
          </h1>
        </div>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            setAuthed(false);
          }}
          className="text-xs tracking-widest uppercase text-white/70 hover:text-nayo-gold"
        >
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["items", "Items & prices"],
            ["copy", "Page writing"],
            ["orders", "Orders"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase font-bold ${
              tab === id ? "btn-gold" : "border border-white/20 text-white/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {message && <p className="text-nayo-gold text-sm">{message}</p>}
      {error && <p className="text-red-300 text-sm">{error}</p>}

      {tab === "items" && (
        <section className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["food", "Foods"],
                ["fashion", "Apparel"],
                ["health", "Health"],
              ] as [Category, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCategory(id)}
                className={`px-3 py-1.5 rounded-full text-xs ${
                  category === id
                    ? "bg-nayo-gold text-nayo-black font-bold"
                    : "bg-white/10 text-white"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setEditing(emptyProduct(category))}
              className="ml-auto btn-gold px-4 py-2 text-xs tracking-widest uppercase font-bold"
            >
              Add item
            </button>
          </div>

          <div className="grid gap-3">
            {shown.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-white p-4 flex flex-wrap items-center gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-nayo-black">{item.name}</p>
                  <p className="text-sm text-nayo-black/55 line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <p className="font-bold text-nayo-green">${item.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="text-xs uppercase tracking-widest font-bold text-nayo-green"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    saveProducts(products.filter((p) => p.id !== item.id))
                  }
                  className="text-xs uppercase tracking-widest text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {editing && (
            <ProductEditor
              product={editing}
              onCancel={() => setEditing(null)}
              onSave={(next) => {
                const exists = products.some((p) => p.id === next.id);
                saveProducts(
                  exists
                    ? products.map((p) => (p.id === next.id ? next : p))
                    : [next, ...products]
                );
              }}
            />
          )}
        </section>
      )}

      {tab === "copy" && (
        <section className="space-y-8">
          {copyGroups.map((group) => (
            <div key={group.title} className="rounded-2xl bg-white p-6 space-y-4">
              <h2 className="text-display text-2xl font-bold text-nayo-black">
                {group.title}
              </h2>
              {group.keys.map((key) => (
                <label key={key} className="block">
                  <span className="text-[11px] uppercase tracking-widest text-nayo-black/50 font-semibold">
                    {labels[key]}
                  </span>
                  {longKeys.has(key) ? (
                    <textarea
                      value={copy[key]}
                      onChange={(e) =>
                        setCopy({ ...copy, [key]: e.target.value })
                      }
                      rows={3}
                      className="mt-1 w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      value={copy[key]}
                      onChange={(e) =>
                        setCopy({ ...copy, [key]: e.target.value })
                      }
                      className="mt-1 w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
                    />
                  )}
                </label>
              ))}
            </div>
          ))}
          <button
            type="button"
            onClick={saveCopy}
            className="btn-gold px-6 py-3 text-xs tracking-widest uppercase font-bold"
          >
            Save page writing
          </button>
        </section>
      )}

      {tab === "orders" && (
        <OrdersBoard orders={orders} onUpdate={updateOrder} />
      )}
    </div>
  );
}

function ProductEditor({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(product);
  const extras = draft.meal?.extras ?? [];
  const included = draft.meal?.included ?? [];

  const upload = async (file: File) => {
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await res.json()) as { url?: string };
    if (data.url) setDraft((current) => ({ ...current, image: data.url! }));
  };

  return (
    <div className="rounded-2xl bg-white p-6 space-y-4">
      <h2 className="text-display text-2xl font-bold text-nayo-black">
        {product.name ? "Edit item" : "New item"}
      </h2>
      <input
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        placeholder="Name"
        className="w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
      />
      <textarea
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        placeholder="Caption / short description"
        rows={3}
        className="w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          step="0.01"
          value={draft.price}
          onChange={(e) =>
            setDraft({ ...draft, price: Number(e.target.value) || 0 })
          }
          placeholder="Price"
          className="border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
        />
        <input
          value={draft.badge || ""}
          onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
          placeholder="Badge (New, etc.)"
          className="border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
        />
      </div>
      <input
        value={draft.image}
        onChange={(e) => setDraft({ ...draft, image: e.target.value })}
        placeholder="Photo path, e.g. /food-kenkey-platter.jpg"
        className="w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {draft.category === "food" && (
        <div className="space-y-3 border-t border-nayo-black/10 pt-4">
          <p className="text-xs uppercase tracking-widest font-semibold text-nayo-gold">
            On the plate
          </p>
          <input
            value={included.map((item) => item.name).join(", ")}
            onChange={(e) =>
              setDraft({
                ...draft,
                meal: {
                  complimentary: draft.meal?.complimentary ?? complimentarySides,
                  extras,
                  included: e.target.value.split(",").map((name, i) => ({
                    id: `inc-${i}`,
                    name: name.trim(),
                  })).filter((item) => item.name),
                },
              })
            }
            placeholder="Kenkey, fried fish, egg"
            className="w-full border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs uppercase tracking-widest font-semibold text-nayo-gold">
            Extra items
          </p>
          {extras.map((extra, i) => (
            <div key={extra.id} className="grid grid-cols-[1fr_100px_auto] gap-2">
              <input
                value={extra.name}
                onChange={(e) => {
                  const next = extras.map((item, idx) =>
                    idx === i ? { ...item, name: e.target.value } : item
                  );
                  setDraft({
                    ...draft,
                    meal: { ...draft.meal!, extras: next },
                  });
                }}
                className="border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="number"
                step="0.01"
                value={extra.price}
                onChange={(e) => {
                  const next = extras.map((item, idx) =>
                    idx === i
                      ? { ...item, price: Number(e.target.value) || 0 }
                      : item
                  );
                  setDraft({
                    ...draft,
                    meal: { ...draft.meal!, extras: next },
                  });
                }}
                className="border border-nayo-black/15 rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    meal: {
                      ...draft.meal!,
                      extras: extras.filter((_, idx) => idx !== i),
                    },
                  })
                }
                className="text-xs text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const extra: MealExtra = {
                id: `extra-${Date.now()}`,
                name: "",
                price: 3,
              };
              setDraft({
                ...draft,
                meal: {
                  complimentary: draft.meal?.complimentary ?? complimentarySides,
                  included,
                  extras: [...extras, extra],
                },
              });
            }}
            className="text-xs uppercase tracking-widest font-bold text-nayo-green"
          >
            Add extra
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="btn-gold px-5 py-2.5 text-xs tracking-widest uppercase font-bold"
        >
          Save item
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-nayo-black/50">
          Cancel
        </button>
      </div>
    </div>
  );
}

function OrdersBoard({
  orders,
  onUpdate,
}: {
  orders: Order[];
  onUpdate: (
    id: string,
    patch: { status?: OrderStatus; trackingNumber?: string; labelNote?: string }
  ) => void;
}) {
  const columns: { key: OrderStatus; title: string; hint: string }[] = [
    {
      key: "to_send",
      title: "Need to send / ready",
      hint: "New orders waiting for pickup or delivery",
    },
    {
      key: "sent",
      title: "Sent out",
      hint: "Delivery has gone out",
    },
    {
      key: "shipped",
      title: "Shipped with tracking",
      hint: "Label data and tracking number",
    },
    {
      key: "picked_up",
      title: "Picked up",
      hint: "Customer has collected the order",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="rounded-2xl bg-white p-4 min-h-[280px]">
          <h2 className="text-display text-xl font-bold text-nayo-black">
            {col.title}
          </h2>
          <p className="text-xs text-nayo-black/50 mb-4">{col.hint}</p>
          <div className="space-y-3">
            {orders
              .filter((order) => order.status === col.key)
              .map((order) => (
                <article
                  key={order.id}
                  className="rounded-xl border border-nayo-black/10 p-3 space-y-2"
                >
                  <p className="text-xs tracking-widest uppercase text-nayo-gold font-semibold">
                    {order.orderNumber}
                  </p>
                  <p className="font-semibold text-nayo-black">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-nayo-black/55">
                    {order.fulfillment === "pickup" ? "Pickup" : "Delivery"} · $
                    {order.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-nayo-black/55">{order.phone}</p>
                  <p className="text-xs text-nayo-black/55">{order.email}</p>
                  {order.address && (
                    <p className="text-xs text-nayo-black/55">
                      {order.address.line1}, {order.address.city},{" "}
                      {order.address.region} {order.address.postalCode}
                    </p>
                  )}
                  <ul className="text-xs text-nayo-black/70">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.qty} × {item.name}
                      </li>
                    ))}
                  </ul>
                  {col.key === "shipped" && (
                    <div className="space-y-2">
                      <input
                        defaultValue={order.trackingNumber}
                        placeholder="Tracking number"
                        onBlur={(e) =>
                          onUpdate(order.id, {
                            trackingNumber: e.target.value,
                          })
                        }
                        className="w-full border border-nayo-black/15 rounded-lg px-2 py-1.5 text-xs"
                      />
                      <textarea
                        defaultValue={order.labelNote}
                        placeholder="Label / carrier notes"
                        onBlur={(e) =>
                          onUpdate(order.id, { labelNote: e.target.value })
                        }
                        rows={2}
                        className="w-full border border-nayo-black/15 rounded-lg px-2 py-1.5 text-xs"
                      />
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {col.key === "to_send" && order.fulfillment === "delivery" && (
                      <button
                        type="button"
                        onClick={() => onUpdate(order.id, { status: "sent" })}
                        className="text-[10px] uppercase tracking-widest font-bold text-nayo-green"
                      >
                        Mark sent
                      </button>
                    )}
                    {col.key === "to_send" && order.fulfillment === "pickup" && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate(order.id, { status: "picked_up" })
                        }
                        className="text-[10px] uppercase tracking-widest font-bold text-nayo-green"
                      >
                        Mark picked up
                      </button>
                    )}
                    {col.key === "sent" && (
                      <button
                        type="button"
                        onClick={() => onUpdate(order.id, { status: "shipped" })}
                        className="text-[10px] uppercase tracking-widest font-bold text-nayo-green"
                      >
                        Add tracking
                      </button>
                    )}
                    {col.key !== "to_send" && (
                      <button
                        type="button"
                        onClick={() => onUpdate(order.id, { status: "to_send" })}
                        className="text-[10px] uppercase tracking-widest text-nayo-black/40"
                      >
                        Move back
                      </button>
                    )}
                  </div>
                </article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
