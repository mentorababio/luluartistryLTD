"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import type { StaticImageData } from "next/image";

// ── Local image imports ───────────────────────────────────────────────────────
import browmapping from "@/assets/images/brow mapping pen.png";
import browsealant from "@/assets/images/brow sealant.png";
import Dbed from "@/assets/images/DBed cover.png";
import DoubleArm from "@/assets/images/Double ARM LIGHT.png";
import Dummyhead from "@/assets/images/Dummy head.png";
import ExScrup from "@/assets/images/ExScrup.png";
import eyePatches from "@/assets/images/eye patch.png";
import Ibprimer from "@/assets/images/Ib primer.png";
import lashbed from "@/assets/images/lash bed.png";
import lashblanket from "@/assets/images/lash bed blanket.png";
import lashwash from "@/assets/images/lash wash brush.png";
import OneBtm from "@/assets/images/One BTM.png";
import twoBtm from "@/assets/images/two btm.png";
import oneBtmCover from "@/assets/images/One BTM cover.png";
import Rqfr from "@/assets/images/Rose QFR.png";
import stool from "@/assets/images/stool.png";
import moonLight from "@/assets/images/moon light tray.png";
import moonLightInches from "@/assets/images/moon light inches.png";
import Glove from "@/assets/images/Glove.png";
import EasyLash from "@/assets/images/Easy lash fan tray.png";
import ClassicLash from "@/assets/images/classic lash fan.png";
import LashGlueTen from "@/assets/images/lash glue ten.png";
import LashGlueFive from "@/assets/images/lash glue five.png";
import LashBreathTape from "@/assets/images/lash breathable table.png";
import LashTransTape from "@/assets/images/lash trans tape.png";
import volumetweazer from "@/assets/images/volume tweezer.png";
import fibertweazer from "@/assets/images/fiber tip tweezer.png";
import lashfan from "@/assets/images/lash fan.png";
import gluering from "@/assets/images/glue ring.png";
import CurvedIsolation from "@/assets/images/curvad isolation.png";
import lashsealant from "@/assets/images/lash sealant.png";
import gluestorage from "@/assets/images/Glue Storage.png";
import Luxuryspa from "@/assets/images/Luxury spa body oil.png";
import Herbalsalt from "@/assets/images/Herbal Bath salts.png";
import Aromatherapy from "@/assets/images/Aromatherapy.png";
import greentea from "@/assets/images/green tea.png";
import claydetox from "@/assets/images/clay detox.png";
import coolingeye from "@/assets/images/cooling eye.png";
import Eucalyptus from "@/assets/images/Eucalyptus.png";
import coconutmilk from "@/assets/images/coconut milk.png";
import footscrub from "@/assets/images/Foot scrub.png";
import silksleep from "@/assets/images/Silk sleep.png";
import Detox from "@/assets/images/Detox.png";
import messagebalm from "@/assets/images/message balm.png";
import hydratingsheet from "@/assets/images/Hydrating sheet.png";
import spaTowelSet from "@/assets/images/spa towel set.png";
import rose from "@/assets/images/rose.png";
import spaIncense from "@/assets/images/spa incense.png";
import luxuryspaGift from "@/assets/images/luxury spa gift.png";
import MastP60 from "@/assets/images/P60.png";
import FandE from "@/assets/images/FandE (1).png";
import GoldenRose from "@/assets/images/GoldenRose.png";
import tag45 from "@/assets/images/tag45.png";
import numb from "@/assets/images/numb.png";
import mastpro from "@/assets/images/mastpro.png";
import mappingstring from "@/assets/images/mapping string.png";

const PRODUCT_IMAGE_MAP: Record<string, StaticImageData> = {
  "Moon Light Tray": moonLight, "Stool": stool, "Lash Bed": lashbed,
  "Disposable Bed Cover": Dbed, "Glove": Glove,
  "One Battery Tattoo Machine": OneBtm, "Two Battery Tattoo Machine": twoBtm,
  "Moon Light 26 Inches": moonLightInches, "Eye Patch": eyePatches,
  "Lash Bed Blanket": lashblanket, "Brow Mapping Pen": browmapping,
  "Lash Wash Brush": lashwash, "IB Primer": Ibprimer, "Brow Sealant": browsealant,
  "Dummy Head": Dummyhead, "Double Arm Light": DoubleArm,
  "Easy Lash Fan Tray": EasyLash, "Classic Lash Fan": ClassicLash,
  "Lash Glue 10ml": LashGlueTen, "Lash Glue 5ml": LashGlueFive,
  "Lash Breathable Tape": LashBreathTape, "Lash Transparent Tape": LashTransTape,
  "Volume Tweezer": volumetweazer, "Fiber Tip Tweezer": fibertweazer,
  "Lash Fan": lashfan, "Glue Ring": gluering,
  "Curved Isolation Tweezer": CurvedIsolation, "Lash Sealant": lashsealant,
  "Glue Storage": gluestorage, "Mast P60 Machine": MastP60,
  "One Battery Tattoo Machine Cover": oneBtmCover, "F&E Primary Cream": FandE,
  "Golden Rose Anesthe": GoldenRose, "Tag 45 Secondary Numb": tag45,
  "Primary Numb Cream": numb, "Mast Pro Cartridge 20pcs": mastpro,
  "Mapping Strings": mappingstring, "Luxury Spa Body Oil": Luxuryspa,
  "Herbal Bath Salt": Herbalsalt, "Aromatherapy Candle": Aromatherapy,
  "Green Tea Facial Mask": greentea, "Exfoliating Body Scrub": ExScrup,
  "Rose Quartz Facial Roll": Rqfr, "Clay Detox Mask": claydetox,
  "Cooling Eye Gel Pad": coolingeye, "Eucalyptus Shower Steamer": Eucalyptus,
  "Coconut Milk Bath Soak": coconutmilk, "Luxury Foot Scrub": footscrub,
  "Silk Sleep Mask": silksleep, "Detox Herbal Tea Blend": Detox,
  "Body Massage Balm": messagebalm, "Hydrating Sheet Mask": hydratingsheet,
  "Luxury Spa Towel Set": spaTowelSet, "Rose Infused Toner Mist": rose,
  "Spa Incense Sticks": spaIncense, "Luxury Spa Gift Set": luxuryspaGift,
};

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

interface ProductGridProps {
  category?: string;
  title?: string;
}

const ProductGridContent = ({ category, title }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const savedFavorites = localStorage.getItem("wishlist");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/products?limit=100`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const list = json?.data?.products || json?.data || [];

        const transformed = list.map((p: any) => ({
          id: p._id || p.id,
          name: p.name,
          description: p.description || "",
          category: typeof p.category === "object"
            ? (p.category?.slug || p.category?.name || "")
            : p.category,
          price: p.price,
          stock: p.stock ?? 0,
          inStock: p.inStock ?? ((p.stock ?? 0) > 0),
          image: (p.images && p.images[0] && p.images[0].url)
            || PRODUCT_IMAGE_MAP[p.name]
            || null,
          rating: p.averageRating || 4,
        }));

        setProducts(transformed.filter((p: any) => p.image));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  let filteredProducts = category && category !== "all"
    ? products.filter((p) => {
        const pc = String(p.category || "").toLowerCase();
        const fc = category.toLowerCase();
        const categoryMap: Record<string, string[]> = {
          lashes:  ["lashes", "lash"],
          tattoo:  ["tattoos", "tattoo"],
          tattoos: ["tattoos", "tattoo"],
          brows:   ["brows", "brow"],
          spa:     ["spa", "spas"],
          tools:   ["tools"],
          nails:   ["nails"],
        };
        const valid = categoryMap[fc] || [fc];
        return valid.some((cat) => pc.includes(cat));
      })
    : products;

  if (searchQuery) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery)
    );
  }

  const pageTitle = title || (
    category === "lashes"                           ? "Lashes"  :
    category === "brows"                            ? "Brows"   :
    category === "tattoos" || category === "tattoo" ? "Tattoos" :
    category === "spa"                              ? "Spa"     :
    category === "tools"                            ? "Tools"   :
    category === "nails"                            ? "Nails"   :
    "Shop All Products"
  );

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    const savedCart = localStorage.getItem("cart");
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name} added to cart!`);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
    ));

  const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

  if (loading) {
    return (
      <div className="bg-[#fffaf5] min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#fffaf5] text-gray-800">
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : pageTitle}
          </h1>
          {searchQuery && (
            <p className="text-gray-600">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden block"
            >
              {/* Image */}
              <div className="relative aspect-square" style={{ backgroundColor: "#F0D5BD" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {/* Heart button */}
                <button
                  onClick={(e) => toggleFavorite(e, product.id)}
                  className={`absolute top-2 right-2 rounded-full p-2 transition-colors z-10 ${
                    favorites.includes(product.id)
                      ? "bg-yellow-500 text-white"
                      : "bg-white/80 text-gray-600 hover:bg-white"
                  }`}
                >
                  <Heart size={16} className={favorites.includes(product.id) ? "fill-current" : ""} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-1 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                </div>
                <button
                  onClick={(e) => addToCart(e, product)}
                  disabled={!product.inStock}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
                    product.inStock
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={14} />
                  {product.inStock ? "Add to cart" : "Out of Stock"}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try selecting a different category to see more products.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductGrid = (props: ProductGridProps) => (
  <Suspense fallback={<div className="bg-[#fffaf5] py-20 text-center">Loading products...</div>}>
    <ProductGridContent {...props} />
  </Suspense>
);

export default ProductGrid;