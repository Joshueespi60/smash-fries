"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem, DeliveryType } from "@/types";

const LAST_ORDER_KEY = "smash-fries-last-order";

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
  createdAt: string;
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

export function OrderConfirmationCard() {
  const [order] = useState<StoredOrder | null>(() => getInitialOrder());

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 rounded-3xl border border-border bg-card/90 p-6 text-center">
      <CheckCircle2 className="mx-auto size-20 text-emerald-400" />
      <h1 className="text-3xl font-black text-foreground">Pedido enviado correctamente</h1>
      <p className="text-sm text-muted-foreground">
        Tu mensaje fue preparado para WhatsApp y quedo registrado para esta demo.
      </p>

      {order ? (
        <article className="rounded-2xl border border-border bg-muted/50 p-4 text-left text-sm text-foreground/90">
          <p>
            <strong>Cliente:</strong> {order.customerName}
          </p>
          <p>
            <strong>Telefono:</strong> {order.customerPhone}
          </p>
          <p>
            <strong>Entrega:</strong> {order.deliveryType}
          </p>
          <p>
            <strong>Direccion:</strong> {order.deliveryAddress}
          </p>
          <p>
            <strong>Total:</strong> {formatCurrency(order.total)}
          </p>
          <p className="mt-3 font-semibold">Productos:</p>
          <ul className="list-disc space-y-1 pl-5">
            {order.items.map((item) => (
              <li key={item.line_id}>
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
        </article>
      ) : (
        <p className="text-sm text-muted-foreground/80">No hay resumen almacenado en este navegador.</p>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground"
        >
          Volver al inicio
        </Link>
        <Link
          href="/menu"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Nuevo pedido
        </Link>
      </div>
    </section>
  );
}
