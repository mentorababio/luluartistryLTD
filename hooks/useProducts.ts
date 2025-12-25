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

    // Determine endpoint based on options (declare outside try for error logging)
    let endpoint = "/products";

    if (featured) {
      endpoint = "/products/featured/all";
    } else if (queryParams.toString()) {
      endpoint = `/products?${queryParams.toString()}`;
    }

    try {
      setLoading(true);
      setError(null);

      // Backend response format:
      // {
      //   success: boolean,
      //   count: number,  // Note: API returns 'count', not always 'total'
      //   total?: number,  // Optional
      //   pagination: {},
      //   data: Product[]
      // }
      const response = await apiClient.get<{
        success: boolean;
        count?: number;
        total?: number;
        pagination?: Record<string, any>;
        data: Product[];
      }>(endpoint);

      // Extract products from response.data array
      const productsList = Array.isArray(response?.data) ? response?.data : [];

      // Build pagination info from response
      // API returns 'count' for featured products, 'total' for paginated results
      const totalCount =
        response?.total ?? response?.count ?? productsList.length;

      if (totalCount > 0 || productsList.length > 0) {
        setPagination({
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        });
      } else {
        setPagination(undefined);
      }

      setProducts(productsList);
    } catch (err) {
      // Extract error message for user feedback
      let errorMessage = "Failed to load products";

      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      } else if (err && typeof err === "object") {
        const apiError = err as ApiError;
        errorMessage =
          apiError?.message ||
          apiError?.data?.message ||
          apiError?.data?.error ||
          errorMessage;
      } else if (err) {
        errorMessage = String(err) || errorMessage;
      }

      setError(errorMessage);
      setProducts([]);
      setPagination(undefined);
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
