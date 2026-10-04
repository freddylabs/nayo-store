"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/app/data/products";

const ROTATE_MS = 3500;

/** Fills its parent with the product photo, fading between extra photos when there are any. */
export default function ProductPhoto({
  product,
  className,
  sizes,
}: {
  product: Product;
  className: string;
  sizes: string;
}) {
  const photos = [...new Set([product.image, ...(product.images ?? [])])].filter(Boolean);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setShown((i) => (i + 1) % photos.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <>
      {photos.map((src, i) => (
        <span
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === shown % photos.length ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={i === 0 ? product.name : ""}
            fill
            quality={95}
            className={className}
            sizes={sizes}
          />
        </span>
      ))}
    </>
  );
}
