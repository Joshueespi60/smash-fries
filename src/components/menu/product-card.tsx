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
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    if (!product.is_available) {
      toast.error("Este producto no esta disponible ahora");
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
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-3xl border border-border bg-card/90"
    >
      <ProductVisual
        name={product.name}
        imageUrl={product.image_url}
        className="aspect-[4/3]"
      />
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              product.is_available
                ? "bg-emerald-100 text-emerald-700"
                : "bg-secondary/80 text-foreground/90"
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
              className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
            >
              Ver detalle
            </Link>
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
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
