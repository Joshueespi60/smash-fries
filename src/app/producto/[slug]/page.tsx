import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/menu/product-detail-client";
import { PageContainer } from "@/components/shared/page-container";
import { getCatalogData } from "@/lib/smash-data";

type ProductoPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalogData();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const { products } = await getCatalogData();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <PageContainer title={product.name} description={product.description}>
      <ProductDetailClient product={product} />
    </PageContainer>
  );
}