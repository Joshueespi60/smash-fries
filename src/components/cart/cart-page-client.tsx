"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductVisual } from "@/components/shared/product-visual";
import { saveDemoOrder } from "@/lib/smash-data";
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  calculateCartSubtotal,
} from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { DeliveryType } from "@/types";

const LAST_ORDER_KEY = "smash-fries-last-order";

type CartPageClientProps = {
  defaultDeliveryFee: number;
};

export function CartPageClient({ defaultDeliveryFee }: CartPageClientProps) {
  const router = useRouter();

  const {
    items,
    deliveryFee,
    subtotal,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    setDeliveryFee,
  } = useCartStore((state) => ({
    items: state.items,
    deliveryFee: state.deliveryFee,
    subtotal: state.subtotal,
    total: state.total,
    increaseQuantity: state.increaseQuantity,
    decreaseQuantity: state.decreaseQuantity,
    removeItem: state.removeItem,
    clearCart: state.clearCart,
    setDeliveryFee: state.setDeliveryFee,
  }));

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("retiro");
  const [observations, setObservations] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fee = deliveryType === "delivery" ? defaultDeliveryFee : 0;
    setDeliveryFee(fee);
  }, [defaultDeliveryFee, deliveryType, setDeliveryFee]);

  const previewSubtotal = useMemo(() => calculateCartSubtotal(items), [items]);
  const finalSubtotal = subtotal > 0 ? subtotal : previewSubtotal;
  const finalTotal = total > 0 || deliveryFee > 0 ? total : finalSubtotal + deliveryFee;

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast.error("Tu carrito esta vacio");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Nombre y telefono son obligatorios");
      return;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      toast.error("La direccion es obligatoria para delivery");
      return;
    }

    const safeAddress =
      deliveryType === "retiro" ? "Retiro en local" : deliveryAddress.trim();

    setSubmitting(true);

    try {
      const message = buildWhatsAppMessage(
        items,
        {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: safeAddress,
          deliveryType,
          observations: observations.trim(),
        },
        finalTotal
      );

      const whatsappLink = buildWhatsAppLink(message);
      window.open(whatsappLink, "_blank", "noopener,noreferrer");

      const summaryForStorage = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: safeAddress,
        deliveryType,
        observations: observations.trim(),
        items,
        subtotal: finalSubtotal,
        deliveryFee,
        total: finalTotal,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(summaryForStorage));

      const saveResult = await saveDemoOrder({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: safeAddress,
        order_summary: message,
        total: finalTotal,
      });

      if (saveResult.saved) {
        toast.success("Pedido demo guardado en Supabase");
      } else if (saveResult.source === "supabase") {
        toast.error("No se pudo guardar en Supabase, pero WhatsApp continua");
      }

      toast.success("Pedido enviado por WhatsApp");
      clearCart();
      router.push("/confirmacion");
    } catch {
      toast.error("Ocurrio un error al enviar el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="Carrito vacio"
        description="Agrega productos desde el menu para iniciar tu pedido."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-3">
        {items.map((item) => {
          const addonsText = item.addons.map((addon) => addon.name).join(", ");
          return (
            <article
              key={item.line_id}
              className="flex gap-3 rounded-2xl border border-border bg-card/90 p-3"
            >
              <ProductVisual
                name={item.name}
                imageUrl={item.image_url}
                className="h-24 w-24 rounded-xl"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(item.line_id);
                      toast.success("Producto quitado del carrito");
                    }}
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-secondary"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.unit_price)}
                  {addonsText ? ` | Extras: ${addonsText}` : ""}
                </p>
                <div className="inline-flex items-center rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.line_id)}
                    className="p-1.5 text-foreground hover:bg-secondary"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.line_id)}
                    className="p-1.5 text-foreground hover:bg-secondary"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <aside className="space-y-4 rounded-2xl border border-border bg-card/90 p-5">
        <h2 className="text-xl font-black text-foreground">Resumen del pedido</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(finalSubtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Envio</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </p>
          <p className="flex justify-between text-base font-black text-accent">
            <span>Total</span>
            <span>{formatCurrency(finalTotal)}</span>
          </p>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Nombre</span>
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Telefono</span>
            <input
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Tipo de entrega</span>
            <select
              value={deliveryType}
              onChange={(event) => setDeliveryType(event.target.value as DeliveryType)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            >
              <option value="retiro">Retiro</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Direccion</span>
            <textarea
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              rows={2}
              placeholder={deliveryType === "delivery" ? "Ej: Barrio X, calle Y" : "No aplica"}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Observaciones</span>
            <textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmitOrder}
          className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Enviando..." : "Enviar pedido por WhatsApp"}
        </button>
      </aside>
    </div>
  );
}
