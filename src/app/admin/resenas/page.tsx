import type { Metadata } from "next";
import { AdminReviewsClient } from "@/components/admin/admin-reviews-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { getReviews } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin Resenas",
  description: "Aprobar u ocultar resenas para la vista publica.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminResenasPage() {
  const { source, reviews } = await getReviews(true);

  return (
    <AdminShell
      title="Admin de Resenas"
      description={`Moderacion visual de resenas. Fuente: ${source}.`}
    >
      <AdminReviewsClient initialReviews={reviews} />
    </AdminShell>
  );
}
