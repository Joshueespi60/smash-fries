"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/menu/product-card";
import { normalizeSearchText } from "@/lib/utils";
import type { Category, Product } from "@/types";

type MenuClientProps = {
  categories: Category[];
  products: Product[];
};

export function MenuClient({ categories, products }: MenuClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query.trim());

    return products.filter((product) => {
      const byCategory =
        activeCategory === "all" || product.category_id === activeCategory;

      const normalizedName = normalizeSearchText(product.name);
      const normalizedDescription = normalizeSearchText(product.description);
      const byQuery =
        normalizedQuery.length === 0 ||
        normalizedName.includes(normalizedQuery) ||
        normalizedDescription.includes(normalizedQuery);

      return byCategory && byQuery;
    });
  }, [activeCategory, products, query]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <label className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-2">
          <Search className="size-4 text-muted-foreground/80" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar producto"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="Prueba otro término de búsqueda o cambia el filtro de categoría."
        />
      ) : (
        <motion.div
          layout
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
