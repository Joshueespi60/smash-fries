export type ProductCategory = "smash" | "sides" | "drinks" | "combos";

export type ProductExtra = {
  id: string;
  name: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: ProductCategory;
  isAvailable: boolean;
  extras?: ProductExtra[];
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type DaySchedule = {
  open: string;
  close: string;
  isClosed?: boolean;
};

export type BusinessHours = Record<number, DaySchedule>;

export type BusinessStatus = {
  isOpen: boolean;
  label: string;
};

export type CartItem = {
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  quantity: number;
  selectedExtras: ProductExtra[];
};
