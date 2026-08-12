"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/app/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "dark" | "light";
}

export default function ProductCard({
  product,
  index = 0,
  variant = "dark",
}: ProductCardProps) {
  const { dispatch } = useCart();

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
  };

  const isFood = product.category === "food";
  const currency = isFood ? "$" : "$";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut" as any,
        delay: index * 0.1,
      }}
      className={`group relative rounded-2xl overflow-hidden product-card-hover border ${
        variant === "dark"
          ? "bg-nayo-charcoal-2 border-nayo-gold/10 hover:border-nayo-gold/30"
          : "bg-nayo-white/5 border-nayo-white/10 hover:border-nayo-gold/30"
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full gold-gradient text-[10px] font-bold tracking-widest uppercase text-nayo-black">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nayo-black/50 via-transparent to-transparent" />

        {/* Quick add overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-nayo-black/30 backdrop-blur-sm" />
          <button
            onClick={handleAdd}
            className="relative z-10 btn-gold flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-bold"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={14} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-display text-nayo-white text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-nayo-white/40 mt-1 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          </div>
          <span className="text-nayo-gold font-bold text-lg whitespace-nowrap text-display flex-shrink-0">
            {currency}{product.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-nayo-gold/30 text-xs tracking-widest uppercase text-nayo-gold font-semibold hover:gold-gradient hover:text-nayo-black hover:border-transparent transition-all duration-300"
          id={`add-to-cart-${product.id}`}
        >
          <ShoppingBag size={13} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
