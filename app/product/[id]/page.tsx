import ProductDetail from "@/components/shop/ProductDetail";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
   const response = await fetch(`${baseUrl}/api/products/${id}`, {
  next: { revalidate: 3600 }, // Revalidate every hour
});

    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

export default ProductPage;
