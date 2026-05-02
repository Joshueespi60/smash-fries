import type { Metadata } from "next";
import { MenuClient } from "@/components/menu/menu-client";
import { PageContainer } from "@/components/shared/page-container";
import { getCatalogData } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Menú",
  description: "Menú digital de Smash Fries con filtros, búsqueda y carrito.",
};

export default async function MenuPage() {
  const { source, categories, products } = await getCatalogData();

  return (
    <PageContainer
      title="Menú digital"
      description={`Explora productos, filtra por categoría y agrega al carrito. Fuente actual: ${source}.`}
    >
      <MenuClient categories={categories} products={products} />
    </PageContainer>
  );
}
