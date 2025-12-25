"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  ChevronDown,
  X,
  Upload,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { apiClient, ApiError } from "@/lib/api/client";

export default function ProductsPage() {
  // Use hooks to fetch products and categories from backend
  const {
    products: fetchedProducts,
    loading: productsLoading,
    refetch,
  } = useProducts();
  const { categories: fetchedCategories, loading: categoriesLoading } =
    useCategories({ activeOnly: true });

  // Sync hook products with local state for admin operations
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Build categories list for dropdown
  const categories = [
    "All Categories",
    ...fetchedCategories.map((cat) => cat.name),
  ];
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showCancelToast, setShowCancelToast] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Sync products from hook
  useEffect(() => {
    setProducts(fetchedProducts);
    setLoading(productsLoading || categoriesLoading);
  }, [fetchedProducts, productsLoading, categoriesLoading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter products by category (category is now an object)
  const filteredProducts =
    selectedCategory === "All Categories"
      ? products
      : products.filter((p) => {
          // Handle category as object from backend
          const categoryName =
            typeof p.category === "object" ? p.category.name : p.category;
          return categoryName === selectedCategory;
        });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of stock", color: "text-red-600" };
    if (stock < 10)
      return { text: `${stock} units Very low`, color: "text-red-600" };
    if (stock < 20)
      return { text: `${stock} units Low stock`, color: "text-orange-600" };
    return { text: `${stock} units In stock`, color: "text-green-600" };
  };

  const handleAddProduct = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Prepare product data for backend
      const productData: any = {
        name: formData.name,
        category: formData.category, // This is now the category ID
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        isActive: true,
      };

      // Add images if provided
      if (formData.image) {
        productData.images = [formData.image];
      }

      // Call API to create product
      await apiClient.post("/products", productData);

      // Refresh products list
      await refetch();

      setFormData({ name: "", category: "", price: "", stock: "", image: "" });
      setShowAddModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      toast.success("Product added successfully!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(error?.message || "Failed to add product. Please try again.");
    }
  };

  const handleEditProduct = async () => {
    if (
      !selectedProduct ||
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Prepare product data for backend
      const productData: any = {
        name: formData.name,
        category: formData.category, // This is now the category ID
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      // Add images if provided
      if (formData.image) {
        productData.images = [formData.image];
      }

      // Call API to update product
      await apiClient.put(`/products/${selectedProduct.id}`, productData);

      // Refresh products list
      await refetch();

      setShowEditModal(false);
      setSelectedProduct(null);
      setFormData({ name: "", category: "", price: "", stock: "", image: "" });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      toast.success("Product updated successfully!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        error?.message || "Failed to update product. Please try again."
      );
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      // Call API to delete product
      await apiClient.delete(`/products/${selectedProduct.id}`);

      // Refresh products list
      await refetch();

      setShowDeleteModal(false);
      setSelectedProduct(null);
      toast.success("Product deleted successfully!");
    } catch (err) {
      const error = err as ApiError;
      toast.error(
        error?.message || "Failed to delete product. Please try again."
      );
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    // Handle image format from backend
    const productImage =
      Array.isArray(product.images) && product.images.length > 0
        ? typeof product.images[0] === "string"
          ? product.images[0]
          : product.images[0]?.url || ""
        : "";
    // Get category ID from product (category is an object with id)
    const categoryId =
      typeof product.category === "object"
        ? product.category.id || product.category._id
        : product.category;
    setFormData({
      name: product.name,
      category: categoryId, // Store category ID instead of name
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: productImage,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage beauty products</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: "",
              category: "",
              price: "",
              stock: "",
              image: "",
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Filter by Category
        </label>
        <div className="relative" ref={categoryDropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full md:w-64 flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
            <span>{selectedCategory}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full md:w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg">
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading products...</div>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            // Handle image format from backend
            const productImage =
              Array.isArray(product.images) && product.images.length > 0
                ? typeof product.images[0] === "string"
                  ? product.images[0]
                  : product.images[0]?.url || "/placeholder-product.jpg"
                : "/placeholder-product.jpg";

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={productImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    {formatPrice(product.price)}
                  </p>
                  {product.averageRating !== undefined &&
                    product.averageRating > 0 && (
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.floor(product.averageRating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    )}
                  <p className={`text-sm mb-4 ${stockStatus.color}`}>
                    {stockStatus.text}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No products found</div>
          <p className="text-gray-500">Add your first product to get started</p>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => {
              setShowAddModal(false);
              setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                image: "",
              });
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Product
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: "",
                      category: "",
                      price: "",
                      stock: "",
                      image: "",
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Add a new product or spa treatment to your inventory.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="">Select category</option>
                    {fetchedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock level
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            image: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className="hidden"
                      id="add-image-upload"
                    />
                    <label
                      htmlFor="add-image-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.image ? "File selected" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      name: "",
                      category: "",
                      price: "",
                      stock: "",
                      image: "",
                    });
                    setShowCancelToast(true);
                    setTimeout(() => setShowCancelToast(false), 3000);
                  }}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddProduct}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
              setFormData({
                name: "",
                category: "",
                price: "",
                stock: "",
                image: "",
              });
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setFormData({
                      name: "",
                      category: "",
                      price: "",
                      stock: "",
                      image: "",
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="">Select category</option>
                    {fetchedCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formatPrice(parseFloat(formData.price) || 0)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      setFormData({ ...formData, price: value });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock level
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            image: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label
                      htmlFor="edit-image-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.image
                        ? "Image-848485-De.jpg"
                        : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedProduct(null);
                    setFormData({
                      name: "",
                      category: "",
                      price: "",
                      stock: "",
                      image: "",
                    });
                  }}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleEditProduct}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Save Change
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="text-red-600" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Product
              </h2>
              <p className="text-gray-600 mb-6">
                You're going to delete your product
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedProduct(null);
                    setShowCancelToast(true);
                    setTimeout(() => setShowCancelToast(false), 3000);
                  }}
                  className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                  No, Keep it
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Yes, Delete!
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Change applied successfully
              </p>
              <p className="text-sm text-gray-600">👍</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Toast */}
      {showCancelToast && (
        <div className="fixed top-6 right-6 z-50 bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <X className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Okay, Canceled</p>
            </div>
            <button
              onClick={() => setShowCancelToast(false)}
              className="ml-4 p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
