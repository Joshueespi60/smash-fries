import type { Metadata } from "next";
import { AdminReviewsClient } from "@/components/admin/admin-reviews-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { getReviews } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin Reseñas",
  description: "Aprobar u ocultar reseñas para la vista pública.",
};

export default async function AdminResenasPage() {
  const { source, reviews } = await getReviews(true);

  return (
    <AdminShell
      title="Admin de Reseñas"
      description={`Moderación visual de reseñas. Fuente: ${source}.`}
    >
      <AdminReviewsClient initialReviews={reviews} />
    </AdminShell>
  );
}
