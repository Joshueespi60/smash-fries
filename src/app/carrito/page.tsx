import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { PageContainer } from "@/components/shared/page-container";
import { getBusinessSettings } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen del pedido, datos del cliente y envío por WhatsApp.",
};

export default async function CarritoPage() {
  const { settings } = await getBusinessSettings();

  return (
    <PageContainer
      title="Carrito"
      description="Ajusta cantidades, completa tus datos y envía tu pedido por WhatsApp."
    >
      <CartPageClient
        defaultDeliveryFee={settings.delivery_fee}
        fallbackWhatsappNumber={settings.whatsapp_number}
      />
    </PageContainer>
  );
}
