"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";
import FoodCustomizeModal from "./FoodCustomizeModal";

const categoryHref: Record<Product["category"], string> = {
  food: "/food",
  health: "/health",
  fashion: "/fashion",
  culture: "/",
};

export default function ShopProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const [saved, setSaved] = useState(false);
  const [customize, setCustomize] = useState(false);
  const filled = Math.round(product.rating ?? 0);
  const isHealth = product.category === "health";
  const isFood = product.category === "food";
  const brand =
    product.category === "food"
      ? "Nayo Foods"
      : product.category === "fashion"
        ? "Nayo Apparel"
        : product.category === "health"
          ? "Nayo Health"
          : undefined;

  const handleAdd = () => {
    if (product.meal) {
      setCustomize(true);
      return;
    }
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
    <article className="group min-w-[168px] w-[168px] sm:min-w-0 sm:w-auto">
      <div
        className={`relative aspect-[4/5] rounded-xl overflow-hidden ${
          isHealth ? "bg-white" : "bg-[#F3F4F6]"
        }`}
      >
        <Link
          href={`${categoryHref[product.category]}#product-${product.id}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            quality={95}
            className={
              isHealth
                ? "object-cover object-top transition-transform duration-500 group-hover:scale-105"
                : "object-cover object-center transition-transform duration-500 group-hover:scale-105"
            }
            sizes="(max-width: 640px) 168px, (max-width: 1024px) 45vw, 280px"
          />
        </Link>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-nayo-black/50 hover:text-nayo-gold"
          aria-label={saved ? `Unsave ${product.name}` : `Save ${product.name}`}
        >
          <Heart size={15} className={saved ? "fill-nayo-gold text-nayo-gold" : ""} />
        </button>
      </div>

      <div className="pt-3 space-y-1">
        {brand && (
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-nayo-gold">
            {brand}
          </p>
        )}
        <h3
          className={`font-medium text-nayo-black leading-snug line-clamp-2 ${
            brand ? "text-xs min-h-[2rem]" : "text-sm min-h-[2.5rem]"
          }`}
        >
          <Link
            href={`${categoryHref[product.category]}#product-${product.id}`}
            className="hover:text-nayo-green transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        {product.rating && product.reviews ? (
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
            <span className="text-[11px] text-nayo-black/45">({product.reviews})</span>
          </div>
        ) : null}
        <p className="text-sm font-bold text-nayo-black">
          ${product.price.toFixed(2)}
        </p>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[11px] font-semibold tracking-wide text-nayo-green hover:text-nayo-gold uppercase inline-flex items-center gap-1"
        >
          <ShoppingCart size={12} />
          {isFood ? "Customize" : "Add to cart"}
        </button>
      </div>

      {customize && product.meal && (
        <FoodCustomizeModal
          product={product}
          onClose={() => setCustomize(false)}
        />
      )}
    </article>
  );
}
