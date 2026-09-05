"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";
import FoodCustomize, { useMealSelection } from "./FoodCustomize";
import MealExtrasPrompt from "./MealExtrasPrompt";
import { mealCartPayload } from "@/app/lib/meal";

export default function FoodOrderCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { dispatch } = useCart();
  const { dropped, extras, toggleDropped, toggleExtra } = useMealSelection();
  const [askExtras, setAskExtras] = useState(false);
  const [openExtras, setOpenExtras] = useState(false);
  const [offeredExtras, setOfferedExtras] = useState(false);

  const addToCart = (declinedExtras: boolean) => {
    dispatch({
      type: "ADD_ITEM",
      payload: mealCartPayload(product, dropped, extras, declinedExtras),
    });
  };

  const handleAdd = () => {
    if (
      extras.length === 0 &&
      (product.meal?.extras.length ?? 0) > 0 &&
      !offeredExtras
    ) {
      setAskExtras(true);
      return;
    }
    addToCart(extras.length === 0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="rounded-2xl border border-nayo-green/20 bg-nayo-white overflow-hidden h-full flex flex-col"
    >
      <div className="relative aspect-[5/4] bg-nayo-green overflow-hidden">
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full gold-gradient text-[10px] font-bold tracking-widest uppercase text-nayo-black">
            {product.badge}
          </div>
        )}
        <Image
          src={product.image}
          alt={product.name}
          fill
          quality={95}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-display text-nayo-black text-xl leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-nayo-black/50 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          </div>
          <span className="text-nayo-gold font-bold text-lg whitespace-nowrap text-display">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <FoodCustomize
          product={product}
          dropped={dropped}
          extras={extras}
          onToggleDropped={toggleDropped}
          onToggleExtra={toggleExtra}
          openExtras={openExtras}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3 rounded-full gold-gradient text-xs tracking-widest uppercase text-nayo-black font-bold"
        >
          <ShoppingCart size={14} />
          Add to cart
        </button>
      </div>

      <MealExtrasPrompt
        open={askExtras}
        body={`Would you like to add anything extra to your ${product.name}? More meat, plantain, a drink, or other sides are available.`}
        confirmLabel="Yes, add extras"
        declineLabel="No thank you, add to cart"
        onConfirm={() => {
          setAskExtras(false);
          setOfferedExtras(true);
          setOpenExtras(true);
        }}
        onDecline={() => {
          setAskExtras(false);
          addToCart(true);
        }}
      />
    </motion.article>
  );
}
