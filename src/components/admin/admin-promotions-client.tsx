"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import type { Promotion } from "@/types";

type AdminPromotionsClientProps = {
  initialPromotions: Promotion[];
};

export function AdminPromotionsClient({
  initialPromotions,
}: AdminPromotionsClientProps) {
  const [promotions, setPromotions] = useState(initialPromotions);

  const togglePromotion = async (id: string) => {
    const next = promotions.map((promotion) =>
      promotion.id === id
        ? { ...promotion, is_active: !promotion.is_active }
        : promotion
    );

    setPromotions(next);
    const changed = next.find((promotion) => promotion.id === id);
    if (!changed) {
      return;
    }

    if (!isSupabaseConfigured) {
      toast.success("Promocion actualizada en modo demo local");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        toast.error("Supabase no disponible, cambio solo local");
        return;
      }

      const result = await supabase
        .from("promotions")
        .update({ is_active: changed.is_active })
        .eq("id", id);

      if (result.error) {
        toast.error("No se pudo actualizar en Supabase");
      } else {
        toast.success("Promocion sincronizada en Supabase");
      }
    } catch {
      toast.error("Error al sincronizar promocion");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {promotions.map((promotion) => (
        <article
          key={promotion.id}
          className="rounded-2xl border border-border bg-card/90 p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">{promotion.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{promotion.description}</p>
              {promotion.price ? (
                <p className="mt-2 text-sm font-semibold text-accent">
                  Desde {formatCurrency(promotion.price)}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => togglePromotion(promotion.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                promotion.is_active
                  ? "bg-emerald-900/40 text-emerald-300"
                  : "bg-secondary/80 text-foreground/90"
              }`}
            >
              {promotion.is_active ? "Activa" : "Inactiva"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
