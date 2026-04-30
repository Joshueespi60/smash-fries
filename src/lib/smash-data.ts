import {
  fallbackAddons,
  fallbackBusinessSettings,
  fallbackCategories,
  fallbackDemoOrders,
  fallbackProductAddons,
  fallbackProducts,
  fallbackPromotions,
  fallbackReviews,
} from "@/data/fallback-data";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { toNumber } from "@/lib/utils";
import type {
  Addon,
  BusinessSettings,
  Category,
  DemoOrder,
  Product,
  Promotion,
  Review,
} from "@/types";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type AddonRow = Database["public"]["Tables"]["addons"]["Row"];
type ProductAddonRow = Database["public"]["Tables"]["product_addons"]["Row"];

type SourceStatus = "supabase" | "fallback";

type CatalogPayload = {
  source: SourceStatus;
  categories: Category[];
  products: Product[];
  addons: Addon[];
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function mapAddon(row: AddonRow): Addon {
  return {
    id: row.id,
    name: row.name,
    price: toNumber(row.price),
    icon: row.icon,
    is_available: row.is_available,
    created_at: row.created_at,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    ingredients: row.ingredients,
    price: toNumber(row.price),
    image_url: row.image_url,
    is_available: row.is_available,
    is_featured: row.is_featured,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function buildCatalog(
  categories: Category[],
  products: Product[],
  addons: Addon[],
  relations: Array<{ product_id: string; addon_id: string }>
): CatalogPayload {
  const categoriesMap = new Map(categories.map((item) => [item.id, item]));
  const addonsMap = new Map(addons.map((item) => [item.id, item]));

  const productAddonsMap = relations.reduce((acc, relation) => {
    const foundAddon = addonsMap.get(relation.addon_id);
    if (!foundAddon) {
      return acc;
    }

    const list = acc.get(relation.product_id) ?? [];
    list.push(foundAddon);
    acc.set(relation.product_id, list);
    return acc;
  }, new Map<string, Addon[]>());

  const withRelations = products
    .map((product) => ({
      ...product,
      category: product.category_id
        ? categoriesMap.get(product.category_id) ?? null
        : null,
      addons: productAddonsMap.get(product.id) ?? [],
    }))
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    source: "fallback",
    categories: [...categories].sort((a, b) => a.sort_order - b.sort_order),
    products: withRelations,
    addons,
  };
}

function buildFallbackCatalog(): CatalogPayload {
  return buildCatalog(
    fallbackCategories,
    fallbackProducts,
    fallbackAddons,
    fallbackProductAddons
  );
}

export async function getCatalogData(): Promise<CatalogPayload> {
  const fallback = buildFallbackCatalog();

  if (!isSupabaseConfigured) {
    return fallback;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return fallback;
  }

  try {
    const [categoriesResult, productsResult, addonsResult, relResult] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase.from("products").select("*").order("sort_order"),
        supabase.from("addons").select("*").eq("is_available", true),
        supabase.from("product_addons").select("product_id, addon_id"),
      ]);

    if (
      categoriesResult.error ||
      productsResult.error ||
      addonsResult.error ||
      relResult.error
    ) {
      return fallback;
    }

    const categories = (categoriesResult.data ?? []).map(mapCategory);
    const products = (productsResult.data ?? []).map(mapProduct);
    const addons = (addonsResult.data ?? []).map(mapAddon);
    const relations = (relResult.data ?? []) as ProductAddonRow[];

    if (products.length === 0 || categories.length === 0) {
      return fallback;
    }

    const fromSupabase = buildCatalog(categories, products, addons, relations);
    return { ...fromSupabase, source: "supabase" };
  } catch {
    return fallback;
  }
}

export async function getPromotions(): Promise<{ source: SourceStatus; promotions: Promotion[] }> {
  if (!isSupabaseConfigured) {
    return { source: "fallback", promotions: fallbackPromotions };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { source: "fallback", promotions: fallbackPromotions };
  }

  try {
    const result = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (result.error || !result.data || result.data.length === 0) {
      return { source: "fallback", promotions: fallbackPromotions };
    }

    const promotions: Promotion[] = result.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      is_active: item.is_active,
      created_at: item.created_at,
    }));

    return { source: "supabase", promotions };
  } catch {
    return { source: "fallback", promotions: fallbackPromotions };
  }
}

export async function getReviews(includeHidden = false): Promise<{ source: SourceStatus; reviews: Review[] }> {
  if (!isSupabaseConfigured) {
    return {
      source: "fallback",
      reviews: includeHidden
        ? fallbackReviews
        : fallbackReviews.filter((review) => review.is_approved),
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      source: "fallback",
      reviews: includeHidden
        ? fallbackReviews
        : fallbackReviews.filter((review) => review.is_approved),
    };
  }

  try {
    let query = supabase.from("reviews").select("*").order("created_at", {
      ascending: false,
    });

    if (!includeHidden) {
      query = query.eq("is_approved", true);
    }

    const result = await query;
    if (result.error || !result.data || result.data.length === 0) {
      return {
        source: "fallback",
        reviews: includeHidden
          ? fallbackReviews
          : fallbackReviews.filter((review) => review.is_approved),
      };
    }

    const reviews: Review[] = result.data.map((item) => ({
      id: item.id,
      customer_name: item.customer_name,
      rating: item.rating,
      comment: item.comment,
      is_approved: item.is_approved,
      created_at: item.created_at,
    }));

    return { source: "supabase", reviews };
  } catch {
    return {
      source: "fallback",
      reviews: includeHidden
        ? fallbackReviews
        : fallbackReviews.filter((review) => review.is_approved),
    };
  }
}

export async function getBusinessSettings(): Promise<{
  source: SourceStatus;
  settings: BusinessSettings;
}> {
  if (!isSupabaseConfigured) {
    return { source: "fallback", settings: fallbackBusinessSettings };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { source: "fallback", settings: fallbackBusinessSettings };
  }

  try {
    const result = await supabase
      .from("business_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (result.error || !result.data) {
      return { source: "fallback", settings: fallbackBusinessSettings };
    }

    const row = result.data;
    return {
      source: "supabase",
      settings: {
        id: row.id,
        business_name: row.business_name ?? "Smash Fries",
        slogan: row.slogan ?? "Aplastadas al momento, frescas siempre",
        whatsapp_number: row.whatsapp_number,
        address: row.address,
        city: row.city ?? "Esmeraldas, Ecuador",
        opening_time: row.opening_time ?? "17:00",
        closing_time: row.closing_time ?? "22:30",
        delivery_fee: toNumber(row.delivery_fee),
        instagram_url: row.instagram_url,
        facebook_url: row.facebook_url,
        tiktok_url: row.tiktok_url,
        map_url: row.map_url,
        created_at: row.created_at,
      },
    };
  } catch {
    return { source: "fallback", settings: fallbackBusinessSettings };
  }
}

export async function getDemoOrders(): Promise<{
  source: SourceStatus;
  orders: DemoOrder[];
}> {
  if (!isSupabaseConfigured) {
    return { source: "fallback", orders: fallbackDemoOrders };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { source: "fallback", orders: fallbackDemoOrders };
  }

  try {
    const result = await supabase
      .from("demo_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (result.error || !result.data || result.data.length === 0) {
      return { source: "fallback", orders: fallbackDemoOrders };
    }

    const orders: DemoOrder[] = result.data.map((item) => ({
      id: item.id,
      customer_name: item.customer_name,
      customer_phone: item.customer_phone,
      delivery_address: item.delivery_address,
      order_summary: item.order_summary,
      total: toNumber(item.total),
      status: item.status ?? "demo",
      created_at: item.created_at,
    }));

    return { source: "supabase", orders };
  } catch {
    return { source: "fallback", orders: fallbackDemoOrders };
  }
}

export async function saveDemoOrder(input: {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  order_summary: string;
  total: number;
}): Promise<{ saved: boolean; source: SourceStatus }> {
  if (!isSupabaseConfigured) {
    return { saved: false, source: "fallback" };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { saved: false, source: "fallback" };
  }

  try {
    const result = await supabase.from("demo_orders").insert({
      customer_name: input.customer_name,
      customer_phone: input.customer_phone,
      delivery_address: input.delivery_address,
      order_summary: input.order_summary,
      total: input.total,
      status: "demo",
    });

    if (result.error) {
      return { saved: false, source: "supabase" };
    }

    return { saved: true, source: "supabase" };
  } catch {
    return { saved: false, source: "supabase" };
  }
}
