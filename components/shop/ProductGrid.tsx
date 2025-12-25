"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useProducts, Product } from "@/hooks/useProducts";

interface ProductGridProps {
  category?: string;
  title?: string;
}

const ProductGridContent = ({ category, title }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Use the reusable hook to fetch products
  const { products, loading, error } = useProducts({
    category,
    search: searchQuery,
  });

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("wishlist");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Show error toast if fetch fails
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Use products directly from hook (backend handles filtering)
  const filteredProducts = products;

  // Determine page title
  const pageTitle =
    title ||
    (category === "lashes"
      ? "Lashes"
      : category === "brows"
      ? "Brows"
      : category === "tattoos" || category === "tattoo"
      ? "Tattoos"
      : category === "spa"
      ? "Spa"
      : category === "tools"
      ? "Tools"
      : category === "nails"
      ? "Nails"
      : "Shop All Products");

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (product: Product) => {
    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cartItems.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Convert backend product format to cart format
      const mainImage =
        Array.isArray(product.images) && product.images.length > 0
          ? typeof product.images[0] === "string"
            ? product.images[0]
            : product.images[0]?.url || "/placeholder.png"
          : "/placeholder.png";

      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage,
        quantity: 1,
        inStock: product.inStock,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} added to cart!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  // Format price to Naira
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  return (
    <div className="bg-[#fffaf5] text-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : pageTitle}
          </h1>
          {searchQuery && (
            <p className="text-gray-600">
              Found {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading products...</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              // Handle image format from backend
              const mainImage =
                Array.isArray(product.images) && product.images.length > 0
                  ? typeof product.images[0] === "string"
                    ? product.images[0]
                    : product.images[0]?.url || "/placeholder.png"
                  : "/placeholder.png";

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  {/* Image Container */}
                  <div
                    className="relative aspect-square"
                    style={{ backgroundColor: "#F0D5BD" }}>
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {/* Heart Icon - Always Visible */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-2 right-2 rounded-full p-2 transition-colors ${
                        favorites.includes(product.id)
                          ? "bg-yellow-500 text-white"
                          : "bg-white/80 text-gray-600 hover:bg-white"
                      }`}>
                      <Heart
                        size={16}
                        className={
                          favorites.includes(product.id) ? "fill-current" : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">
                      {product.name}
                    </h3>
                    <p className="font-bold mb-1 text-lg">
                      {formatPrice(product.price)}
                    </p>

                    {/* Rating with number */}
                    {product.averageRating !== undefined &&
                      product.averageRating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex items-center">
                            {renderStars(product.averageRating)}
                          </div>
                          <span className="text-xs text-gray-600 ml-1">
                            {product.averageRating}
                          </span>
                        </div>
                      )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                        product.inStock
                          ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}>
                      <ShoppingCart size={14} />
                      {product.inStock ? "Add to cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `No products match "${searchQuery}"`
                : "Try selecting a different category to see more products."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGrid = (props: ProductGridProps) => {
  return (
    <Suspense
      fallback={
        <div className="bg-[#fffaf5] text-gray-800 py-20 text-center">
          Loading products...
        </div>
      }>
      <ProductGridContent {...props} />
    </Suspense>
  );
};

export default ProductGrid;
