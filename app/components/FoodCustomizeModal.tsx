"use client";

import { useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";
import FoodCustomize, { useMealSelection } from "./FoodCustomize";
import { mealCartPayload } from "@/app/lib/meal";

export default function FoodCustomizeModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { dispatch } = useCart();
  const { dropped, extras, toggleDropped, toggleExtra } = useMealSelection();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: mealCartPayload(product, dropped, extras),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-nayo-white p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-nayo-gold font-semibold">
              Build your plate
            </p>
            <h2 className="text-display text-2xl font-bold text-nayo-black mt-1">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-nayo-black/15 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <FoodCustomize
          product={product}
          dropped={dropped}
          extras={extras}
          onToggleDropped={toggleDropped}
          onToggleExtra={toggleExtra}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-full gold-gradient text-xs tracking-widest uppercase text-nayo-black font-bold"
        >
          <ShoppingCart size={14} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
