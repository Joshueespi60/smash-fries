import type { Metadata } from "next";
import { AdminProductsClient } from "@/components/admin/admin-products-client";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCatalogData } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Admin Productos",
  description: "Gestion de productos con acciones locales y Supabase opcional.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProductosPage() {
  const { source, products, categories } = await getCatalogData();

  return (
    <AdminShell
      title="Admin de Productos"
      description={`Gestiona el catalogo. Fuente actual: ${source}.`}
    >
      <AdminProductsClient initialProducts={products} categories={categories} />
    </AdminShell>
  );
}
