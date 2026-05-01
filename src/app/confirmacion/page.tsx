import type { Metadata } from "next";
import { OrderConfirmationCard } from "@/components/cart/order-confirmation";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Confirmación",
  description: "Pantalla de confirmación del pedido por WhatsApp.",
};

export default function ConfirmacionPage() {
  return (
    <PageContainer
      title="Confirmación"
      description="Tu pedido fue generado y enviado por WhatsApp correctamente."
    >
      <OrderConfirmationCard />
    </PageContainer>
  );
}
