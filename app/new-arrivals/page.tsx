"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart, Loader } from "lucide-react";
import toast from "react-hot-toast";
import Curated from "@/components/home/Curated";
import MapSection from "@/components/common/MapSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luluartistry-backend.onrender.com/api";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
}

const Newarrival = () => {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Fetch new arrivals from API
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        const res = await fetch(
  `${BASE_URL}/products?isNewArrival=true&limit=50`,
  { cache: "no-store" }
);
        const json = await res.json();
        const list = json?.data?.products || json?.data || [];

        const transformed = list.map((p: any) => ({
          id:     p._id || p.id,
          name:   p.name,
          price:  p.price,
          image:  p.images?.[0]?.url || "/placeholder-product.jpg",
          rating: p.averageRating || p.rating || 4,
          stock:  p.stock ?? 0,
        }));

        setProducts(transformed);
      } catch (err) {
        toast.error("Failed to load new arrivals");
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }

    const savedCart  = localStorage.getItem("cart");
    const cartItems  = savedCart ? JSON.parse(savedCart) : [];
    const existing   = cartItems.find((item: any) => item.id === product.id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cartItems.push({
        id:      product.id,
        name:    product.name,
        price:   product.price,
        image:   product.image,
        quantity: 1,
        inStock: true,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ));

  return (
    <div className="bg-[#fffaf5] text-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">New Arrivals</h1>
          <p className="text-gray-500">Fresh picks just added to our collection</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">No new arrivals yet</p>
            <p className="text-sm mt-1">Check back soon for fresh products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="relative aspect-square" style={{ backgroundColor: "#F0D5BD" }}>
                  <Image
                    src={product.image}
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
                    }`}
                  >
                    <Heart
                      size={16}
                      className={favorites.includes(product.id) ? "fill-current" : ""}
                    />
                  </button>
                  {/* New Arrival badge */}
                  <span className="absolute top-2 left-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                    <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={14} />
                    {product.stock === 0 ? "Out of Stock" : "Add to cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Curated />
      <TestimonialCarousel />

      {/* Instagram Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Follow Us on Instagram</h2>
            <p className="text-gray-600">@lulusartistry.ng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[Igone, Igtwo, Igthree].map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="Instagram Post"
                width={300}
                height={300}
                className="rounded-xl object-cover w-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#fff9ef] py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Glow in Your Inbox
          </h2>
          <p className="text-gray-600 mb-6">Sign up for exclusive offers, original stories, events and more.</p>
          <form className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Your email, please"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:ring-2 focus:ring-yellow-500"
            />
            <button type="submit" className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700">
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