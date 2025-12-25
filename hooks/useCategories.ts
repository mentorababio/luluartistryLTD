import { useState, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api/client";

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface UseCategoriesOptions {
  activeOnly?: boolean; // Filter only active categories
  enabled?: boolean; // Allow disabling automatic fetch
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  count?: number;
}

/**
 * Reusable hook for fetching categories from the backend
 *
 * Backend response format:
 * {
 *   success: boolean,
 *   count: number,
 *   data: Category[]
 * }
 *
 * @param options - Configuration options for fetching categories
 * @returns Categories array, loading state, error state, and refetch function
 *
 * @example
 * ```tsx
 * // Fetch all categories
 * const { categories, loading, error } = useCategories();
 *
 * // Fetch only active categories
 * const { categories, loading } = useCategories({ activeOnly: true });
 *
 * // Manual fetch control
 * const { categories, loading, refetch } = useCategories({ enabled: false });
 * // Later: refetch();
 * ```
 */
export function useCategories(
  options: UseCategoriesOptions = {}
): UseCategoriesReturn {
  const { activeOnly = false, enabled = true } = options;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | undefined>();

  const fetchCategories = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (activeOnly) {
        queryParams.append("isActive", "true");
      }

      // Determine endpoint
      const endpoint = queryParams.toString()
        ? `/categories?${queryParams.toString()}`
        : "/categories";

      // Backend response format:
      // {
      //   success: boolean,
      //   count: number,
      //   data: Category[]
      // }
      const response = await apiClient.get<{
        success: boolean;
        count: number;
        data: Category[];
      }>(endpoint);

      // Extract categories from response.data array
      let categoriesList = response?.data || [];

      // Filter active categories client-side if needed (as backup)
      if (activeOnly) {
        categoriesList = categoriesList.filter((cat) => cat.isActive);
      }

      // Sort by displayOrder if available
      categoriesList.sort((a, b) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return 0;
      });

      setCategories(categoriesList);
      setCount(response?.count);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      const errorMessage =
        (err as ApiError)?.message || "Failed to load categories";
      setError(errorMessage);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeOnly, enabled]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    count,
  };
}
