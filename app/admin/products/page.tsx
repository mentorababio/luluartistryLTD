"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Star, ChevronDown, X, Upload, CheckCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

// ─── Variant types ──────────────────────────────────────────────────────────
// Flat shape the backend stores and ProductDetail.tsx already reads:
// { type, value, stock, priceAdjustment }

interface Variant {
  _id?: string;
  type: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

interface VariantValueRow {
  uid: string;
  _id?: string;
  value: string;
  stock: number;
  priceAdjustment: number;
}

interface VariantGroup {
  uid: string;
  type: string;
  isCustomType: boolean;
  values: VariantValueRow[];
}

const PRESET_VARIANT_TYPES = ["Curl", "Length", "Color", "Size", "Material"];

const makeUid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const groupVariants = (variants: Variant[]): VariantGroup[] => {
  const map = new Map<string, VariantGroup>();
  variants.forEach((v) => {
    if (!map.has(v.type)) {
      map.set(v.type, {
        uid: makeUid(),
        type: v.type,
        isCustomType: !PRESET_VARIANT_TYPES.includes(v.type),
        values: [],
      });
    }
    map.get(v.type)!.values.push({
      uid: makeUid(),
      _id: v._id,
      value: v.value,
      stock: v.stock,
      priceAdjustment: v.priceAdjustment,
    });
  });
  return Array.from(map.values());
};

const flattenVariants = (groups: VariantGroup[]): Variant[] =>
  groups.flatMap((g) =>
    g.values.map((v) => ({
      ...(v._id ? { _id: v._id } : {}),
      type: g.type.trim(),
      value: v.value.trim(),
      stock: v.stock,
      priceAdjustment: v.priceAdjustment,
    }))
  );

const validateVariantGroups = (groups: VariantGroup[]): string | null => {
  const seenTypes = new Set<string>();
  for (const g of groups) {
    const trimmedType = g.type.trim();
    if (!trimmedType) return "Every variant needs a type name (e.g. Curl, Length, Color).";
    if (seenTypes.has(trimmedType.toLowerCase())) {
      return `"${trimmedType}" is used more than once. Combine its values into one group.`;
    }
    seenTypes.add(trimmedType.toLowerCase());
    if (g.values.length === 0) return `Add at least one value under "${trimmedType}".`;

    const seenValues = new Set<string>();
    for (const v of g.values) {
      const trimmedValue = v.value.trim();
      if (!trimmedValue) return `Every value under "${trimmedType}" needs a name.`;
      if (seenValues.has(trimmedValue.toLowerCase())) {
        return `"${trimmedValue}" is repeated under "${trimmedType}".`;
      }
      seenValues.add(trimmedValue.toLowerCase());
      if (v.stock < 0) return `Stock for "${trimmedValue}" can't be negative.`;
      if (v.priceAdjustment < 0) return `Price adjustment for "${trimmedValue}" can't be negative.`;
    }
  }
  return null;
};

interface Product {
  id: string;
  name: string;
  category: any;
  price: number;
  stock: number;
  image: string;
  rating: number;
  variants: Variant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

// ─── Stable, top-level field components ────────────────────────────────────
// IMPORTANT: these must be defined OUTSIDE ProductsPage. Defining a component
// inside another component's body gives it a new identity on every render,
// which forces React to unmount + remount it (and anything with autoFocus
// inside it grabs focus back) every single time you type a character
// anywhere in the parent. Keeping them here as plain top-level functions
// keeps their identity stable across renders, so typing in any field no
// longer disturbs them.

interface ImageFieldProps {
  imagePreview: string;
  uploadingImage: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function ImageField({ imagePreview, uploadingImage, onUpload, onRemove }: ImageFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
      {imagePreview && (
        <div className="relative w-full h-40 mb-2 rounded-lg overflow-hidden bg-gray-100">
          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" id="img-upload" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
        <label htmlFor="img-upload"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
          {uploadingImage ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploadingImage ? "Uploading..." : "Choose Image"}
        </label>
        {imagePreview && (
          <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
    </div>
  );
}

interface VariantsSectionProps {
  groups: VariantGroup[];
  onAddGroup: () => void;
  onRemoveGroup: (groupUid: string) => void;
  onUpdateGroupType: (groupUid: string, type: string) => void;
  onToggleCustomType: (groupUid: string, isCustom: boolean) => void;
  onAddValue: (groupUid: string) => void;
  onRemoveValue: (groupUid: string, valueUid: string) => void;
  onUpdateValue: (
    groupUid: string,
    valueUid: string,
    field: "value" | "stock" | "priceAdjustment",
    newValue: string
  ) => void;
}

function VariantsSection({
  groups,
  onAddGroup,
  onRemoveGroup,
  onUpdateGroupType,
  onToggleCustomType,
  onAddValue,
  onRemoveValue,
  onUpdateValue,
}: VariantsSectionProps) {
  const totalCombinations = groups.reduce(
    (acc, g) => (g.values.length > 0 ? acc * g.values.length : acc),
    1
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-gray-700">Variants (optional)</label>
        {groups.length > 0 && (
          <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {groups.length}
          </span>
        )}
      </div>

      {groups.length === 0 ? (
        <button
          type="button"
          onClick={onAddGroup}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 hover:border-yellow-500 text-gray-500 hover:text-yellow-600 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Variant Type
        </button>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.uid} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {group.isCustomType ? (
                  <input
                    type="text"
                    value={group.type}
                    onChange={(e) => onUpdateGroupType(group.uid, e.target.value)}
                    placeholder="Custom type, e.g. Scent"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <select
                    value={group.type}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        onToggleCustomType(group.uid, true);
                      } else {
                        onUpdateGroupType(group.uid, e.target.value);
                      }
                    }}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Choose type</option>
                    {PRESET_VARIANT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                    <option value="__custom__">Custom...</option>
                  </select>
                )}
                {group.isCustomType && (
                  <button
                    type="button"
                    onClick={() => onToggleCustomType(group.uid, false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline whitespace-nowrap"
                  >
                    Use preset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveGroup(group.uid)}
                  className="text-gray-400 hover:text-red-500 p-1"
                  aria-label="Remove variant type"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {group.values.length > 0 && (
                <div className="grid grid-cols-[1fr_60px_70px_24px] gap-1.5 px-1 mb-1">
                  <span className="text-[11px] font-medium text-gray-400">Value</span>
                  <span className="text-[11px] font-medium text-gray-400">Stock</span>
                  <span className="text-[11px] font-medium text-gray-400">+₦</span>
                  <span></span>
                </div>
              )}

              <div className="space-y-1.5">
                {group.values.map((v) => (
                  <div key={v.uid} className="grid grid-cols-[1fr_60px_70px_24px] gap-1.5 items-center">
                    <input
                      type="text"
                      value={v.value}
                      onChange={(e) => onUpdateValue(group.uid, v.uid, "value", e.target.value)}
                      placeholder="e.g. Classic"
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => onUpdateValue(group.uid, v.uid, "stock", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                    <input
                      type="number"
                      min={0}
                      value={v.priceAdjustment}
                      onChange={(e) => onUpdateValue(group.uid, v.uid, "priceAdjustment", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveValue(group.uid, v.uid)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      aria-label="Remove value"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onAddValue(group.uid)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-yellow-600 hover:text-yellow-700"
              >
                <Plus size={12} /> Add value
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={onAddGroup}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 hover:border-yellow-500 text-gray-500 hover:text-yellow-600 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={14} /> Add Another Type
          </button>

          {totalCombinations > 1 && (
            <p className="text-xs text-gray-400 text-center">
              {totalCombinations} combinations across {groups.length} option{groups.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "", category: "", price: "", stock: "", description: "", imageUrl: ""
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [variantGroups, setVariantGroups] = useState<VariantGroup[]>([]);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const imageUrlRef = useRef<string>("");

  const getToken = () => localStorage.getItem("token");

  // ── Fetch products ────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/products?limit=200`);
      const json = await res.json();
      const list = json?.data?.products || json?.data || [];

      const transformed = list.map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock ?? 0,
        image: (p.images && p.images[0]?.url && p.images[0].url.startsWith("http"))
          ? p.images[0].url
          : "/placeholder-product.jpg",
        rating: p.averageRating || p.rating || 4,
        variants: p.variants || [],
      }));

      setProducts(transformed);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch categories ──────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      const json = await res.json();
      const cats = json?.data || [];
      setCategoriesList(cats.map((c: any) => ({
        id: c._id || c.id,
        name: c.name,
        slug: c.slug
      })));
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Category helpers ──────────────────────────────────────────────────────
  const getCategoryName = (cat: any): string => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    return cat.name || cat.slug || "";
  };

  const getCategoryId = (cat: any): string => {
    if (!cat) return "";
    if (typeof cat === "string") return cat;
    return cat._id || cat.id || "";
  };

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(p => {
        const catName = getCategoryName(p.category).toLowerCase();
        const catId = getCategoryId(p.category);
        const selectedCat = categoriesList.find(c => c.id === selectedCategory);
        if (!selectedCat) return false;
        return catName === selectedCat.name.toLowerCase() ||
               catId === selectedCat.id ||
               catName === selectedCat.slug;
      });

  // ── Upload image to Cloudinary via backend ────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("images", file);

      const res = await fetch(`https://luluartistry-backend.onrender.com/uploads/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Upload error response:", errorText);
        toast.error(`Upload failed: ${res.status}. Backend issue.`);
        return;
      }

      const json = await res.json();

      if (!json.success || !json.images || json.images.length === 0) {
        toast.error("Upload failed: No images returned from backend");
        return;
      }

      const imageUrl = json.images[0]?.url || json.images[0];

      if (!imageUrl || !imageUrl.startsWith("http")) {
        toast.error("Invalid image URL returned from server");
        return;
      }

      // ✅ Set ref first — this is what handlers will read
      imageUrlRef.current = imageUrl;
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success("Image uploaded successfully!");

    } catch (err) {
      console.error("Upload exception:", err);
      toast.error("Image upload failed: " + (err as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of stock", color: "text-red-600" };
    if (stock < 10) return { text: `${stock} units — Very low`, color: "text-red-600" };
    if (stock < 20) return { text: `${stock} units — Low stock`, color: "text-orange-600" };
    return { text: `${stock} units — In stock`, color: "text-green-600" };
  };

  const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

  // ── Variant group handlers ───────────────────────────────────────────────
  const addVariantGroup = () => {
    setVariantGroups((prev) => [
      ...prev,
      {
        uid: makeUid(),
        type: "",
        isCustomType: false,
        values: [{ uid: makeUid(), value: "", stock: 0, priceAdjustment: 0 }],
      },
    ]);
  };

  const removeVariantGroup = (groupUid: string) => {
    setVariantGroups((prev) => prev.filter((g) => g.uid !== groupUid));
  };

  const updateGroupType = (groupUid: string, type: string) => {
    setVariantGroups((prev) => prev.map((g) => (g.uid === groupUid ? { ...g, type } : g)));
  };

  const toggleCustomType = (groupUid: string, isCustom: boolean) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid ? { ...g, isCustomType: isCustom, type: isCustom ? "" : g.type } : g
      )
    );
  };

  const addVariantValue = (groupUid: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid
          ? { ...g, values: [...g.values, { uid: makeUid(), value: "", stock: 0, priceAdjustment: 0 }] }
          : g
      )
    );
  };

  const removeVariantValue = (groupUid: string, valueUid: string) => {
    setVariantGroups((prev) =>
      prev.map((g) =>
        g.uid === groupUid ? { ...g, values: g.values.filter((v) => v.uid !== valueUid) } : g
      )
    );
  };

 const updateVariantValue = (
  groupUid: string,
  valueUid: string,
  field: "value" | "stock" | "priceAdjustment",
  newValue: string // This is the raw string from the input
) => {
  setVariantGroups((prev) =>
    prev.map((g) => {
      if (g.uid !== groupUid) return g;
      return {
        ...g,
        values: g.values.map((v) => {
          if (v.uid !== valueUid) return v;

          // If the field is the text "value", just return the string
          if (field === "value") return { ...v, value: newValue };

          // If it's a number field, handle empty strings and parsing safely
          // This prevents the "0" stuck issue and allows for clearing the field
          const num = newValue === "" ? 0 : parseFloat(newValue);
          return { ...v, [field]: isNaN(num) ? 0 : num };
        }),
      };
    })
  );
};

  // ── Add product ───────────────────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!imageUrlRef.current || !imageUrlRef.current.startsWith("http")) {
      toast.error("Please upload a product image");
      return;
    }

    const variantError = validateVariantGroups(variantGroups);
    if (variantError) {
      toast.error(variantError);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description || "",
          images: [{ url: imageUrlRef.current, alt: formData.name }],
          variants: flattenVariants(variantGroups)
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed to add product");

      toast.success("Product added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", category: "", price: "", stock: "", description: "", imageUrl: "" });
      setImagePreview("");
      imageUrlRef.current = "";
      setVariantGroups([]);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Edit product ──────────────────────────────────────────────────────────
  const handleEditProduct = async () => {
    if (!selectedProduct || !formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }

    const variantError = validateVariantGroups(variantGroups);
    if (variantError) {
      toast.error(variantError);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = getToken();

      const body: any = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || "",
        variants: flattenVariants(variantGroups)
      };

      // ✅ Only update image if a new one was uploaded via ref
      if (imageUrlRef.current && imageUrlRef.current.startsWith("http")) {
        body.images = [{ url: imageUrlRef.current, alt: formData.name }];
      }

      const res = await fetch(`${BASE_URL}/products/${selectedProduct.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed to update product");

      toast.success("Product updated successfully!");
      setShowEditModal(false);
      setSelectedProduct(null);
      setFormData({ name: "", category: "", price: "", stock: "", description: "", imageUrl: "" });
      setImagePreview("");
      imageUrlRef.current = "";
      setVariantGroups([]);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete product ────────────────────────────────────────────────────────
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/products/${selectedProduct.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to delete product");
      }
      toast.success("Product deleted!");
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    const catId = getCategoryId(product.category);
    const existingImage = product.image !== "/placeholder-product.jpg" ? product.image : "";
    // ✅ Seed ref with existing image so edit without re-upload still sends it
    imageUrlRef.current = existingImage;
    setFormData({
      name: product.name,
      category: catId,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: "",
      imageUrl: existingImage
    });
    setImagePreview(existingImage);
    setVariantGroups(groupVariants(product.variants || []));
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage beauty products ({products.length} total)</p>
        </div>
        <button onClick={() => { setFormData({ name: "", category: "", price: "", stock: "", description: "", imageUrl: "" }); setImagePreview(""); imageUrlRef.current = ""; setVariantGroups([]); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
        <div className="relative w-64" ref={categoryDropdownRef}>
          <button onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            <span>{selectedCategory === "all" ? "All Categories" : categoriesList.find(c => c.id === selectedCategory)?.name || "All Categories"}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button onClick={() => { setSelectedCategory("all"); setShowCategoryDropdown(false); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg text-sm">
                All Categories
              </button>
              {categoriesList.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setShowCategoryDropdown(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 last:rounded-b-lg text-sm">
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin text-yellow-500" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const variantTypeCount = new Set((product.variants || []).map(v => v.type)).size;
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-gray-400 capitalize">{getCategoryName(product.category)}</p>
                    {variantTypeCount > 0 && (
                      <span className="bg-yellow-50 text-yellow-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {variantTypeCount} option{variantTypeCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">{product.name}</h3>
                  <p className="text-lg font-bold text-gray-900 mb-2">{formatPrice(product.price)}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                  <p className={`text-xs mb-4 ${stockStatus.color}`}>{stockStatus.text}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                      <Edit size={14} /> Edit
                    </button>
                    <button onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-500">No products found in this category</div>
          )}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
  <>
    {/* Glassmorphic Overlay */}
    <div 
      className="fixed inset-0 bg-white/10 backdrop-blur-sm z-50 transition-all duration-300" 
      onClick={() => setShowAddModal(false)} 
    />

    {/* Modal Container with Glassmorphism */}
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/70 backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
          <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="">Select category</option>
                    {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₦) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  {variantGroups.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">Stock is tracked per variant below once added.</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description" rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <ImageField
                  imagePreview={imagePreview}
                  uploadingImage={uploadingImage}
                  onUpload={handleImageUpload}
                  onRemove={() => { setImagePreview(""); setFormData(p => ({ ...p, imageUrl: "" })); imageUrlRef.current = ""; }}
                />
                <VariantsSection
                  groups={variantGroups}
                  onAddGroup={addVariantGroup}
                  onRemoveGroup={removeVariantGroup}
                  onUpdateGroupType={updateGroupType}
                  onToggleCustomType={toggleCustomType}
                  onAddValue={addVariantValue}
                  onRemoveValue={removeVariantValue}
                  onUpdateValue={updateVariantValue}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg">Cancel</button>
                <button onClick={handleAddProduct} disabled={isSubmitting}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader size={16} className="animate-spin" />}
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowEditModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₦) *</label>
                  <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock *</label>
                  <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                  {variantGroups.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">Stock is tracked per variant below.</p>
                  )}
                </div>
                <ImageField
                  imagePreview={imagePreview}
                  uploadingImage={uploadingImage}
                  onUpload={handleImageUpload}
                  onRemove={() => { setImagePreview(""); setFormData(p => ({ ...p, imageUrl: "" })); imageUrlRef.current = ""; }}
                />
                <VariantsSection
                  groups={variantGroups}
                  onAddGroup={addVariantGroup}
                  onRemoveGroup={removeVariantGroup}
                  onUpdateGroupType={updateGroupType}
                  onToggleCustomType={toggleCustomType}
                  onAddValue={addVariantValue}
                  onRemoveValue={removeVariantValue}
                  onUpdateValue={updateVariantValue}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => setShowEditModal(false)}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg">Cancel</button>
                <button onClick={handleEditProduct} disabled={isSubmitting}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowDeleteModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{selectedProduct.name}</strong>? This cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg">Keep it</button>
                <button onClick={handleDeleteProduct} disabled={isSubmitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg disabled:opacity-60 flex items-center justify-center gap-2">
                  {isSubmitting && <Loader size={16} className="animate-spin" />}
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}