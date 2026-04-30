import { formatCurrency } from "@/lib/utils";
import type { DemoOrder } from "@/types";

type OrdersTableProps = {
  orders: DemoOrder[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-card text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Cliente</th>
            <th className="px-4 py-3">Telefono</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-border">
              <td className="px-4 py-3 text-foreground">{order.customer_name}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.customer_phone ?? "-"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{order.status}</td>
              <td className="px-4 py-3 text-accent">{formatCurrency(order.total)}</td>
              <td className="px-4 py-3 text-muted-foreground/80">
                {order.created_at
                  ? new Date(order.created_at).toLocaleString("es-EC")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
