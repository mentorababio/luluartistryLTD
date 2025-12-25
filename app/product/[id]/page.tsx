"use client";

import { useEffect, useState } from "react";
import ProductDetail from "@/components/shop/ProductDetail";
import { notFound } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api/client";
import toast from "react-hot-toast";
import { Product } from "@/hooks/useProducts";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{
          success: boolean;
          data: Product;
        }>(`/products/${params.id}`);

        const productData = response?.data;
        if (productData) {
          setProduct(productData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error((err as ApiError)?.message || "Failed to load product");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <div className="text-center py-20">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  // Convert backend product format to component format
  const mainImage = Array.isArray(product.images) && product.images.length > 0
    ? (typeof product.images[0] === 'string' 
        ? product.images[0] 
        : product.images[0]?.url || "/placeholder.png")
    : "/placeholder.png";

  const productForComponent = {
    ...product,
    image: mainImage,
    originalPrice: product.comparePrice,
    inStock: product.inStock,
    rating: product.averageRating || 0,
    reviews: product.numOfReviews || 0,
    featured: product.isFeatured,
  };

  return <ProductDetail product={productForComponent as any} />;
};

export default ProductPage;
