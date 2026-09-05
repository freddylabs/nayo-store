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
    id: "fd-003",
    name: "Classic Fried Rice",
    description:
      "Wok-tossed fried rice with peppers, peas, corn, and spring onion.",
    price: 15.99,
    image: "/food-fried-rice.jpg",
    category: "food",
    rating: 4.7,
    reviews: 156,
    meal: {
      included: [{ id: "fried-rice", name: "Vegetable fried rice" }],
      complimentary: onTheHouse,
      extras: [
        { id: "extra-chicken", name: "Grilled chicken", price: 5.5 },
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
    id: "h-001",
    name: "Charcoal Signature Scrubs",
    description: "Charcoal jogger scrubs with a tailored V-neck and utility pockets.",
    price: 128,
    image: "/health-scrub-charcoal.jpg",
    category: "health",
    badge: "New",
    rating: 4.9,
    reviews: 186,
  },
  {
    id: "h-002",
    name: "Sage Clinical Set",
    description: "Sage green shift set with cargo pockets and a comfortable jogger cut.",
    price: 128,
    image: "/health-scrub-sage.jpg",
    category: "health",
    badge: "New",
    rating: 4.8,
    reviews: 94,
  },
  {
    id: "h-003",
    name: "Sky Blue Shift Set",
    description: "Light blue scrubs with a clean V-neck and elastic-cuff joggers.",
    price: 132,
    image: "/health-scrub-sky.jpg",
    category: "health",
    rating: 4.8,
    reviews: 61,
  },
  {
    id: "h-004",
    name: "Teal & Burgundy Cargo Scrubs",
    description: "Modern cargo scrubs in teal and burgundy, made for movement on the floor.",
    price: 136,
    image: "/health-duo-teal-burgundy.jpg",
    category: "health",
    rating: 4.9,
    reviews: 48,
  },
  {
    id: "h-005",
    name: "Navy, Black & Burgundy Set",
    description: "Core colorways for the team: navy, black, and burgundy utility scrubs.",
    price: 140,
    image: "/health-team-three.jpg",
    category: "health",
    rating: 4.7,
    reviews: 39,
  },
  {
    id: "h-006",
    name: "Nayo Health Ensemble",
    description: "The full color story — six looks, one collection, built for every shift.",
    price: 148,
    image: "/health-team-group.jpg",
    category: "health",
    badge: "Collection",
    rating: 4.9,
    reviews: 72,
  },
  {
    id: "h-008",
    name: "Nursing Student Lanyard",
    description: "Black medical-print lanyard with badge reel and vertical ID holder.",
    price: 50,
    image: "/health-nurse-lanyard.jpg",
    category: "health",
    badge: "New",
    rating: 4.7,
    reviews: 41,
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
