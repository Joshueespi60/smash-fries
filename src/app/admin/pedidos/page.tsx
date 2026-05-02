import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTable } from "@/components/admin/orders-table";
import { getDemoOrders } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin Pedidos",
  description: "Consulta de pedidos generados desde el carrito.",
};

export default async function AdminPedidosPage() {
  const { source, orders } = await getDemoOrders();

  return (
    <AdminShell
      title="Admin de Pedidos"
      description={`Tabla de pedidos registrados. Fuente: ${source}.`}
    >
      <OrdersTable orders={orders} />
    </AdminShell>
  );
}
