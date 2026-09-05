"use client";

import Image from "next/image";
import { Scissors, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import SectionClose from "./SectionClose";
import { fashionProducts } from "@/app/data/products";

const looks = [
  {
    src: "/apparel-royal-gown.jpg",
    name: "Royal Blue Embroidered Gown",
    note: "Gold filigree mermaid",
  },
  {
    src: "/apparel-emerald-dress.jpg",
    name: "Emerald Cape Dress",
    note: "Cape sleeves, gold work",
  },
  {
    src: "/fashion-velvet.png",
    name: "Velvet Evening Gown",
    note: "Off-shoulder silhouette",
  },
  {
    src: "/fashion-blazer.png",
    name: "Onyx Blazer",
    note: "Tailored with gold trim",
  },
];

export default function FashionSection() {
  return (
    <section id="fashion" className="relative bg-nayo-white">
      <div className="relative bg-nayo-green overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-nayo-green via-nayo-green to-[#123224]" />

        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-14 pb-8">
          <p className="text-nayo-gold text-xs tracking-[0.25em] uppercase font-semibold">
            Nayo Apparel
          </p>
          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mt-3">
            Wear What Speaks For You.
          </h1>
          <p className="mt-4 text-white/80 max-w-lg text-sm sm:text-base">
            Evening gowns, tailored jackets, and heritage cuts — pieces made to
            hold a room and remember where they came from.
          </p>
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-16 pb-10 sm:pb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {looks.map((item) => (
              <figure
                key={item.src}
                className="relative rounded-2xl overflow-hidden bg-nayo-green border border-white/10"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    quality={95}
                    className="object-contain object-top"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-nayo-green via-nayo-green/20 to-nayo-green/10" />
                </div>
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <p className="text-white text-sm font-medium leading-snug">
                    {item.name}
                  </p>
                  <p className="text-white/70 text-[11px] mt-0.5">{item.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F7F4EE] border-y border-nayo-green/10">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <Sparkles size={18} className="text-nayo-green mb-3" />
            <h2 className="text-display text-xl font-bold text-nayo-black">
              Made for the night
            </h2>
            <p className="mt-2 text-sm text-nayo-black/60 leading-relaxed">
              Mermaid hems, cape sleeves, and gold embroidery that reads from
              across the floor — without shouting.
            </p>
          </div>
          <div>
            <Scissors size={18} className="text-nayo-green mb-3" />
            <h2 className="text-display text-xl font-bold text-nayo-black">
              Cut with intention
            </h2>
            <p className="mt-2 text-sm text-nayo-black/60 leading-relaxed">
              Structured tailoring and heritage cloth, finished so the piece
              feels as considered as the occasion.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto section-padding">
        <div className="mb-10">
          <h2 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            The <span className="gold-text">collection</span>
          </h2>
          <p className="mt-3 text-nayo-black/55 max-w-xl">
            Gowns, a tailored blazer, and a wrap set for evenings and
            occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fashionProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              imageFit="contain"
            />
          ))}
        </div>
      </div>

      <SectionClose
        eyebrow="Nayo Apparel"
        title="Walk in already looking like the story."
        body="Private orders, event pieces, and the cuts you keep for the nights that matter."
        href="/contact"
        cta="Book a fitting"
      />
    </section>
  );
}
