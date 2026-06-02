"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Star, ChevronDown, X, Upload, CheckCircle, Loader } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

interface Product {
  id: string;
  name: string;
  category: any;
  price: number;
  stock: number;
  image: string;
  rating: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
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
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

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
        category: p.category, // keep full object
        price: p.price,
        stock: p.stock ?? 0,
        // ── FIX: correctly extract image URL from images array ────────────
        image: (p.images && p.images[0] && p.images[0].url) || p.image || "/placeholder-product.jpg",
        rating: p.averageRating || p.rating || 4,
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

  // ── FIX: Category filter — handle category as object or string ────────────
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
  // ─────────────────────────────────────────────────────────────────────────

  // ── Upload image to Cloudinary via backend ────────────────────────────────
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const token = getToken();
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(`https://luluartistry-backend.onrender.com/uploads/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });

      if (!res.ok) {
        toast.error("Image upload failed. Please try again.");
        setUploadingImage(false);
        return;
      }

      const json = await res.json();
      const url = json?.data?.url || json?.url;
      if (url) {
        // Show the uploaded URL (not blob)
        setImagePreview(url);
        setFormData(prev => ({ ...prev, imageUrl: url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("No image URL returned from server");
      }
    } catch (err) {
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

  // ── Add product ───────────────────────────────────────────────────────────
  const handleAddProduct = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!formData.imageUrl) {
      toast.error("Please upload a product image");
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
          images: [{ url: formData.imageUrl, alt: formData.name }]
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed to add product");

      toast.success("Product added successfully!");
      setShowAddModal(false);
      setFormData({ name: "", category: "", price: "", stock: "", description: "", imageUrl: "" });
      setImagePreview("");
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

    setIsSubmitting(true);
    try {
      const token = getToken();
      
      const body: any = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || ""
      };

      // Only update image if it was changed and is a valid HTTP URL
      if (formData.imageUrl && formData.imageUrl.startsWith("http")) {
        body.images = [{ url: formData.imageUrl, alt: formData.name }];
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
    setFormData({
      name: product.name,
      category: catId,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: "",
      imageUrl: product.image !== "/placeholder-product.jpg" ? product.image : ""
    });
    setImagePreview(product.image !== "/placeholder-product.jpg" ? product.image : "");
    setShowEditModal(true);
  };

  const ImageField = () => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
      {imagePreview && (
        <div className="relative w-full h-40 mb-2 rounded-lg overflow-hidden bg-gray-100">
          <Image src={imagePreview} alt="Preview" fill className="object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" id="img-upload" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
        <label htmlFor="img-upload"
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm">
          {uploadingImage ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploadingImage ? "Uploading..." : "Choose Image"}
        </label>
        {imagePreview && (
          <button onClick={() => { setImagePreview(""); setFormData(p => ({ ...p, imageUrl: "" })); }}
            className="text-red-500 hover:text-red-700 text-sm">Remove</button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage beauty products ({products.length} total)</p>
        </div>
        <button onClick={() => { setFormData({ name: "", category: "", price: "", stock: "", description: "", imageUrl: "" }); setImagePreview(""); setShowAddModal(true); }}
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
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-1 capitalize">{getCategoryName(product.category)}</p>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
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
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description" rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
                </div>
                <ImageField />
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
                </div>
                <ImageField />
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
