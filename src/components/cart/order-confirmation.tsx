"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { clampInteger, clampNumber, sanitizePhoneNumber, sanitizeTextInput } from "@/lib/security";
import { buildOrderCode } from "@/lib/whatsapp";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, DeliveryType } from "@/types";

const LAST_ORDER_KEY = "smash-fries-last-order";
const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  retiro: "Retiro en local",
  delivery: "Entrega a domicilio",
};

type StoredOrder = {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryType: DeliveryType;
  observations: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt?: string;
  orderCode?: string;
};

function getInitialOrder(): StoredOrder | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(LAST_ORDER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredOrder;
  } catch {
    return null;
  }
}

function getSafeDate(value?: string): Date {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toSafeNumber(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function OrderConfirmationCard() {
  const [order] = useState<StoredOrder | null>(() => getInitialOrder());
  const orderDate = useMemo(() => getSafeDate(order?.createdAt), [order?.createdAt]);
  const orderCode = useMemo(() => {
    if (!order) {
      return "";
    }

    return order.orderCode?.trim() || buildOrderCode(orderDate);
  }, [order, orderDate]);

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-EC", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(orderDate),
    [orderDate]
  );

  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(orderDate),
    [orderDate]
  );

  const safeCustomerName =
    sanitizeTextInput(order?.customerName ?? "", { maxLength: 80 }) || "No especificado";
  const safeCustomerPhone = sanitizePhoneNumber(order?.customerPhone ?? "") || "No especificado";
  const safeDeliveryType: DeliveryType = order?.deliveryType === "delivery" ? "delivery" : "retiro";
  const safeDeliveryLabel = DELIVERY_TYPE_LABELS[safeDeliveryType];
  const safeDeliveryAddress = sanitizeTextInput(order?.deliveryAddress ?? "", {
    maxLength: 180,
  });
  const safeObservations = sanitizeTextInput(order?.observations ?? "", {
    maxLength: 280,
    allowNewLines: true,
  });
  const safeItems = Array.isArray(order?.items) ? order.items : [];

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 rounded-3xl border border-border bg-card/90 p-6 text-center shadow-sm md:p-8">
      <CheckCircle2
        className={`mx-auto size-20 ${order ? "text-emerald-400" : "text-muted-foreground"}`}
      />
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-foreground">
          {order ? "Pedido enviado correctamente" : "Confirmación de pedido"}
        </h1>
        {order ? (
          <p className="text-sm font-bold text-accent">Pedido #{orderCode}</p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          {order
            ? "Te contactaremos por WhatsApp para confirmar tu pedido."
            : "No encontramos un pedido reciente en este navegador."}
        </p>
        {order ? (
          <p className="text-xs text-muted-foreground">
            Pedido realizado el {dateLabel} a las {timeLabel}
          </p>
        ) : null}
        {order ? (
          <p className="text-sm text-muted-foreground">Gracias por elegir Smash Fries.</p>
        ) : null}
      </div>

      {order ? (
        <article className="space-y-4 text-left">
          <div className="grid gap-3 sm:grid-cols-2">
            <section className="rounded-2xl border border-border bg-muted/40 p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Datos del cliente
              </h2>
              <div className="mt-2 space-y-1 text-sm text-foreground">
                <p>
                  <strong>Cliente:</strong> {safeCustomerName}
                </p>
                <p>
                  <strong>Teléfono:</strong> {safeCustomerPhone}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-muted/40 p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Entrega
              </h2>
              <div className="mt-2 space-y-1 text-sm text-foreground">
                <p>
                  <strong>Tipo de entrega:</strong> {safeDeliveryLabel}
                </p>
                {safeDeliveryType === "delivery" ? (
                  <p>
                    <strong>Dirección:</strong> {safeDeliveryAddress || "No especificada"}
                  </p>
                ) : null}
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-border bg-muted/40 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Productos
            </h2>

            {safeItems.length > 0 ? (
              <div className="mt-3 space-y-3">
                {safeItems.map((item) => {
                  const safeAddons = (Array.isArray(item.addons) ? item.addons : [])
                    .map((addon) => ({
                      id: sanitizeTextInput(addon.id, { maxLength: 64 }),
                      name: sanitizeTextInput(addon.name, { maxLength: 80 }),
                      price: clampNumber(addon.price, 0, 100, 0),
                    }))
                    .filter((addon) => addon.id && addon.name);
                  const addonsTotal = safeAddons.reduce((sum, addon) => sum + addon.price, 0);
                  const safeUnitPrice = clampNumber(item.unit_price, 0, 500, 0);
                  const safeQuantity = clampInteger(item.quantity, 1, 20, 1);
                  const lineSubtotal = (safeUnitPrice + addonsTotal) * safeQuantity;

                  return (
                    <article
                      key={item.line_id}
                      className="rounded-xl border border-border bg-card/80 p-3 text-sm text-foreground"
                    >
                      <p className="font-semibold">
                        {safeQuantity}x{" "}
                        {sanitizeTextInput(item.name, { maxLength: 90 }) || "Producto"}
                      </p>
                      {safeAddons.length > 0 ? (
                        <p className="mt-1 text-muted-foreground">
                          <strong>Extras:</strong> {safeAddons.map((addon) => addon.name).join(", ")}
                        </p>
                      ) : null}
                      <p className="mt-1 text-muted-foreground">
                        <strong>Precio unitario:</strong> {formatCurrency(safeUnitPrice + addonsTotal)}
                      </p>
                      <p className="mt-1 font-medium">
                        <strong>Subtotal:</strong> {formatCurrency(lineSubtotal)}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No hay productos para mostrar.</p>
            )}
          </section>

          {safeObservations ? (
            <section className="rounded-2xl border border-border bg-muted/40 p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Observaciones
              </h2>
              <p className="mt-2 text-sm text-foreground">{safeObservations}</p>
            </section>
          ) : null}

          <section className="rounded-2xl border border-border bg-muted/40 p-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Totales
            </h2>
            <div className="mt-2 space-y-2 text-sm text-foreground">
              <p className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(toSafeNumber(order.subtotal))}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Envío</span>
                <span>{formatCurrency(toSafeNumber(order.deliveryFee))}</span>
              </p>
              <p className="flex items-center justify-between text-base font-black text-accent">
                <span>Total a pagar</span>
                <span>{formatCurrency(toSafeNumber(order.total))}</span>
              </p>
            </div>
          </section>
        </article>
      ) : (
        <article className="rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-center">
          <h2 className="text-lg font-bold text-foreground">No encontramos un pedido reciente.</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vuelve al menú para iniciar un nuevo pedido.
          </p>
        </article>
      )}

      {order ? (
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Volver al inicio
          </Link>
          <Link
            href="/menu"
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver menú
          </Link>
          <Link
            href="/menu"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Nuevo pedido
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/menu"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Ver menú
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Volver al inicio
          </Link>
        </div>
      )}
    </section>
  );
}
