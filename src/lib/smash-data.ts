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
import {
  clampNumber,
  sanitizeExternalUrl,
  sanitizeMapEmbedUrl,
  sanitizePhoneNumber,
  sanitizeSocialUrl,
  sanitizeTextInput,
} from "@/lib/security";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { normalizeProductName, toNumber } from "@/lib/utils";
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
    name: sanitizeTextInput(row.name, { maxLength: 80 }) || "Categoria",
    slug:
      sanitizeTextInput(row.slug, {
        maxLength: 120,
        collapseWhitespace: false,
      }) || "categoria",
    icon: row.icon ? sanitizeTextInput(row.icon, { maxLength: 40 }) : null,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function mapAddon(row: AddonRow): Addon {
  return {
    id: row.id,
    name: sanitizeTextInput(row.name, { maxLength: 80 }) || "Extra",
    price: clampNumber(toNumber(row.price), 0, 100, 0),
    icon: row.icon ? sanitizeTextInput(row.icon, { maxLength: 40 }) : null,
    is_available: row.is_available,
    created_at: row.created_at,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    category_id: row.category_id,
    name: normalizeProductName(
      sanitizeTextInput(row.name, { maxLength: 100 }) || "Producto"
    ),
    slug:
      sanitizeTextInput(row.slug, {
        maxLength: 120,
        collapseWhitespace: false,
      }) || "producto",
    description: sanitizeTextInput(row.description, { maxLength: 260 }) || "",
    ingredients: row.ingredients
      ? sanitizeTextInput(row.ingredients, { maxLength: 260 })
      : null,
    price: clampNumber(toNumber(row.price), 0, 500, 0),
    image_url: sanitizeExternalUrl(row.image_url, {
      allowRelativePath: true,
    }),
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
      title: sanitizeTextInput(item.title, { maxLength: 120 }) || "Promocion",
      description: sanitizeTextInput(item.description, { maxLength: 260 }) || "",
      price:
        item.price === null || item.price === undefined
          ? null
          : clampNumber(item.price, 0, 500, 0),
      image_url: sanitizeExternalUrl(item.image_url, {
        allowRelativePath: true,
      }),
      is_active: item.is_active,
      badge: sanitizeTextInput((item as { badge?: string | null }).badge ?? "", {
        maxLength: 40,
      }) || null,
      product_id:
        sanitizeTextInput((item as { product_id?: string | null }).product_id ?? "", {
          maxLength: 64,
          collapseWhitespace: false,
        }) || null,
      product_slug:
        sanitizeTextInput((item as { product_slug?: string | null }).product_slug ?? "", {
          maxLength: 120,
          collapseWhitespace: false,
        }) || null,
      active_days: (item as { active_days?: string[] | null }).active_days ?? null,
      start_time:
        sanitizeTextInput((item as { start_time?: string | null }).start_time ?? "", {
          maxLength: 5,
          collapseWhitespace: false,
        }) || null,
      end_time:
        sanitizeTextInput((item as { end_time?: string | null }).end_time ?? "", {
          maxLength: 5,
          collapseWhitespace: false,
        }) || null,
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
      customer_name: sanitizeTextInput(item.customer_name, { maxLength: 80 }) || "Cliente",
      rating: clampNumber(item.rating, 0, 5, 0),
      comment: sanitizeTextInput(item.comment, { maxLength: 320 }) || "",
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
        business_name:
          sanitizeTextInput(row.business_name ?? "", { maxLength: 80 }) || "Smash Fries",
        slogan:
          sanitizeTextInput(row.slogan ?? "", { maxLength: 140 }) ||
          "Aplastadas al momento, frescas siempre",
        whatsapp_number: sanitizePhoneNumber(row.whatsapp_number, {
          minDigits: 8,
          maxDigits: 15,
        }),
        address: row.address
          ? sanitizeTextInput(row.address, { maxLength: 160 })
          : null,
        city:
          sanitizeTextInput(row.city ?? "", { maxLength: 80 }) || "Esmeraldas, Ecuador",
        opening_time:
          sanitizeTextInput(row.opening_time ?? "", {
            maxLength: 5,
            collapseWhitespace: false,
          }) || "17:00",
        closing_time:
          sanitizeTextInput(row.closing_time ?? "", {
            maxLength: 5,
            collapseWhitespace: false,
          }) || "22:30",
        delivery_fee: clampNumber(toNumber(row.delivery_fee), 0, 200, 0),
        instagram_url: sanitizeSocialUrl(row.instagram_url, "instagram"),
        facebook_url: sanitizeSocialUrl(row.facebook_url, "facebook"),
        tiktok_url: sanitizeSocialUrl(row.tiktok_url, "tiktok"),
        map_url: sanitizeMapEmbedUrl(row.map_url),
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
      customer_name: sanitizeTextInput(item.customer_name, { maxLength: 80 }) || "Cliente",
      customer_phone: sanitizePhoneNumber(item.customer_phone ?? "", {
        minDigits: 8,
        maxDigits: 15,
      }),
      delivery_address: item.delivery_address
        ? sanitizeTextInput(item.delivery_address, { maxLength: 180 })
        : null,
      order_summary: sanitizeTextInput(item.order_summary, {
        maxLength: 3200,
        allowNewLines: true,
      }),
      total: clampNumber(toNumber(item.total), 0, 10000, 0),
      status: sanitizeTextInput(item.status ?? "", { maxLength: 30 }) || "recibido",
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
  const safeName = sanitizeTextInput(input.customer_name, { maxLength: 80 });
  const safePhone = sanitizePhoneNumber(input.customer_phone, {
    minDigits: 8,
    maxDigits: 15,
  });
  const safeAddress = sanitizeTextInput(input.delivery_address, {
    maxLength: 180,
  });
  const safeSummary = sanitizeTextInput(input.order_summary, {
    maxLength: 3200,
    allowNewLines: true,
  });
  const safeTotal = clampNumber(input.total, 0, 10000, 0);

  if (!safeName || !safePhone || !safeSummary || safeTotal <= 0) {
    return { saved: false, source: "fallback" };
  }

  if (!isSupabaseConfigured) {
    return { saved: false, source: "fallback" };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { saved: false, source: "fallback" };
  }

  try {
    const result = await supabase.from("demo_orders").insert({
      customer_name: safeName,
      customer_phone: safePhone,
      delivery_address: safeAddress || null,
      order_summary: safeSummary,
      total: safeTotal,
      status: "recibido",
    });

    if (result.error) {
      return { saved: false, source: "supabase" };
    }

    return { saved: true, source: "supabase" };
  } catch {
    return { saved: false, source: "supabase" };
  }
}
