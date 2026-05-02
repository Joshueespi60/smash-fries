"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { ProductVisual } from "@/components/shared/product-visual";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

type ProductCardProps = {
  product: Product;
  badge?: string;
};

export function ProductCard({ product, badge }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    if (!product.is_available) {
      toast.error("Este producto no está disponible ahora");
      return;
    }

    addItem(product, 1, []);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-zinc-900/10"
    >
      {badge ? (
        <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full border border-primary/20 bg-card/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent shadow-sm">
          {badge}
        </span>
      ) : null}

      <Link
        href={`/producto/${product.slug}`}
        aria-label={`Ver detalle de ${product.name}`}
        className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <ProductVisual
          name={product.name}
          imageUrl={product.image_url}
          className="aspect-[4/3] cursor-pointer transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              product.is_available
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-border bg-secondary/80 text-foreground/90"
            }`}
          >
            {product.is_available ? "Disponible" : "No disponible"}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">{product.description}</p>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-black text-accent">
            {formatCurrency(product.price)}
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/producto/${product.slug}`}
              className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Ver detalle
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition hover:scale-[1.02] hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
            >
              <ShoppingCart className="size-3.5" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
