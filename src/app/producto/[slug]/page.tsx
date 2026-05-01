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

  const relatedProducts = [...products]
    .filter((item) => item.id !== product.id && item.is_available)
    .sort((a, b) => {
      const aScore = a.category_id === product.category_id ? 1 : 0;
      const bScore = b.category_id === product.category_id ? 1 : 0;

      if (aScore !== bScore) {
        return bScore - aScore;
      }

      return a.sort_order - b.sort_order;
    })
    .slice(0, 3);

  return (
    <PageContainer title={product.name} description={product.description}>
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </PageContainer>
  );
}
