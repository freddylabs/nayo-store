import type { Product } from "@/app/data/products";

export type OrderStatus = "to_send" | "sent" | "shipped" | "picked_up";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  note?: string;
}

export interface OrderAddress {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  fulfillment: "pickup" | "delivery";
  address?: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  labelNote?: string;
  updatedAt?: string;
}

export interface SiteCopy {
  landingHeadline: string;
  landingSubtitle: string;
  brandEyebrow: string;
  brandTitle: string;
  brandBody: string;
  brandCloser: string;
  shopEyebrow: string;
  shopFoodTitle: string;
  shopApparelTitle: string;
  shopHealthTitle: string;
  landingCloseEyebrow: string;
  landingCloseTitle: string;
  landingCloseBody: string;
  landingCloseCta: string;
  apparelEyebrow: string;
  apparelTitle: string;
  apparelIntro: string;
  apparelBand1Title: string;
  apparelBand1Body: string;
  apparelBand2Title: string;
  apparelBand2Body: string;
  apparelCollectionTitle: string;
  apparelCollectionBody: string;
  apparelCloseTitle: string;
  apparelCloseBody: string;
  foodEyebrow: string;
  foodTitle: string;
  foodIntro: string;
  foodBand1Title: string;
  foodBand1Body: string;
  foodBand2Title: string;
  foodBand2Body: string;
  foodCollectionTitle: string;
  foodCollectionBody: string;
  foodCloseTitle: string;
  foodCloseBody: string;
  healthEyebrow: string;
  healthTitle: string;
  healthIntro: string;
  healthCollectionTitle: string;
  healthCollectionBody: string;
  healthCloseTitle: string;
  healthCloseBody: string;
}

export const defaultCopy: SiteCopy = {
  landingHeadline: "WEAR IT. TASTE IT. LOVE IT.",
  landingSubtitle: "Style Meets Flavor.",
  brandEyebrow: "Fashion. Food. Culture.",
  brandTitle: "Live the NAYO Lifestyle.",
  brandBody:
    "NAYO is a brand inspired by family values, unity, heritage, and entrepreneurship. It represents a commitment to building a lasting legacy founded on excellence, integrity, and a passion for serving people.",
  brandCloser: "Style Meets Flavor.",
  shopEyebrow: "Fashion. Food. Culture.",
  shopFoodTitle: "Best Sellers",
  shopApparelTitle: "Newest in store",
  shopHealthTitle: "Latest collection",
  landingCloseEyebrow: "Nayo",
  landingCloseTitle: "Live the NAYO Lifestyle.",
  landingCloseBody:
    "From stylish clothing and healthcare uniforms to meals made with care — get in touch and we will help you find what you need.",
  landingCloseCta: "Get in touch",
  apparelEyebrow: "Nayo Apparel",
  apparelTitle: "Wear What Speaks For You.",
  apparelIntro:
    "NAYO Apparel is dedicated to producing fashionable, comfortable, and high-quality clothing for everyday wear and professional use.",
  apparelBand1Title: "Made for the night",
  apparelBand1Body:
    "Mermaid hems, cape sleeves, and gold embroidery that reads from across the floor — without shouting.",
  apparelBand2Title: "Cut with intention",
  apparelBand2Body:
    "Structured tailoring and heritage cloth, finished so the piece feels as considered as the occasion.",
  apparelCollectionTitle: "The collection",
  apparelCollectionBody:
    "Gowns, a tailored blazer, and a wrap set for evenings and occasions.",
  apparelCloseTitle: "Excellence in everything we do.",
  apparelCloseBody:
    "At NAYO, we are committed to excellence in everything we do. Whether through stylish apparel, professional healthcare uniforms, or delicious meals, we strive to deliver products and services that inspire confidence, celebrate culture, and exceed expectations.",
  foodEyebrow: "Nayo Foods",
  foodTitle: "Taste What Feeds The Soul.",
  foodIntro:
    "NAYO Foods delivers delicious meals prepared with quality ingredients and authentic flavors.",
  foodBand1Title: "On the plate",
  foodBand1Body:
    "Rice, protein, and the sides that belong with that dish. Drop anything you do not want — the plate price stays put.",
  foodBand2Title: "Make it extra",
  foodBand2Body:
    "More meat, extra plantain, a fried egg, kelewele, salad, or a malt. Open Add extra on a plate and pick only what you want.",
  foodCollectionTitle: "From the kitchen",
  foodCollectionBody:
    "Tap what stays on the plate, drop what you do not want, and add extras before it goes in the cart.",
  foodCloseTitle: "Come hungry. Leave looking after yourself.",
  foodCloseBody:
    "Catering, weekday plates, and the dishes you grew up on — cooked to order, packed to travel.",
  healthEyebrow: "Nayo Health",
  healthTitle: "Crafted For Every Shift.",
  healthIntro:
    "Modern scrubs and small essentials with a tailored fit, built for long hours and a confident presence on the floor.",
  healthCollectionTitle: "Shop the collection",
  healthCollectionBody: "Scrubs and lanyards that work as hard as you do.",
  healthCloseTitle: "Show up looking like you belong.",
  healthCloseBody:
    "Every shift is a promise. Dress for the work, the team, and the people who trust you with their care.",
};

export type CatalogProduct = Product;
