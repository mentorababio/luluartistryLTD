"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { StaticImageData } from "next/image";

// ── Local image map ───────────────────────────────────────────────────────────
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

interface Variant {
  _id?: string;
  type: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

interface BackendProduct {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: any;
  images?: Array<{ url: string; alt?: string }>;
  stock: number;
  inStock?: boolean;
  averageRating?: number;
  numOfReviews?: number;
  tags?: string[];
  specifications?: Array<{ key: string; value: string }>;
  variants?: Variant[];
}

interface ProductDetailProps {
  product: BackendProduct;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // ── Variant selection ─────────────────────────────────────────────────────
  const [selectedCurl, setSelectedCurl] = useState<string | null>(null);
  const [selectedLength, setSelectedLength] = useState<string | null>(null);

  const productId = product._id || product.id || "";
  const hasVariants = product.variants && product.variants.length > 0;

  // Group variants by type
  const curlVariants = product.variants?.filter(v => v.type === "Curl") || [];
  const lengthVariants = product.variants?.filter(v => v.type === "Length") || [];
  const otherVariants = product.variants?.filter(v => v.type !== "Curl" && v.type !== "Length") || [];

  // Group other variants by type
  const otherVariantTypes = [...new Set(otherVariants.map(v => v.type))];

  const [selectedOthers, setSelectedOthers] = useState<Record<string, string>>({});

  // Calculate current price based on selected variants
  const getCurrentPrice = () => {
    let price = product.price;
    if (selectedLength) {
      const lengthVariant = lengthVariants.find(v => v.value === selectedLength);
      if (lengthVariant) price += lengthVariant.priceAdjustment;
    }
    if (selectedCurl) {
      const curlVariant = curlVariants.find(v => v.value === selectedCurl);
      if (curlVariant) price += curlVariant.priceAdjustment;
    }
    Object.entries(selectedOthers).forEach(([type, value]) => {
      const variant = otherVariants.find(v => v.type === type && v.value === value);
      if (variant) price += variant.priceAdjustment;
    });
    return price;
  };

  const currentPrice = getCurrentPrice();

  // Check if can add to cart
  const canAddToCart = () => {
    if (!hasVariants) return inStock;
    if (curlVariants.length > 0 && !selectedCurl) return false;
    if (lengthVariants.length > 0 && !selectedLength) return false;
    for (const type of otherVariantTypes) {
      if (!selectedOthers[type]) return false;
    }
    return inStock;
  };

  const getImage = (): string | StaticImageData => {
    if (product.images && product.images.length > 0 && product.images[selectedImageIndex]?.url) {
      return product.images[selectedImageIndex].url;
    }
    return PRODUCT_IMAGE_MAP[product.name] || "https://placehold.co/600x600/F0D5BD/333?text=No+Image";
  };

  const allImages: Array<string | StaticImageData> = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : [PRODUCT_IMAGE_MAP[product.name] || "https://placehold.co/600x600/F0D5BD/333?text=No+Image"];

  const inStock = product.inStock ?? (product.stock > 0);
  const rating = product.averageRating || 4;
  const reviewCount = product.numOfReviews || 0;
  const categoryName = typeof product.category === "object"
    ? (product.category?.name || product.category?.slug || "")
    : product.category || "";

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      const ids = JSON.parse(saved);
      setIsFavorite(ids.includes(productId));
    }
  }, [productId]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={18}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
    ));

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + change, product.stock)));
  };

  const toggleFavorite = () => {
    const saved = localStorage.getItem("wishlist");
    const ids = saved ? JSON.parse(saved) : [];
    const updated = ids.includes(productId)
      ? ids.filter((id: string) => id !== productId)
      : [...ids, productId];
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleAddToCart = () => {
    if (!canAddToCart()) {
      if (hasVariants) {
        if (curlVariants.length > 0 && !selectedCurl) {
          toast.error("Please select a curl type");
          return;
        }
        if (lengthVariants.length > 0 && !selectedLength) {
          toast.error("Please select a length");
          return;
        }
        for (const type of otherVariantTypes) {
          if (!selectedOthers[type]) {
            toast.error(`Please select a ${type}`);
            return;
          }
        }
      }
      return;
    }

    const saved = localStorage.getItem("cart");
    const cartItems = saved ? JSON.parse(saved) : [];

    // Build variant description for cart display
    const variantParts = [];
    if (selectedCurl) variantParts.push(`Curl: ${selectedCurl}`);
    if (selectedLength) variantParts.push(`Length: ${selectedLength}`);
    Object.entries(selectedOthers).forEach(([type, value]) => {
      variantParts.push(`${type}: ${value}`);
    });
    const variantLabel = variantParts.join(", ");

    // Unique cart key includes variant
    const cartKey = `${productId}-${variantLabel || "default"}`;
    const existingItem = cartItems.find((item: any) => item.cartKey === cartKey);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity;
    } else {
      cartItems.push({
        id: productId,
        cartKey,
        name: product.name,
        price: currentPrice,
        image: typeof getImage() === "string"
          ? getImage()
          : "https://placehold.co/400x400/F0D5BD/333?text=No+Image",
        quantity,
        category: categoryName,
        inStock,
        variant: variantLabel || null,
        selectedCurl,
        selectedLength,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    toast.success(`${product.name}${variantLabel ? ` (${variantLabel})` : ""} added to cart!`);
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-[#C9A84C] transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={18} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Images ───────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#F0D5BD] rounded-2xl overflow-hidden">
              <Image
                src={getImage()}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized={typeof getImage() === "string" && (getImage() as string).startsWith("http")}
              />
              {!inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg">Out of Stock</span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImageIndex(i)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i ? "border-[#C9A84C]" : "border-gray-200"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover"
                      unoptimized={typeof img === "string" && img.startsWith("http")} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ─────────────────────────────────────────────── */}
          <div className="space-y-5">

            <div>
              <p className="text-sm font-medium text-[#C9A84C] uppercase tracking-wide mb-1">{categoryName}</p>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(rating)}</div>
                <span className="text-sm text-gray-500">
                  {rating} {reviewCount > 0 ? `(${reviewCount} reviews)` : "(No reviews yet)"}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-800">{formatPrice(currentPrice)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    Save {formatPrice(product.comparePrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {inStock
                ? <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> In Stock ({product.stock} available)
                  </span>
                : <span className="inline-flex items-center gap-1.5 text-sm text-red-500 font-medium">
                    <span className="w-2 h-2 bg-red-500 rounded-full" /> Out of Stock
                  </span>
              }
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* ── VARIANTS ─────────────────────────────────────────── */}
            {hasVariants && (
              <div className="space-y-4 border-t border-gray-100 pt-4">

                {/* Curl selector */}
                {curlVariants.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Curl Type <span className="text-red-400">*</span>
                      {selectedCurl && <span className="text-[#C9A84C] font-normal ml-2">— {selectedCurl}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {curlVariants.map((v) => (
                        <button
                          key={v._id || v.value}
                          onClick={() => setSelectedCurl(selectedCurl === v.value ? null : v.value)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                            selectedCurl === v.value
                              ? "border-[#C9A84C] bg-yellow-50 text-[#C9A84C]"
                              : "border-gray-200 text-gray-600 hover:border-[#C9A84C]"
                          }`}
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Length selector */}
                {lengthVariants.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Length <span className="text-red-400">*</span>
                      {selectedLength && <span className="text-[#C9A84C] font-normal ml-2">— {selectedLength}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lengthVariants.map((v) => (
                        <button
                          key={v._id || v.value}
                          onClick={() => setSelectedLength(selectedLength === v.value ? null : v.value)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedLength === v.value
                              ? "border-[#C9A84C] bg-yellow-50 text-[#C9A84C]"
                              : "border-gray-200 text-gray-600 hover:border-[#C9A84C]"
                          }`}
                        >
                          {v.value}
                          {v.priceAdjustment > 0 && (
                            <span className="text-xs text-gray-400 ml-1">+₦{v.priceAdjustment.toLocaleString()}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other variant types */}
                {otherVariantTypes.map((type) => {
                  const typeVariants = otherVariants.filter(v => v.type === type);
                  return (
                    <div key={type}>
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {type} <span className="text-red-400">*</span>
                        {selectedOthers[type] && (
                          <span className="text-[#C9A84C] font-normal ml-2">— {selectedOthers[type]}</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {typeVariants.map((v) => (
                          <button
                            key={v._id || v.value}
                            onClick={() => setSelectedOthers(prev => ({
                              ...prev,
                              [type]: prev[type] === v.value ? "" : v.value
                            }))}
                            className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                              selectedOthers[type] === v.value
                                ? "border-[#C9A84C] bg-yellow-50 text-[#C9A84C]"
                                : "border-gray-200 text-gray-600 hover:border-[#C9A84C]"
                            }`}
                          >
                            {v.value}
                            {v.priceAdjustment > 0 && (
                              <span className="text-xs text-gray-400 ml-1">+₦{v.priceAdjustment.toLocaleString()}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Selection reminder */}
                {!canAddToCart() && inStock && (
                  <p className="text-xs text-orange-500">
                    Please select all options above before adding to cart
                  </p>
                )}
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Specifications</h3>
                <div className="space-y-1.5">
                  {product.specifications.map((spec, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <span className="text-gray-500 min-w-[120px]">{spec.key}:</span>
                      <span className="text-gray-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2.5 hover:bg-gray-100 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-2 border-x border-gray-300 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <button onClick={() => handleQuantityChange(1)} className="p-2.5 hover:bg-gray-100 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors border ${
                    isFavorite
                      ? "bg-yellow-500 text-white border-yellow-500"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  }`}
                >
                  <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-colors ${
                    !inStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : canAddToCart()
                      ? "bg-[#C9A84C] hover:bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {!inStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Shipping info */}
            <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <Truck className="text-[#C9A84C] flex-shrink-0" size={18} />
                <span className="text-sm text-gray-600">Delivery across Nigeria — 2–4 business days</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-[#C9A84C] flex-shrink-0" size={18} />
                <span className="text-sm text-gray-600">Quality guaranteed on all products</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-[#C9A84C] flex-shrink-0" size={18} />
                <span className="text-sm text-gray-600">Contact us within 48hrs for damaged items</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;