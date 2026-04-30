import type { Metadata } from "next";
import { OrderConfirmationCard } from "@/components/cart/order-confirmation";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Confirmacion",
  description: "Pantalla de confirmacion del pedido demo por WhatsApp.",
};

export default function ConfirmacionPage() {
  return (
    <PageContainer
      title="Confirmacion"
      description="Tu pedido demo fue generado y enviado a WhatsApp correctamente."
    >
      <OrderConfirmationCard />
    </PageContainer>
  );
}
