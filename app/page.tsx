"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Curated from "@/components/home/Curated";
import Features from "@/components/home/Features";
import FounderCard from "@/components/home/FounderCard";
import Hero from "@/components/home/Hero";
import MapSection from "@/components/common/MapSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";

import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";
import Instagram1 from "@/assets/images/testimony2.png";
import Instagram2 from "@/assets/images/testimony1.png";
import Instagram3 from "@/assets/images/testimony3.png";
import Instagram4 from "@/assets/images/IG4.png";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luluartistry-backend.onrender.com/api";

const page = () => {
  const router = useRouter();
  const [favorites, setFavorites]           = useState<string[]>([]);
  const [newArrivals, setNewArrivals]       = useState<any[]>([]);
  const [arrivalsLoading, setArrivalsLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Fetch new arrivals from API — only products marked isNewArrival=true
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
       const res = await fetch(
  `${BASE_URL}/products?isNewArrival=true&limit=8`,
  { cache: "no-store" }
);
        const json = await res.json();
        const list = json?.data?.products || json?.data || [];
        setNewArrivals(
          list.map((p: any) => ({
            id:     p._id || p.id,
            name:   p.name,
            price:  p.price,
            image:  p.images?.[0]?.url?.startsWith("http")
                      ? p.images[0].url
                      : "/placeholder-product.jpg",
            rating: p.averageRating || p.rating || 4,
            stock:  p.stock ?? 0,
          }))
        );
      } catch {
        // silently fail — home page still loads without new arrivals
      } finally {
        setArrivalsLoading(false);
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

  const addToCart = (product: any) => {
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
        id:       product.id,
        name:     product.name,
        price:    product.price,
        image:    product.image,
        quantity: 1,
        inStock:  true,
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
      <Hero />
      <Features />
      <Curated />
      <FounderCard />

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">NEW ARRIVALS</h1>
        </div>

        {arrivalsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-yellow-500 border-t-transparent rounded-full" />
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No new arrivals yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative aspect-square" style={{ backgroundColor: "#F0D5BD" }}>
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
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
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                  <p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                    <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
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

      <TestimonialCarousel />

      {/* Instagram Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Follow Us on Instagram</h2>
            <p className="text-gray-600">@luluartistry.ng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[Instagram1, Instagram2, Instagram3, Instagram4].map((img, i) => (
              <Image
                key={i}
                src={img}
                alt="Instagram Post"
                width={300}
                height={450}
                className="rounded-xl object-cover w-full h-[250px]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#fff9ef] py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Glow in Your Inbox
          </h2>
          <p className="text-gray-600 mb-6">
            Get exclusive beauty tips, product updates, and special offers straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <MapSection />
    </div>
  );
};

export default page;