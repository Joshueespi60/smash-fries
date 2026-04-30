import type { Metadata } from "next";
import { MenuClient } from "@/components/menu/menu-client";
import { PageContainer } from "@/components/shared/page-container";
import { getCatalogData } from "@/lib/smash-data";

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu digital de Smash Fries con filtros, busqueda y carrito.",
};

export default async function MenuPage() {
  const { source, categories, products } = await getCatalogData();

  return (
    <PageContainer
      title="Menu Digital"
      description={`Explora productos, filtra por categoria y agrega al carrito. Fuente actual: ${source}.`}
    >
      <MenuClient categories={categories} products={products} />
    </PageContainer>
  );
}
