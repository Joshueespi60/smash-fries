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

export function buildWhatsAppMessage(
  cart: CartItem[],
  customerData: CustomerOrderData,
  totals: WhatsAppTotals
): string {
  const deliveryTypeLabel = DELIVERY_TYPE_LABELS[customerData.deliveryType];
  const safeObservations = customerData.observations || "Ninguna.";

  const lines: Array<string | null> = [
    "Hola, quiero hacer un pedido en Smash Fries.",
    "",
    `Cliente: ${customerData.customerName}`,
    `Teléfono: ${customerData.customerPhone}`,
    `Tipo de entrega: ${deliveryTypeLabel}`,
    customerData.deliveryType === "delivery"
      ? `Dirección: ${customerData.deliveryAddress}`
      : null,
    "",
    "Pedido:",
  ];

  cart.forEach((item, index) => {
    const addonsTotal = item.addons.reduce((sum, addon) => sum + addon.price, 0);
    const unitWithAddons = item.unit_price + addonsTotal;
    const lineTotal = unitWithAddons * item.quantity;
    const addonsText =
      item.addons.length > 0
        ? `Extras: ${item.addons.map((addon) => addon.name).join(", ")}`
        : null;

    lines.push(`${index + 1}. ${item.quantity}x ${item.name} - ${formatCurrency(lineTotal)}`);
    if (item.quantity > 1) {
      lines.push(`Precio unitario: ${formatCurrency(unitWithAddons)} c/u`);
    }
    if (addonsText) {
      lines.push(addonsText);
    }
    lines.push("");
  });

  lines.push("Observaciones:");
  lines.push(safeObservations);
  lines.push("");
  lines.push(`Subtotal: ${formatCurrency(totals.subtotal)}`);
  lines.push(`Envío: ${formatCurrency(totals.deliveryFee)}`);
  lines.push(`Total: ${formatCurrency(totals.total)}`);

  return lines.filter((line): line is string => line !== null).join("\n");
}

export function buildWhatsAppLink(message: string): string {
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "593999999999";
  const phone = rawPhone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
