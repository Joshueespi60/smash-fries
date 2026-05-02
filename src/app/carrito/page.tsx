import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";
import { PageContainer } from "@/components/shared/page-container";
import { getBusinessSettings, getCatalogData } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Resumen del pedido, datos del cliente y envío por WhatsApp.",
};

export default async function CarritoPage() {
  const [{ settings }, { products }] = await Promise.all([
    getBusinessSettings(),
    getCatalogData(),
  ]);

  return (
    <PageContainer
      title="Carrito"
      description="Ajusta cantidades, completa tus datos y envía tu pedido por WhatsApp."
    >
      <CartPageClient
        defaultDeliveryFee={settings.delivery_fee}
        fallbackWhatsappNumber={settings.whatsapp_number}
        catalogProducts={products}
      />
    </PageContainer>
  );
}
