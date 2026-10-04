import type { Product } from "@/app/data/products";

export type OrderStatus = "to_send" | "sent" | "shipped" | "delivered" | "picked_up";

export const orderStatuses: OrderStatus[] = [
  "to_send",
  "sent",
  "shipped",
  "delivered",
  "picked_up",
];

/** How a delivery order travels: our own driver, or shipped with UPS. */
export type DeliveryMethod = "local" | "ups";

export type PaymentStatus = "pending" | "paid";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  note?: string;
  image?: string;
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
  /** Orders saved before payment tracking existed have no value and count as paid. */
  paymentStatus?: PaymentStatus;
  paidAt?: string;
  receiptSentAt?: string;
  deliveryMethod?: DeliveryMethod;
  trackingNumber?: string;
  labelNote?: string;
  shippedAt?: string;
  deliveredAt?: string;
  shippingEmailSentAt?: string;
  updatedAt?: string;
}

export function isOrderPaid(order: Order): boolean {
  return order.paymentStatus !== "pending";
}

export function isOrderDone(order: Order): boolean {
  return order.status === "delivered" || order.status === "picked_up";
}

/** A paid delivery order where the owner has not yet chosen driver or UPS. */
export function needsDeliveryChoice(order: Order): boolean {
  return (
    isOrderPaid(order) &&
    order.fulfillment === "delivery" &&
    !order.deliveryMethod &&
    order.status === "to_send"
  );
}

export function upsTrackingUrl(trackingNumber: string): string {
  return `https://www.ups.com/track?loc=en_US&tracknum=${encodeURIComponent(
    trackingNumber.replace(/\s+/g, "")
  )}`;
}

/** UPS numbers usually look like 1Z followed by 16 letters or digits. */
export function looksLikeUpsNumber(trackingNumber: string): boolean {
  return /^1Z[0-9A-Z]{16}$/i.test(trackingNumber.replace(/\s+/g, ""));
}

/** The steps an order moves through, based on how it reaches the customer. */
export function orderSteps(order: Order): OrderStatus[] {
  if (order.fulfillment === "pickup") return ["to_send", "picked_up"];
  if (order.deliveryMethod === "ups") return ["to_send", "shipped", "delivered"];
  return ["to_send", "sent", "delivered"];
}

/** Wording customers see for each status. */
export function customerStatusLabel(order: Order): string {
  switch (order.status) {
    case "to_send":
      return order.fulfillment === "pickup" ? "Being prepared" : "Preparing your order";
    case "sent":
      return "Out for delivery";
    case "shipped":
      return "Shipped with UPS";
    case "delivered":
      return "Delivered";
    case "picked_up":
      return "Picked up";
  }
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
  heroFoodLabel: string;
  heroFoodBrand: string;
  heroFoodCta: string;
  heroFoodCaption1: string;
  heroFoodCaption2: string;
  heroFoodCaption3: string;
  heroHealthLabel: string;
  heroHealthBrand: string;
  heroHealthCta: string;
  heroHealthCaption1: string;
  heroHealthCaption2: string;
  heroHealthCaption3: string;
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonialsTitleGold: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutBody1: string;
  aboutBody2: string;
  aboutBody3: string;
  aboutVision: string;
  aboutMission: string;
  aboutValuesTitle: string;
  aboutValuesIntro: string;
  aboutFutureTitle: string;
  aboutFutureBody: string;
  aboutCloseTitle: string;
  aboutCloseBody: string;
  contactEyebrow: string;
  contactTitle: string;
  contactIntro: string;
  contactReplyNote: string;
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
    "From stylish clothing and healthcare uniforms to meals made with care, get in touch and we will help you find what you need.",
  landingCloseCta: "Get in touch",
  apparelEyebrow: "Nayo Apparel",
  apparelTitle: "Wear What Speaks For You.",
  apparelIntro:
    "NAYO Apparel is dedicated to producing fashionable, comfortable, and high-quality clothing for everyday wear and professional use.",
  apparelBand1Title: "Made for the night",
  apparelBand1Body:
    "Mermaid hems, cape sleeves, and gold embroidery that reads from across the floor, without shouting.",
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
    "Rice, protein, and the sides that belong with that dish. Drop anything you do not want, the plate price stays put.",
  foodBand2Title: "Make it extra",
  foodBand2Body:
    "More meat, extra plantain, a fried egg, kelewele, salad, or a malt. Open Add extra on a plate and pick only what you want.",
  foodCollectionTitle: "From the kitchen",
  foodCollectionBody:
    "Tap what stays on the plate, drop what you do not want, and add extras before it goes in the cart.",
  foodCloseTitle: "Come hungry. Leave looking after yourself.",
  foodCloseBody:
    "Catering, weekday plates, and the dishes you grew up on, cooked to order, packed to travel.",
  healthEyebrow: "Nayo Health",
  healthTitle: "Crafted For Every Shift.",
  healthIntro:
    "Nurse dresses, signature scrubs, and shift essentials with a tailored fit, built for long hours and a confident presence on the floor.",
  healthCollectionTitle: "Shop the collection",
  healthCollectionBody:
    "Uniforms, clipboards, stethoscopes, and the small pieces that finish a shift.",
  healthCloseTitle: "Show up looking like you belong.",
  healthCloseBody:
    "Every shift is a promise. Dress for the work, the team, and the people who trust you with their care.",
  heroFoodLabel: "Food",
  heroFoodBrand: "Nayo Foods",
  heroFoodCta: "Explore Foods",
  heroFoodCaption1: "Jollof and beef",
  heroFoodCaption2: "Plantain Ampesi, grilled fish & eggs",
  heroFoodCaption3: "Yam, plantain & kontomire stew",
  heroHealthLabel: "Health",
  heroHealthBrand: "Nayo Health",
  heroHealthCta: "Shop Health",
  heroHealthCaption1: "Crafted For Every Shift",
  heroHealthCaption2: "Nurse scrub dresses for every shift",
  heroHealthCaption3: "Signature scrubs",
  testimonialsEyebrow: "What Our Customers Say",
  testimonialsTitle: "Loved by Those Who",
  testimonialsTitleGold: "Live It.",
  aboutEyebrow: "Our story",
  aboutTitle: "A legacy of family, excellence, and care.",
  aboutBody1:
    "NAYO was founded with a vision to create more than just a business, it was created to build a legacy. Rooted in strong family values and a passion for excellence, NAYO brings together two everyday essentials: quality fashion and great food under one trusted brand.",
  aboutBody2:
    "We believe that what people wear and what they eat should reflect confidence, quality, and care. Every product and service we offer is designed to enrich lives, celebrate culture, and create meaningful experiences for our customers.",
  aboutBody3:
    "As we grow, our commitment remains the same: to deliver exceptional products, outstanding service, and lasting value while making a positive impact in the communities we serve.",
  aboutVision:
    "To become a trusted lifestyle brand recognized for delivering quality fashion, professional apparel, and exceptional food experiences that enrich everyday life.",
  aboutMission:
    "To provide stylish clothing, professional uniforms, and delicious food that inspire confidence, celebrate culture, and bring people together through outstanding quality and service.",
  aboutValuesTitle: "Our core values",
  aboutValuesIntro: "The standards we cut, cook, and serve by.",
  aboutFutureTitle: "Future growth",
  aboutFutureBody:
    "NAYO aims to grow into new collections and services, while staying one trusted brand.",
  aboutCloseTitle: "Live the NAYO Lifestyle.",
  aboutCloseBody:
    "Shop our apparel, food, and health collections, or get in touch if you need something specific.",
  contactEyebrow: "Nayo Ltd.",
  contactTitle: "We would love to hear from you.",
  contactIntro:
    "Questions about an order, a meal, apparel, or uniforms, send us a note and we will get back to you.",
  contactReplyNote: "We aim to reply within one working day.",
};

export type CatalogProduct = Product;
