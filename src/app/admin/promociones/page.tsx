import type { Metadata } from "next";
import { AdminPromotionsClient } from "@/components/admin/admin-promotions-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPromotions } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin Promociones",
  description: "Gestion de promociones activas e inactivas.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPromocionesPage() {
  const { source, promotions } = await getPromotions();

  return (
    <AdminShell
      title="Admin de Promociones"
      description={`Activa o desactiva promociones de forma visual. Fuente: ${source}.`}
    >
      <AdminPromotionsClient initialPromotions={promotions} />
    </AdminShell>
  );
}
