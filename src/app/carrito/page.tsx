import { CartSummary } from "@/components/cart/cart-summary";
import { PageShell } from "@/components/shared/page-shell";

export default function CarritoPage() {
  return (
    <PageShell
      title="Carrito"
      description="Revisa tus productos, ajusta cantidades y genera tu pedido por WhatsApp."
    >
      <CartSummary />
    </PageShell>
  );
}
