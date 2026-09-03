"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";

export default function ShopProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [saved, setSaved] = useState(false);
  const rating = product.rating ?? 4.8;
  const reviews = product.reviews ?? 48;
  const filled = Math.round(rating);

  const handleAdd = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    });
  };

  return (
    <article className="group min-w-[180px] w-[180px] sm:min-w-0 sm:w-auto">
      <div className="relative aspect-square rounded-xl bg-[#F3F4F6] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 180px, 20vw"
        />
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-nayo-black/50 hover:text-nayo-gold"
          aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`}
        >
          <Heart size={15} className={saved ? "fill-nayo-gold text-nayo-gold" : ""} />
        </button>
      </div>

      <div className="pt-3 space-y-1.5">
        <h3 className="text-sm font-medium text-nayo-black leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < filled
                  ? "fill-nayo-gold text-nayo-gold"
                  : "fill-nayo-black/15 text-nayo-black/15"
              }
            />
          ))}
          <span className="text-[11px] text-nayo-black/45">({reviews})</span>
        </div>
        <p className="text-sm font-bold text-nayo-black">
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] font-semibold tracking-wide text-nayo-green hover:text-nayo-gold uppercase inline-flex items-center gap-1"
        >
          <ShoppingCart size={12} />
          Add to cart
        </button>
      </div>
    </article>
  );
}
