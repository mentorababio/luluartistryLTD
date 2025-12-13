"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Eye, Calendar } from "lucide-react";
import FilterTabs from "@/components/interactive/FilterTabs";
import { portfolioItems, categories } from "@/utils/portfolioData";

const PortfolioGallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Our Portfolio
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Explore our collection of beautiful work across all services. 
          Each piece is crafted with passion and attention to detail.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <FilterTabs
          filters={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    favorites.includes(item.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={favorites.includes(item.id) ? 'fill-current' : ''} 
                  />
                </button>
                <button className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors">
                  <Eye size={16} />
                </button>
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-4 left-4 bg-primary-gold text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary-gold uppercase tracking-wide">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-primary-gold transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No items found
          </h3>
          <p className="text-gray-500">
            Try selecting a different category to see more work.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredItems.length > 0 && (
        <div className="text-center mt-12">
          <button className="bg-primary-gold hover:bg-primary-gray text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            Load More Work
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioGallery;