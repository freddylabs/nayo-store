export interface MealItem {
  id: string;
  name: string;
}

export interface MealExtra extends MealItem {
  price: number;
}

export interface MealConfig {
  included: MealItem[];
  complimentary: MealItem[];
  extras: MealExtra[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "fashion" | "food" | "health" | "culture";
  badge?: string;
  rating?: number;
  reviews?: number;
  meal?: MealConfig;
}

export const fashionProducts: Product[] = [
  {
    id: "f-001",
    name: "Royal Blue Embroidered Gown",
    description: "Mermaid gown in royal blue and turquoise, finished with gold filigree embroidery.",
    price: 198,
    image: "/apparel-royal-gown.jpg",
    category: "fashion",
    badge: "New",
    rating: 4.9,
    reviews: 28,
  },
  {
    id: "f-009",
    name: "Emerald Cape Dress",
    description: "Forest-green midi with gold embroidery, a structured collar, and cape sleeves.",
    price: 186,
    image: "/apparel-emerald-dress.jpg",
    category: "fashion",
    badge: "New",
    rating: 4.8,
    reviews: 21,
  },
  {
    id: "f-002",
    name: "Onyx Blazer",
    description: "Structured black blazer with hand-stitched gold trim. Tailored to perfection.",
    price: 158,
    image: "/fashion-blazer.png",
    category: "fashion",
    badge: "New Arrival",
    rating: 4.7,
    reviews: 98,
  },
  {
    id: "f-003",
    name: "Velvet Evening Gown",
    description: "Off-shoulder black velvet gown with a heritage-inspired silhouette.",
    price: 192,
    image: "/fashion-velvet.png",
    category: "fashion",
    rating: 4.9,
    reviews: 64,
  },
  {
    id: "f-004",
    name: "Heritage Wrap Set",
    description: "Two-piece kente-lined co-ord set. Tradition meets contemporary cut.",
    price: 118,
    image: "/culture-kente.png",
    category: "fashion",
    rating: 4.6,
    reviews: 81,
  },
];

export const apparelProducts = fashionProducts;

export const complimentarySides: MealItem[] = [
  { id: "shito", name: "Shito pepper sauce" },
  { id: "napkins", name: "Serviettes" },
  { id: "water", name: "Bottled water" },
];

const onTheHouse: MealItem[] = complimentarySides;

const sharedExtras: MealExtra[] = [
  { id: "plantain", name: "Fried plantain", price: 3.5 },
  { id: "rice", name: "Extra rice", price: 4 },
  { id: "salad", name: "Garden salad", price: 3 },
  { id: "egg", name: "Fried egg", price: 2 },
  { id: "kelewele", name: "Kelewele", price: 4.5 },
  { id: "coleslaw", name: "Coleslaw", price: 3 },
  { id: "drink", name: "Malt or soft drink", price: 2.5 },
  { id: "avocado", name: "Avocado", price: 2.5 },
];

export const foodProducts: Product[] = [
  {
    id: "fd-001",
    name: "Jollof and Beef",
    description:
      "Smoky party jollof with grilled beef.",
    price: 19.99,
    image: "/hero-food.png",
    category: "food",
    badge: "Fan Favourite",
    rating: 4.9,
    reviews: 320,
    meal: {
      included: [
        { id: "jollof", name: "Jollof rice" },
        { id: "beef", name: "Grilled beef" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "extra-beef", name: "Beef", price: 6 },
        ...sharedExtras,
      ],
    },
  },
  {
    id: "fd-008",
    name: "Jollof and Chicken",
    description:
      "Party jollof with grilled chicken and fried plantain.",
    price: 18.99,
    image: "/food-jollof-chicken.jpg",
    category: "food",
    badge: "New",
    rating: 4.9,
    reviews: 86,
    meal: {
      included: [
        { id: "jollof", name: "Jollof rice" },
        { id: "chicken", name: "Grilled chicken" },
        { id: "plantain", name: "Fried plantain" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "extra-chicken", name: "Chicken", price: 5.5 },
        ...sharedExtras,
      ],
    },
  },
  {
    id: "fd-009",
    name: "Jollof with Goat Meat",
    description:
      "Jollof with slow-cooked goat, fried plantain, and a fresh salad.",
    price: 20.99,
    image: "/food-jollof-goat.jpg",
    category: "food",
    badge: "New",
    rating: 4.8,
    reviews: 54,
    meal: {
      included: [
        { id: "jollof", name: "Jollof rice" },
        { id: "goat", name: "Goat meat stew" },
        { id: "plantain", name: "Fried plantain" },
        { id: "salad", name: "Garden salad" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "extra-goat", name: "Goat meat", price: 7 },
        ...sharedExtras,
      ],
    },
  },
  {
    id: "fd-010",
    name: "Kenkey Combo Platter",
    description:
      "Kenkey with fried fish, sausage, fried egg, plantain, and pepper sauce.",
    price: 19.99,
    image: "/food-kenkey-platter.jpg",
    category: "food",
    badge: "New",
    rating: 4.9,
    reviews: 24,
    meal: {
      included: [
        { id: "kenkey", name: "Kenkey" },
        { id: "fish", name: "Fried fish" },
        { id: "sausage", name: "Fried sausage" },
        { id: "egg", name: "Fried egg" },
        { id: "plantain", name: "Fried plantain" },
        { id: "pepper", name: "Pepper sauce" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "extra-fish", name: "Fried fish", price: 6 },
        { id: "extra-kenkey", name: "Kenkey", price: 4 },
        ...sharedExtras,
      ],
    },
  },
  {
    id: "fd-006",
    name: "Plantain Ampesi",
    description:
      "Boiled ripe plantain with garden egg stew, grilled fish, eggs, and avocado.",
    price: 19.99,
    image: "/food-ampesi-plantain.jpg",
    category: "food",
    badge: "New",
    rating: 4.9,
    reviews: 42,
    meal: {
      included: [
        { id: "plantain", name: "Boiled plantain" },
        { id: "stew", name: "Garden egg stew" },
        { id: "fish", name: "Grilled fish" },
        { id: "egg", name: "Boiled eggs" },
        { id: "avocado", name: "Avocado" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "fish", name: "Grilled fish", price: 6 },
        ...sharedExtras,
      ],
    },
  },
  {
    id: "fd-007",
    name: "Yam & Kontomire Ampesi",
    description:
      "Boiled yam and plantain with kontomire stew, boiled egg, and fresh avocado.",
    price: 18.99,
    image: "/food-ampesi-kontomire.jpg",
    category: "food",
    badge: "New",
    rating: 4.8,
    reviews: 37,
    meal: {
      included: [
        { id: "yam", name: "Boiled yam" },
        { id: "plantain", name: "Boiled plantain" },
        { id: "kontomire", name: "Kontomire stew" },
        { id: "egg", name: "Boiled egg" },
        { id: "avocado", name: "Avocado" },
      ],
      complimentary: onTheHouse,
      extras: [
        { id: "fish", name: "Grilled fish", price: 6 },
        ...sharedExtras,
      ],
    },
  },
];


export const healthProducts: Product[] = [
  {
    id: "h-010",
    name: "Nayo Nurse Scrub Dress, Teal & Green",
    description:
      "Mandarin-collar scrub dress with a waist tie, chest pocket, and hip pockets, embroidered with the Nayo logo. Shown in teal and green.",
    price: 118,
    image: "/health-nurse-dress.jpg",
    category: "health",
    badge: "New",
    rating: 4.9,
    reviews: 24,
  },
  {
    id: "h-001",
    name: "Charcoal Signature Scrubs",
    description: "Signature jogger scrubs with a tailored V-neck and utility pockets.",
    price: 128,
    image: "/health-scrub-charcoal.jpg",
    category: "health",
    rating: 4.9,
    reviews: 186,
  },
  {
    id: "h-011",
    name: "Nayo Clinical Stethoscope",
    description: "Dual-head stethoscope with a navy tube, black binaurals, and a polished chest piece.",
    price: 89,
    image: "/health-stethoscope.jpg",
    category: "health",
    badge: "New",
    rating: 4.8,
    reviews: 18,
  },
  {
    id: "h-012",
    name: "Nayo Nurse Notebook",
    description:
      "Folding clipboard folio with the Nayo Patient Care Pad, a pen loop, and storage pockets. Available in black, navy, teal, purple, pink, and grey.",
    price: 48,
    image: "/health-clipboard-folio.jpg",
    category: "health",
    badge: "New",
    rating: 4.8,
    reviews: 32,
  },
  {
    id: "h-023",
    name: "Nayo Nurse Scrub Dress, Black & Beige",
    description:
      "The same mandarin-collar scrub dress with the Nayo logo, in black and beige for a quieter uniform.",
    price: 118,
    image: "/health-nurse-dress-neutral.jpg",
    category: "health",
    badge: "New",
    rating: 4.9,
    reviews: 17,
  },
  {
    id: "h-024",
    name: "Nayo Nurse Scrub Dress, Turquoise",
    description:
      "Plain turquoise scrub dress with a mandarin collar, waist tie, chest pocket, and side slit. No logo.",
    price: 112,
    image: "/health-nurse-dress-teal.jpg",
    category: "health",
    rating: 4.8,
    reviews: 12,
  },
  {
    id: "h-025",
    name: "Nayo Nurse Scrub Dress, Emerald",
    description:
      "Plain emerald scrub dress with a mandarin collar, waist tie, and patch hip pockets. No logo.",
    price: 112,
    image: "/health-nurse-dress-green.jpg",
    category: "health",
    rating: 4.8,
    reviews: 11,
  },
  {
    id: "h-013",
    name: "Nurse Lanyard",
    description:
      "Breakaway lanyard with a lobster clip. Reads Nurses Make a Brighter Tomorrow, Care, Support, Empower, Heal.",
    price: 18,
    image: "/health-lanyard-teal.jpg",
    category: "health",
    rating: 4.7,
    reviews: 41,
  },
  {
    id: "h-014",
    name: "Nurse Badge Reel",
    description: "Retractable badge reel with a stethoscope-heart design, Nurse script, and key ring.",
    price: 14,
    image: "/health-badge-reel.jpg",
    category: "health",
    rating: 4.8,
    reviews: 27,
  },
  {
    id: "h-015",
    name: "Nurses Make a Difference Wristlet",
    description:
      "Beaded wristlet keychain with a gold clasp, heart EKG charm, and stethoscope charm.",
    price: 22,
    image: "/health-bead-keychain.jpg",
    category: "health",
    rating: 4.9,
    reviews: 19,
  },
  {
    id: "h-016",
    name: "Nurse Life Scrub Keychain",
    description: "Acrylic scrub-top keychain with Nurse Life lettering, a nurse-cap charm, and heart EKG charm.",
    price: 16,
    image: "/health-scrub-keychain.jpg",
    category: "health",
    rating: 4.8,
    reviews: 22,
  },
  {
    id: "h-017",
    name: "Compression Shift Socks",
    description: "Knee-high compression socks with a diagonal knit, cushioned sole, and ribbed cuff.",
    price: 22,
    image: "/health-socks-compression.jpg",
    category: "health",
    rating: 4.8,
    reviews: 54,
  },
  {
    id: "h-018",
    name: "Heartbeat Knee Socks",
    description: "Teal knee-high socks with a light heartbeat and heart graphic across the calf.",
    price: 20,
    image: "/health-socks-knee-heartbeat.jpg",
    category: "health",
    rating: 4.7,
    reviews: 16,
  },
  {
    id: "h-019",
    name: "Clinical Print Crew Socks",
    description: "Navy crew socks printed with stethoscopes, crosses, and heartbeat hearts.",
    price: 16,
    image: "/health-socks-clinical.jpg",
    category: "health",
    rating: 4.8,
    reviews: 29,
  },
  {
    id: "h-020",
    name: "Nurse Life Crew Socks",
    description: "Heather-grey crew socks with Nurse Life lettering, a red heart, and a stethoscope graphic.",
    price: 16,
    image: "/health-socks-nurse-life.jpg",
    category: "health",
    rating: 4.7,
    reviews: 21,
  },
  {
    id: "h-021",
    name: "Heartbeat Crew Socks",
    description: "White ribbed crew socks with a navy heartbeat-heart graphic at the cuff.",
    price: 16,
    image: "/health-socks-heartbeat.jpg",
    category: "health",
    rating: 4.6,
    reviews: 14,
  },
  {
    id: "h-022",
    name: "Shift Essentials Sock Pack",
    description: "Five-pack of ribbed crew socks in black, white, navy, teal, and burgundy.",
    price: 28,
    image: "/health-socks-essentials.jpg",
    category: "health",
    rating: 4.9,
    reviews: 37,
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
    rating: 4.8,
    reviews: 44,
  },
  {
    id: "c-002",
    name: "Kente Draped Robe",
    description: "Handwoven Ghanaian kente in black & gold. A garment of quiet power.",
    price: 198,
    image: "/culture-kente.png",
    category: "culture",
    badge: "Heritage Piece",
    rating: 4.9,
    reviews: 38,
  },
  {
    id: "c-003",
    name: "Brass Cuff Bracelet",
    description: "Cast brass cuff, etched with Adinkra symbols of strength and unity.",
    price: 89,
    image: "/hero-scrubs.png",
    category: "culture",
    rating: 4.6,
    reviews: 27,
  },
  {
    id: "c-004",
    name: "Woven Leather Clutch",
    description: "Hand-braided leather with gold clasp. Crafted by artisans in Lagos.",
    price: 195,
    image: "/hero-scrubs.png",
    category: "culture",
    badge: "Artisan Made",
    rating: 4.7,
    reviews: 33,
  },
];

export const allProducts = [
  ...fashionProducts,
  ...foodProducts,
  ...healthProducts,
  ...cultureProducts,
];
