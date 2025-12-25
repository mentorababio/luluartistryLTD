import { useState, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api/client";

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  id: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  images: Array<{ url?: string; alt?: string }> | string[];
  stock: number;
  lowStockThreshold?: number;
  isFeatured: boolean;
  isActive: boolean;
  averageRating?: number;
  numOfReviews?: number;
  totalSales?: number;
  tags?: string[];
  variants?: any[];
  specifications?: any[];
  inStock: boolean;
  isLowStock: boolean;
  discountPercentage?: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    metaKeywords?: string[];
  };
  __v?: number;
}

export interface UseProductsOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  featured?: boolean;
  enabled?: boolean; // Allow disabling automatic fetch
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Reusable hook for fetching products from the backend
 *
 * Backend response format:
 * {
 *   success: boolean,
 *   count: number,
 *   total: number,
 *   pagination: {},
 *   data: Product[]
 * }
 *
 * Note: Product.category is an object with { _id, name, slug, id }
 * Access category name with: product.category.name
 *
 * @param options - Configuration options for fetching products
 * @returns Products array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * // Fetch all products
 * const { products, loading, error } = useProducts();
 *
 * // Fetch products by category
 * const { products, loading } = useProducts({ category: 'lashes' });
 *
 * // Search products
 * const { products, loading } = useProducts({ search: 'lash' });
 *
 * // With pagination
 * const { products, loading, pagination } = useProducts({
 *   page: 1,
 *   limit: 12
 * });
 *
 * // Access category name
 * products.map(product => product.category.name)
 * ```
 */
export function useProducts(
  options: UseProductsOptions = {}
): UseProductsReturn {
  const {
    category,
    search,
    page = 1,
    limit = 12,
    sort = "-createdAt",
    featured,
    enabled = true,
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<
    | {
        page: number;
        limit: number;
        total: number;
        pages: number;
      }
    | undefined
  >();

  const fetchProducts = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (category && category !== "all") {
        // Handle category name mapping (e.g., "tattoo" -> "tattoos")
        const categoryParam = category === "tattoo" ? "tattoos" : category;
        queryParams.append("category", categoryParam);
      }

      if (search) {
        queryParams.append("search", search);
      }

      if (page > 1) {
        queryParams.append("page", page.toString());
      }

      if (limit !== 12) {
        queryParams.append("limit", limit.toString());
      }

      if (sort !== "-createdAt") {
        queryParams.append("sort", sort);
      }

      // Determine endpoint based on options
      let endpoint = "/products";

      if (featured) {
        endpoint = "/products/featured";
      } else if (queryParams.toString()) {
        endpoint = `/products?${queryParams.toString()}`;
      }

      // Backend response format:
      // {
      //   success: boolean,
      //   count: number,
      //   total: number,
      //   pagination: {},
      //   data: Product[]
      // }
      const response = await apiClient.get<{
        success: boolean;
        count: number;
        total: number;
        pagination: Record<string, any>;
        data: Product[];
      }>(endpoint);

      // Extract products from response.data array
      const productsList = response?.data || [];

      // Build pagination info from response
      if (response?.total !== undefined) {
        setPagination({
          page,
          limit,
          total: response.total,
          pages: Math.ceil(response.total / limit),
        });
      } else if (productsList.length > 0) {
        // Fallback: calculate pagination from count or data length
        const total = response?.count || response?.total || productsList.length;
        setPagination({
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        });
      }

      setProducts(productsList);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      const errorMessage =
        (err as ApiError)?.message || "Failed to load products";
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, page, limit, sort, featured, enabled]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    pagination,
  };
}
