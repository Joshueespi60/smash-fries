export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  created_at?: string;
};

export type Addon = {
  id: string;
  name: string;
  price: number;
  icon: string | null;
  is_available: boolean;
  created_at?: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string;
  ingredients: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at?: string;
  category?: Category | null;
  addons?: Addon[];
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at?: string;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at?: string;
};

export type BusinessSettings = {
  id: string;
  business_name: string;
  slogan: string;
  whatsapp_number: string;
  address: string | null;
  city: string;
  opening_time: string;
  closing_time: string;
  delivery_fee: number;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  map_url: string | null;
  created_at?: string;
};

export type CartAddon = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  line_id: string;
  product_id: string;
  slug: string;
  name: string;
  unit_price: number;
  image_url: string | null;
  quantity: number;
  addons: CartAddon[];
};

export type DemoOrder = {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  order_summary: string;
  total: number;
  status: string;
  created_at?: string;
};

export type DeliveryType = "retiro" | "delivery";

export type CustomerOrderData = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryType: DeliveryType;
  observations: string;
};
