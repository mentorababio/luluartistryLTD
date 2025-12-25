"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Curated from "@/components/home/Curated";
import MapSection from "@/components/common/MapSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import { useProducts, Product } from "@/hooks/useProducts";

// Import Instagram images
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";

const Newarrival = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch new arrivals from backend (sorted by newest first)
  const { products: newArrivals, loading } = useProducts({
    sort: "-createdAt", // Sort by newest first
    limit: 16,
  });

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("wishlist");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
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

  return (
    <div className="bg-[#fffaf5] text-gray-800">
      {/* ===================== NEW ARRIVALS ===================== */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading new arrivals...</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => {
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
                  <div
                    className="relative aspect-square"
                    style={{ backgroundColor: "#F0D5BD" }}>
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
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
        {!loading && newArrivals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No new arrivals available</p>
          </div>
        )}
      </div>

      {/* ===================== CURATED BY LULU ===================== */}
      <Curated />

      {/* ===================== TESTIMONIALS ===================== */}
      <TestimonialCarousel />

      {/* ===================== INSTAGRAM ===================== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Follow Us on Instagram
            </h2>
            <p className="text-gray-600">@lulusartistry.ng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Image
              src={Igone}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
            <Image
              src={Igtwo}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
            <Image
              src={Igthree}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="bg-[#fff9ef] py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Glow in Your Inbox
          </h2>
          <p className="text-gray-600 mb-6">
            Sign up for exclusive offers, original stories, events and more.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Your email, please"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <MapSection />
    </div>
  );
};

export default Newarrival;
