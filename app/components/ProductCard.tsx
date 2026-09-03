"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Check } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "dark" | "light";
}

// Deterministic pseudo-rating so the storefront feels populated without a DB.
function ratingFor(id: string) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  const rating = 4.5 + (sum % 5) / 10; // 4.5 – 4.9
  const reviews = 40 + (sum % 160);
  return { rating: rating.toFixed(1), reviews };
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const { rating, reviews } = ratingFor(product.id);

  const handleAdd = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" as const, delay: index * 0.08 }}
      className="group surface-card overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-nayo-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-nayo-onyx/90 backdrop-blur-sm text-[9px] font-semibold tracking-[0.18em] uppercase text-nayo-cream">
            {product.badge}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-nayo-cream/85 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-300 hover:scale-110"
        >
          <Heart
            size={16}
            className={`transition-colors duration-300 ${
              wished ? "fill-nayo-gold text-nayo-gold" : "text-nayo-ink/60"
            }`}
          />
        </button>

        {/* Quick add on hover (desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleAdd}
            className="btn-dark w-full py-2.5 text-[11px] tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to bag`}
          >
            {added ? <Check size={14} /> : <ShoppingBag size={13} />}
            {added ? "Added" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-nayo-gold">{product.category}</span>
          <span className="flex items-center gap-1 text-[11px] text-nayo-ink/50">
            <Star size={11} className="fill-nayo-gold text-nayo-gold" />
            {rating}
            <span className="text-nayo-ink/30">({reviews})</span>
          </span>
        </div>

        <h3 className="font-display text-lg font-semibold text-nayo-ink leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-nayo-ink/50 leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-3 mt-1 border-t border-nayo-ink/8">
          <span className="text-lg font-semibold text-nayo-ink font-display">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            id={`add-to-cart-${product.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-nayo-ink/15 text-[11px] tracking-[0.12em] uppercase text-nayo-ink font-semibold hover:bg-nayo-onyx hover:text-nayo-cream hover:border-nayo-onyx transition-all duration-300"
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            {added ? "Added" : "Add to Bag"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
