"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { Review } from "@/types";

type AdminReviewsClientProps = {
  initialReviews: Review[];
};

export function AdminReviewsClient({ initialReviews }: AdminReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);

  const toggleApproval = async (id: string) => {
    const next = reviews.map((review) =>
      review.id === id ? { ...review, is_approved: !review.is_approved } : review
    );

    setReviews(next);
    const changed = next.find((review) => review.id === id);
    if (!changed) {
      return;
    }

    if (!isSupabaseConfigured) {
      toast.success("Reseña actualizada en modo local");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        toast.error("Supabase no disponible, cambio solo local");
        return;
      }

      const result = await supabase
        .from("reviews")
        .update({ is_approved: changed.is_approved })
        .eq("id", id);

      if (result.error) {
        toast.error("No se pudo actualizar en Supabase");
      } else {
        toast.success("Reseña sincronizada en Supabase");
      }
    } catch {
      toast.error("Error al sincronizar reseña");
    }
  };

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-2xl border border-border bg-card/90 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground">{review.customer_name}</h3>
              <p className="text-xs text-muted-foreground/80">
                Calificación: {review.rating}/5
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleApproval(review.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                review.is_approved
                  ? "bg-emerald-900/40 text-emerald-300"
                  : "bg-secondary/80 text-foreground/90"
              }`}
            >
              {review.is_approved ? "Aprobada" : "Oculta"}
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        </article>
      ))}
    </div>
  );
}
