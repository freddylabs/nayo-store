export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "fashion" | "food" | "culture";
  badge?: string;
}

export const fashionProducts: Product[] = [
  {
    id: "f-001",
    name: "Amber Silk Maxi",
    description: "Flowing silk-blend maxi dress with structural shoulders. A statement piece.",
    price: 385,
    image: "/hero-fashion.png",
    category: "fashion",
    badge: "Bestseller",
  },
  {
    id: "f-002",
    name: "Onyx Blazer",
    description: "Structured black blazer with hand-stitched gold trim. Tailored to perfection.",
    price: 495,
    image: "/fashion-blazer.png",
    category: "fashion",
    badge: "New Arrival",
  },
  {
    id: "f-003",
    name: "Velvet Evening Gown",
    description: "Off-shoulder black velvet gown with a heritage-inspired silhouette.",
    price: 620,
    image: "/fashion-velvet.png",
    category: "fashion",
  },
  {
    id: "f-004",
    name: "Heritage Wrap Set",
    description: "Two-piece kente-lined co-ord set. Tradition meets contemporary cut.",
    price: 310,
    image: "/culture-kente.png",
    category: "fashion",
  },
  {
    id: "f-005",
    name: "Nayo Signature Scrubs",
    description: "Premium medical scrubs offering unparalleled comfort and a tailored fit.",
    price: 120,
    image: "/hero-scrubs.png",
    category: "fashion",
    badge: "Medical",
  },
  {
    id: "f-006",
    name: "Athletic Club Jersey",
    description: "Breathable mesh jersey featuring the iconic Nayo crest. Streetwear essential.",
    price: 85,
    image: "/jersey.png",
    category: "fashion",
  },
  {
    id: "f-007",
    name: "Tailored Lab Coat",
    description: "Professional medical coat with structural shoulders and gold-button details.",
    price: 165,
    image: "/labcoat.png",
    category: "fashion",
    badge: "Medical",
  },
  {
    id: "f-008",
    name: "Classic Polo",
    description: "Everyday luxury polo with subtle gold embroidery. Perfect for corporate casual.",
    price: 110,
    image: "/polo.png",
    category: "fashion",
  },
];

export const foodProducts: Product[] = [
  {
    id: "fd-001",
    name: "Jollof & Fried Chicken",
    description: "Signature smoky jollof rice with crispy marinated fried chicken. Feeds 2.",
    price: 24.99,
    image: "/hero-food.png",
    category: "food",
    badge: "Fan Favourite",
  },
  {
    id: "fd-002",
    name: "Suya Platter",
    description: "Chargrilled suya skewers, spiced with yaji, served with grilled peppers.",
    price: 18.99,
    image: "/suya.png",
    category: "food",
    badge: "Chef's Pick",
  },
  {
    id: "fd-003",
    name: "Classic Fried Rice",
    description: "Sizzling wok-tossed fried rice with diced vegetables and savory hot dog slices.",
    price: 19.99,
    image: "/friedrice.jpg",
    category: "food",
  },
  {
    id: "fd-004",
    name: "Nayo Meal Box",
    description: "Perfectly portioned rice, glazed chicken, and roasted veggies in a premium box.",
    price: 29.99,
    image: "/mealbox.png",
    category: "food",
    badge: "Limited",
  },
];

export const cultureProducts: Product[] = [
  {
    id: "c-001",
    name: "Beaded Heritage Necklace",
    description: "Hand-beaded onyx & gold necklace. Each piece is one-of-a-kind.",
    price: 145,
    image: "/hero-scrubs.png",
    category: "culture",
    badge: "Handcrafted",
  },
  {
    id: "c-002",
    name: "Kente Draped Robe",
    description: "Handwoven Ghanaian kente in black & gold. A garment of quiet power.",
    price: 275,
    image: "/culture-kente.png",
    category: "culture",
    badge: "Heritage Piece",
  },
  {
    id: "c-003",
    name: "Brass Cuff Bracelet",
    description: "Cast brass cuff, etched with Adinkra symbols of strength and unity.",
    price: 89,
    image: "/hero-scrubs.png",
    category: "culture",
  },
  {
    id: "c-004",
    name: "Woven Leather Clutch",
    description: "Hand-braided leather with gold clasp. Crafted by artisans in Lagos.",
    price: 195,
    image: "/hero-scrubs.png",
    category: "culture",
    badge: "Artisan Made",
  },
];

export const allProducts = [...fashionProducts, ...foodProducts, ...cultureProducts];
