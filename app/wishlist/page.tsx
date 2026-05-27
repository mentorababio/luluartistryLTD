"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";
import { products } from "@/utils/portfolioData";
import toast from "react-hot-toast";

// ── FIX: Ensure portfolioData products use real MongoDB _id as their `id` ─────
//
// In your utils/portfolioData.ts, each product's `id` field MUST be its real
// MongoDB _id string (e.g. "6849a1f3e7fc64e1cb800fc8"), NOT a number or slug.
//
// Example of correct portfolioData entry:
//   { id: "6849a1f3e7fc64e1cb800fc8", name: "Lash Bed", price: 230000, ... }
//
// If your portfolioData currently has numeric or slug ids, update them to match
// the _id values from your MongoDB products collection:
//   db.products.find({}, { name: 1 }).pretty()
//
// The wishlist addToCart below spreads the product directly, so product.id must
// already be a valid MongoDB ObjectId for checkout to work.
// ─────────────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("wishlist");
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(favoriteIds);
      const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));
      setWishlistProducts(favoriteProducts);
    }
  }, []);

  const removeFromWishlist = (productId: string) => {
    const updatedFavorites = favorites.filter(id => id !== productId);
    setFavorites(updatedFavorites);
    setWishlistProducts(wishlistProducts.filter(p => p.id !== productId));
    localStorage.setItem("wishlist", JSON.stringify(updatedFavorites));
  };

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // ── FIX: Guard against non-ObjectId ids from portfolioData ───────────────
    // If product.id is not a valid MongoDB ObjectId (24-char hex), warn and stop.
    const isValidObjectId = /^[a-f\d]{24}$/i.test(product.id);
    if (!isValidObjectId) {
      toast.error("This product isn't linked to our store yet. Please find it in the Shop.");
      return;
    }
    // ─────────────────────────────────────────────────────────────────────────

    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cartItems.find((item: any) => item.id === productId);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      // product.id is already the MongoDB _id, so spread is safe
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} added to cart!`);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
    ));

  const formatPrice = (price: number) => `₦${price.toLocaleString('en-NG')}`;

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="bg-primary-gray text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-gold">My Wishlist</h1>
          <p className="text-gray-300 mt-2">Your loved products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding products you love to your wishlist!</p>
            <Link href="/shop" className="inline-block bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="relative aspect-square" style={{ backgroundColor: '#F0D5BD' }}>
                    <Link href={`/product/${product.id}`}>
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 rounded-full p-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm mb-1 hover:text-primary-gold transition-colors">{product.name}</h3>
                    </Link>
                    <p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">{renderStars(product.rating)}</div>
                      <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.inStock}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                        product.inStock ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={14} />
                      {product.inStock ? 'Add to cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}