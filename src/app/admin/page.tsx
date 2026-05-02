import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { OrdersTable } from "@/components/admin/orders-table";
import { getCatalogData, getDemoOrders, getPromotions, getReviews } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin",
  description: "Dashboard con metricas y pedidos del negocio.",
};

export default async function AdminPage() {
  const [{ products }, { promotions }, { reviews }, { source, orders }] =
    await Promise.all([
      getCatalogData(),
      getPromotions(),
      getReviews(true),
      getDemoOrders(),
    ]);

  const stats = [
    { label: "Total productos", value: products.length },
    {
      label: "Productos disponibles",
      value: products.filter((item) => item.is_available).length,
    },
    {
      label: "Promociones activas",
      value: promotions.filter((item) => item.is_active).length,
    },
    {
      label: "Resenas aprobadas",
      value: reviews.filter((item) => item.is_approved).length,
    },
    { label: "Pedidos registrados", value: orders.length },
  ];

  return (
    <AdminShell
      title="Panel Admin"
      description={`Indicadores del panel administrativo. Pedidos desde: ${source}.`}
    >
      <div className="space-y-6">
        <AdminStatsGrid stats={stats} />
        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">Tabla de pedidos</h2>
          <OrdersTable orders={orders} />
        </section>
      </div>
    </AdminShell>
  );
}
