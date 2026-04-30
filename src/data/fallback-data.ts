import type {
  BusinessHours,
  Product,
  ProductCategory,
  Promotion,
  Review,
} from "@/types";

export const categoryLabels: Record<ProductCategory, string> = {
  smash: "Smash Burgers",
  sides: "Acompañantes",
  drinks: "Bebidas",
  combos: "Combos",
};

export const fallbackCategories: ProductCategory[] = [
  "smash",
  "sides",
  "drinks",
  "combos",
];

export const fallbackProducts: Product[] = [
  {
    id: "p-01",
    slug: "classic-smash",
    name: "Classic Smash",
    description: "Doble carne smash, queso cheddar y salsa de la casa.",
    price: 5.9,
    imageUrl: "/images/products/classic-smash.jpg",
    category: "smash",
    isAvailable: true,
    extras: [
      { id: "e-queso", name: "Queso extra", price: 0.8 },
      { id: "e-tocino", name: "Tocino", price: 1.2 },
    ],
  },
  {
    id: "p-02",
    slug: "smoky-bacon-smash",
    name: "Smoky Bacon Smash",
    description: "Sabor ahumado con tocino crujiente y cebolla caramelizada.",
    price: 6.9,
    imageUrl: "/images/products/smoky-bacon-smash.jpg",
    category: "smash",
    isAvailable: true,
    extras: [
      { id: "e-jalapeno", name: "Jalapeños", price: 0.6 },
      { id: "e-aro-cebolla", name: "Aros de cebolla", price: 1.1 },
    ],
  },
  {
    id: "p-03",
    slug: "bbq-smash",
    name: "BBQ Smash",
    description: "Salsa BBQ artesanal, pepinillos y pan brioche tostado.",
    price: 6.5,
    imageUrl: "/images/products/bbq-smash.jpg",
    category: "smash",
    isAvailable: true,
    extras: [{ id: "e-doble-carne", name: "Doble carne", price: 2 }],
  },
  {
    id: "p-04",
    slug: "crispy-fries",
    name: "Crispy Fries",
    description: "Papas doradas con toque de paprika y sal marina.",
    price: 2.5,
    imageUrl: "/images/products/crispy-fries.jpg",
    category: "sides",
    isAvailable: true,
    extras: [{ id: "e-cheddar-fries", name: "Salsa cheddar", price: 0.9 }],
  },
  {
    id: "p-05",
    slug: "loaded-fries",
    name: "Loaded Fries",
    description: "Papas con queso, tocino y cebollín fresco.",
    price: 3.9,
    imageUrl: "/images/products/loaded-fries.jpg",
    category: "sides",
    isAvailable: true,
    extras: [{ id: "e-guacamole", name: "Guacamole", price: 1.1 }],
  },
  {
    id: "p-06",
    slug: "cola-artesanal",
    name: "Cola Artesanal",
    description: "Bebida fría de autor, ideal para acompañar burgers.",
    price: 1.8,
    imageUrl: "/images/products/cola-artesanal.jpg",
    category: "drinks",
    isAvailable: true,
  },
  {
    id: "p-07",
    slug: "limonada-mango",
    name: "Limonada Mango",
    description: "Refrescante limonada con pulpa natural de mango.",
    price: 2.2,
    imageUrl: "/images/products/limonada-mango.jpg",
    category: "drinks",
    isAvailable: true,
  },
  {
    id: "p-08",
    slug: "combo-smash-classic",
    name: "Combo Smash Classic",
    description: "Classic Smash + Crispy Fries + bebida.",
    price: 9.5,
    imageUrl: "/images/products/combo-classic.jpg",
    category: "combos",
    isAvailable: true,
  },
  {
    id: "p-09",
    slug: "combo-smoky",
    name: "Combo Smoky",
    description: "Smoky Bacon Smash + Loaded Fries + bebida.",
    price: 10.9,
    imageUrl: "/images/products/combo-smoky.jpg",
    category: "combos",
    isAvailable: true,
  },
  {
    id: "p-10",
    slug: "mini-smash",
    name: "Mini Smash",
    description: "Versión pequeña para degustación rápida en feria.",
    price: 4.3,
    imageUrl: "/images/products/mini-smash.jpg",
    category: "smash",
    isAvailable: true,
  },
];

export const fallbackPromotions: Promotion[] = [
  {
    id: "promo-1",
    title: "2x1 en Classic Smash",
    description: "Promoción válida solo para demostración universitaria.",
    discountPercentage: 50,
    isActive: true,
  },
  {
    id: "promo-2",
    title: "Combo estudiantil",
    description: "Hamburguesa + papas + bebida con descuento especial.",
    discountPercentage: 15,
    isActive: true,
  },
];

export const fallbackReviews: Review[] = [
  {
    id: "rev-1",
    author: "María C.",
    rating: 5,
    comment: "El sabor de la carne smash está increíble.",
    createdAt: "2026-04-01T18:00:00.000Z",
  },
  {
    id: "rev-2",
    author: "Daniel R.",
    rating: 4,
    comment: "Muy buena experiencia visual y flujo de compra.",
    createdAt: "2026-04-10T20:30:00.000Z",
  },
  {
    id: "rev-3",
    author: "Valentina P.",
    rating: 5,
    comment: "Las promos y el diseño hacen que todo se vea premium.",
    createdAt: "2026-04-20T15:45:00.000Z",
  },
];

export const fallbackBusinessHours: BusinessHours = {
  0: { isClosed: true, open: "00:00", close: "00:00" },
  1: { open: "12:00", close: "21:00" },
  2: { open: "12:00", close: "21:00" },
  3: { open: "12:00", close: "21:00" },
  4: { open: "12:00", close: "22:00" },
  5: { open: "12:00", close: "23:00" },
  6: { open: "13:00", close: "23:00" },
};
