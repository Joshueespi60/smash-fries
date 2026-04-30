import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { PageContainer } from "@/components/shared/page-container";
import { getBusinessSettings } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen del pedido, datos del cliente y envio por WhatsApp.",
};

export default async function CarritoPage() {
  const { settings } = await getBusinessSettings();

  return (
    <PageContainer
      title="Carrito"
      description="Ajusta cantidades, completa tus datos y envia tu pedido por WhatsApp."
    >
      <CartPageClient defaultDeliveryFee={settings.delivery_fee} />
    </PageContainer>
  );
}
