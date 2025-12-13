import ProductDetail from "@/components/shop/ProductDetail";
import { products } from "@/utils/portfolioData";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
};

export default ProductPage;
