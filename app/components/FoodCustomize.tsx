"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";
import type { Product } from "@/app/data/products";
import { mealUnitPrice } from "@/app/lib/meal";

export function useMealSelection() {
  const [dropped, setDropped] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);

  const toggleDropped = (id: string) => {
    setDropped((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleExtra = (id: string) => {
    setExtras((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return { dropped, extras, toggleDropped, toggleExtra };
}

export default function FoodCustomize({
  product,
  dropped,
  extras,
  onToggleDropped,
  onToggleExtra,
  openExtras = false,
}: {
  product: Product;
  dropped: string[];
  extras: string[];
  onToggleDropped: (id: string) => void;
  onToggleExtra: (id: string) => void;
  openExtras?: boolean;
}) {
  const [extrasOpen, setExtrasOpen] = useState(openExtras);
  const meal = product.meal;

  useEffect(() => {
    if (openExtras) setExtrasOpen(true);
  }, [openExtras]);

  if (!meal) return null;

  const total = mealUnitPrice(product, extras);
  const extraLabel =
    extras.length === 0
      ? "Add extra"
      : `Add extra · ${extras.length} selected`;

  return (
    <div className="flex flex-col flex-1 text-left">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-nayo-gold mb-2">
          On the plate
        </p>
        <p className="text-[11px] text-nayo-black/45 mb-2">
          Uncheck anything you want left off. The plate price stays the same.
        </p>
        <div className="flex flex-wrap gap-2">
          {meal.included.map((item) => {
            const kept = !dropped.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleDropped(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  kept
                    ? "border-nayo-green bg-nayo-green/10 text-nayo-green"
                    : "border-nayo-black/15 text-nayo-black/35 line-through"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        {meal.complimentary.length > 0 && (
          <p className="mt-3 text-[11px] text-nayo-black/45 leading-relaxed">
            Served free:{" "}
            {meal.complimentary.map((item) => item.name).join(", ")}.
          </p>
        )}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => setExtrasOpen((open) => !open)}
          className="w-full flex items-center justify-between gap-3 rounded-xl border border-nayo-black/15 px-3.5 py-2.5 text-xs"
          aria-expanded={extrasOpen}
        >
          <span className="font-semibold tracking-[0.14em] uppercase text-nayo-gold">
            {extraLabel}
          </span>
          <ChevronDown
            size={16}
            className={`text-nayo-black/50 transition-transform ${
              extrasOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {extrasOpen && (
          <div className="mt-2 space-y-1.5 rounded-xl border border-nayo-black/10 p-2">
            {meal.extras.map((item) => {
              const selected = extras.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggleExtra(item.id)}
                  className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs border transition-colors ${
                    selected
                      ? "border-nayo-gold bg-nayo-gold/10 text-nayo-black"
                      : "border-transparent text-nayo-black/70 hover:bg-nayo-black/5"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      selected
                        ? "border-nayo-gold bg-nayo-gold text-nayo-black"
                        : "border-nayo-black/20"
                    }`}
                  >
                    {selected ? <Minus size={10} /> : <Plus size={10} />}
                  </span>
                  <span className="flex-1 text-left">{item.name}</span>
                  <span className="font-semibold">+${item.price.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-3" />

      <p className="text-sm font-bold text-nayo-black flex justify-between">
        <span>Plate total</span>
        <span className="text-nayo-gold">${total.toFixed(2)}</span>
      </p>
    </div>
  );
}
