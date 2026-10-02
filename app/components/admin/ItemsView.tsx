"use client";

import { useState } from "react";
import { ImagePlus, PackageOpen, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  complimentarySides,
  type MealExtra,
  type Product,
} from "@/app/data/products";
import { Drawer, EmptyState, cardClass, fieldClass, money } from "./ui";

type Category = "food" | "fashion" | "health";

const categories: { id: Category; label: string }[] = [
  { id: "food", label: "Foods" },
  { id: "fashion", label: "Apparel" },
  { id: "health", label: "Health" },
];

function emptyProduct(category: Category): Product {
  const base: Product = {
    id: `${category.slice(0, 2)}-${Date.now()}`,
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

export default function ItemsView({
  products,
  query,
  onSave,
}: {
  products: Product[];
  query: string;
  onSave: (next: Product[]) => Promise<boolean>;
}) {
  const [category, setCategory] = useState<Category>("food");
  const [editing, setEditing] = useState<Product | null>(null);

  const needle = query.toLowerCase();
  const shown = products.filter(
    (item) =>
      item.category === category &&
      (!needle ||
        `${item.name} ${item.description} ${item.badge ?? ""}`
          .toLowerCase()
          .includes(needle))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            Items and prices
          </h1>
          <p className="mt-1 text-sm text-nayo-black/55">
            What customers see in the shop. Changes go live as soon as you save.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(emptyProduct(category))}
          className="btn-gold inline-flex items-center justify-center gap-2 px-5 py-3 text-xs tracking-widest uppercase"
        >
          <Plus size={15} /> Add item
        </button>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {categories.map((c) => {
            const active = category === c.id;
            const count = products.filter((p) => p.category === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold border transition ${
                  active
                    ? "bg-nayo-green text-white border-nayo-green"
                    : "bg-white text-nayo-black/70 border-nayo-black/[0.07] hover:border-nayo-gold/50"
                }`}
              >
                {c.label}
                <span className={active ? "text-nayo-amber" : "opacity-60"}> ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {shown.length ? (
        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {shown.map((item) => (
            <article key={item.id} className={`${cardClass} overflow-hidden flex flex-col group`}>
              <div className="relative aspect-[4/3] bg-[#F4F1EA] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                {item.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-nayo-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-nayo-amber">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="font-semibold text-nayo-black leading-snug">{item.name}</p>
                <p className="mt-1 text-xs text-nayo-black/50 line-clamp-2">{item.description}</p>
                <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                  <p className="text-lg font-bold text-nayo-green">{money(item.price)}</p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      aria-label={`Edit ${item.name}`}
                      className="w-9 h-9 rounded-full border border-nayo-black/10 flex items-center justify-center text-nayo-black/60 hover:border-nayo-gold hover:text-nayo-black"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove “${item.name}” from the shop?`)) {
                          void onSave(products.filter((p) => p.id !== item.id));
                        }
                      }}
                      aria-label={`Remove ${item.name}`}
                      className="w-9 h-9 rounded-full border border-nayo-black/10 flex items-center justify-center text-red-500/70 hover:border-red-300 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className={cardClass}>
          <EmptyState
            icon={<PackageOpen size={24} />}
            title={query ? "No items match" : "No items here yet"}
            body={query ? "Try a different search." : "Add your first item to this collection."}
          />
        </div>
      )}

      {editing && (
        <ProductEditor
          key={editing.id}
          product={editing}
          onCancel={() => setEditing(null)}
          onSave={async (next) => {
            const exists = products.some((p) => p.id === next.id);
            const ok = await onSave(
              exists ? products.map((p) => (p.id === next.id ? next : p)) : [next, ...products]
            );
            if (ok) setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
      {children}
    </span>
  );
}

function ProductEditor({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(product);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const extras = draft.meal?.extras ?? [];
  const included = draft.meal?.included ?? [];

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await res.json()) as { url?: string };
    if (data.url) setDraft((current) => ({ ...current, image: data.url! }));
    setUploading(false);
  };

  const setExtras = (next: MealExtra[]) =>
    setDraft({
      ...draft,
      meal: {
        complimentary: draft.meal?.complimentary ?? complimentarySides,
        included,
        extras: next,
      },
    });

  return (
    <Drawer
      open
      title={product.name ? "Edit item" : "New item"}
      subtitle={product.name || "Fill in the details, then save."}
      onClose={onCancel}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            disabled={saving || !draft.name.trim()}
            onClick={async () => {
              setSaving(true);
              await onSave({ ...draft, name: draft.name.trim() });
              setSaving(false);
            }}
            className="btn-gold flex-1 py-3 text-xs tracking-widest uppercase disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save item"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-nayo-black/15 px-5 text-sm font-semibold text-nayo-black/60"
          >
            Cancel
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <label className="block">
          <Label>Photo</Label>
          <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-[#F4F1EA] border border-dashed border-nayo-black/15 cursor-pointer group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {draft.image && <img src={draft.image} alt="" className="h-full w-full object-cover" />}
            <span className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 py-2 text-xs font-semibold text-nayo-black shadow group-hover:bg-white">
              <ImagePlus size={14} /> {uploading ? "Uploading…" : "Upload a new photo"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
          </span>
        </label>

        <label className="block">
          <Label>Name</Label>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="e.g. Jollof and Beef"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <Label>Caption</Label>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="A short description customers will read"
            rows={3}
            className={fieldClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <Label>Price (USD)</Label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <Label>Badge</Label>
            <input
              value={draft.badge || ""}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              placeholder="New, Bestseller…"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <Label>Photo path</Label>
          <input
            value={draft.image}
            onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            placeholder="/food-kenkey-platter.jpg"
            className={fieldClass}
          />
        </label>

        {draft.category === "food" && (
          <div className="space-y-4 rounded-2xl border border-nayo-gold/25 bg-nayo-gold/[0.06] p-4">
            <label className="block">
              <Label>On the plate (separate with commas)</Label>
              <input
                value={included.map((item) => item.name).join(", ")}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    meal: {
                      complimentary: draft.meal?.complimentary ?? complimentarySides,
                      extras,
                      included: e.target.value
                        .split(",")
                        .map((name, i) => ({ id: `inc-${i}`, name: name.trim() }))
                        .filter((item) => item.name),
                    },
                  })
                }
                placeholder="Kenkey, fried fish, egg"
                className={fieldClass}
              />
            </label>

            <div>
              <Label>Paid extras</Label>
              <div className="space-y-2">
                {extras.map((extra, i) => (
                  <div key={extra.id} className="grid grid-cols-[1fr_96px_auto] gap-2">
                    <input
                      value={extra.name}
                      placeholder="Extra name"
                      onChange={(e) =>
                        setExtras(extras.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                      }
                      className={fieldClass}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={extra.price}
                      onChange={(e) =>
                        setExtras(
                          extras.map((x, idx) =>
                            idx === i ? { ...x, price: Number(e.target.value) || 0 } : x
                          )
                        )
                      }
                      className={fieldClass}
                    />
                    <button
                      type="button"
                      aria-label="Remove extra"
                      onClick={() => setExtras(extras.filter((_, idx) => idx !== i))}
                      className="w-10 rounded-xl border border-nayo-black/10 bg-white flex items-center justify-center text-nayo-black/45 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setExtras([...extras, { id: `extra-${Date.now()}`, name: "", price: 3 }])
                }
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-nayo-green"
              >
                <Plus size={13} /> Add extra
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
