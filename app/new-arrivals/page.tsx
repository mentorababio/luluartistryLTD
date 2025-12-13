"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Curated from "@/components/home/Curated";
import MapSection from "@/components/common/MapSection";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";

// Import your product images from assets
import Dbed from "@/assets/images/DBed cover.png";
import ExScrup from "@/assets/images/ExScrup.png";
import Rqfr from "@/assets/images/Rose QFR.png";
import OneBtm from "@/assets/images/One BTM.png";
import twoBtm from "@/assets/images/two btm.png";
import oneBtmCover from "@/assets/images/One BTM cover.png";
import lashbed from "@/assets/images/lash bed.png";
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";
import MastP60 from "@/assets/images/P60.png";
import primer from "@/assets/images/Ib primer.png";
import browsalant from "@/assets/images/brow sealant.png";
import dummyhead from "@/assets/images/Dummy head.png";
import doublearm from "@/assets/images/Double ARM LIGHT.png";
import eyepatch from "@/assets/images/eye patch.png";
import lashblanket from "@/assets/images/lash bed blanket.png";
import browmapping from "@/assets/images/brow mapping pen.png";
import lashwash from "@/assets/images/lash wash brush.png";

const Newarrival = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("wishlist");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const newArrivals = [
    { id: 1, name: "Lash Bed", price: 230000, image: lashbed, rating: 4.5 },
    { id: 2, name: "Disposable Bed Cover", price: 24000, image: Dbed, rating: 4.8 },
    { id: 3, name: "Exfoliating Body Scrub", price: 14000, image: ExScrup, rating: 4.3 },
    { id: 4, name: "Rose Quartz Facial Roll", price: 12000, image: Rqfr, rating: 4.7 },
    { id: 5, name: "Mast P60 Machine", price: 450000, image: MastP60, rating: 4.9 },
    { id: 6, name: "One Battery Tattoo Machine", price: 55000, image: OneBtm, rating: 4.9 },
    { id: 7, name: "Two Battery Tattoo Machine", price: 45000, image: twoBtm, rating: 4.4 },
    { id: 8, name: "One Battery Tattoo Machine Cover", price: 500, image: oneBtmCover, rating: 4.2 },
    { id: 9, name: "Ib Primer", price: 10000, image: primer, rating: 4.2 },
    { id: 10, name: "Brow Sealant", price: 10000, image: browsalant, rating: 4.2 },
    { id: 11, name: "Dummy Head", price: 6500, image: dummyhead, rating: 4.2 },
    { id: 12, name: "Double ARM LIGHT", price: 65000, image: doublearm, rating: 4.2 },
    { id: 13, name: "Eye Patch", price: 5000, image: eyepatch, rating: 4.2 },
    { id: 14, name: "Lash Bed Blanket", price: 25000, image: lashblanket, rating: 4.2 },
    { id: 15, name: "Brow Mapping Pen", price: 4500, image: browmapping, rating: 4.2 },
    { id: 16, name: "Lash Wash Brush", price: 2000, image: lashwash, rating: 4.2 },
  ];

  const toggleFavorite = (productId: number) => {
    const idStr = productId.toString();
    setFavorites(prev => {
      const updated = prev.includes(idStr) 
        ? prev.filter(id => id !== idStr)
        : [...prev, idStr];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (productId: number) => {
    const product = newArrivals.find(p => p.id === productId);
    if (!product) return;

    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find((item: any) => item.id === productId.toString());
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // Convert product to match cart format
      cartItems.push({ 
        id: productId.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        inStock: true
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString('en-NG')}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative aspect-square" style={{ backgroundColor: '#F0D5BD' }}>
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute top-2 right-2 rounded-full p-2 transition-colors ${
                    favorites.includes(product.id.toString())
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={favorites.includes(product.id.toString()) ? 'fill-current' : ''} 
                  />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
                
                {/* Rating with number */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <ShoppingCart size={14} />
                  Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== CURATED BY LULU ===================== */}
      <Curated />

      {/* ===================== TESTIMONIALS ===================== */}
      <TestimonialCarousel />

      {/* ===================== INSTAGRAM ===================== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Follow Us on Instagram</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
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

export default Newarrival;
