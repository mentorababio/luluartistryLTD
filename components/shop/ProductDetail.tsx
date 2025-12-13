"use client";

import { useState } from "react";
import { Heart, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import ImageCarousel from "@/components/interactive/ImageCarousel";
import { Product } from "@/utils/portfolioData";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={18}
        className={`${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <ImageCarousel
            images={product.images}
            alt={product.name}
            className="aspect-[4/5]"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-primary-gold uppercase tracking-wide">
                {product.category}
              </span>
              {product.featured && (
                <span className="bg-primary-gold text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFavorite
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
              
              <button
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  product.inStock
                    ? 'bg-primary-gold hover:bg-primary-gray text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="text-primary-gold" size={20} />
              <span className="text-sm text-gray-600">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="text-primary-gold" size={20} />
              <span className="text-sm text-gray-600">
                30-day money-back guarantee
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="text-primary-gold" size={20} />
              <span className="text-sm text-gray-600">
                Easy returns and exchanges
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;