import type { CartItem, CustomerOrderData, DeliveryType } from "@/types";
import { formatCurrency } from "@/lib/utils";

const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  retiro: "Retiro en local",
  delivery: "Entrega a domicilio",
};

type WhatsAppTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export function calculateCartSubtotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    return total + (item.unit_price + addonsTotal) * item.quantity;
  }, 0);
}

export function buildOrderCode(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `SF-${year}${month}${day}-${hour}${minutes}`;
}

export function buildWhatsAppMessage(
  cart: CartItem[],
  customerData: CustomerOrderData,
  totals: WhatsAppTotals,
  orderCode: string
): string {
  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[customerData.deliveryType];
  const safeCustomerName = customerData.customerName.trim();
  const safeCustomerPhone = customerData.customerPhone.trim();
  const safeDeliveryAddress = customerData.deliveryAddress.trim();
  const safeObservations = customerData.observations.trim();

  const lines: string[] = [
    "Hola, quiero hacer un pedido en Smash Fries.",
    "",
    `Pedido #${orderCode}`,
    "",
    `Cliente: ${safeCustomerName}`,
    `Teléfono: ${safeCustomerPhone}`,
    `Tipo de entrega: ${deliveryTypeLabel}`,
  ];

  if (customerData.deliveryType === "delivery" && safeDeliveryAddress) {
    lines.push(`Dirección: ${safeDeliveryAddress}`);
  }

  lines.push("", "Pedido:");

  cart.forEach((item, index) => {
    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    const unitWithAddons = item.unit_price + addonsTotal;
    const lineTotal = unitWithAddons * item.quantity;
    const addonsText = item.addons.map((addon) => addon.name.trim()).filter(Boolean).join(", ");

    lines.push(`${index + 1}. ${item.quantity}x ${item.name}`);
    if (addonsText) {
      lines.push(`   Extras: ${addonsText}`);
    }
    lines.push(`   Precio unitario: ${formatCurrency(unitWithAddons)}`);
    lines.push(`   Subtotal: ${formatCurrency(lineTotal)}`);

    if (index < cart.length - 1) {
      lines.push("");
    }
  });

  if (safeObservations) {
    lines.push("", "Observaciones:", safeObservations);
  }

  lines.push("");
  lines.push(`Subtotal: ${formatCurrency(totals.subtotal)}`);
  lines.push(`Envío: ${formatCurrency(totals.deliveryFee)}`);
  lines.push(`Total a pagar: ${formatCurrency(totals.total)}`);
  lines.push("");
  lines.push("Por favor confirmar disponibilidad y tiempo estimado.");

  return lines.join("\n");
}

export function buildWhatsAppLink(message: string): string {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593999999999";
  const phone = rawPhone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
