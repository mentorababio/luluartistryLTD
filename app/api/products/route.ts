import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getAllProducts, getProductById, getFeaturedProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } from '@/lib/api/db';
import { requireAuth, requireAdmin } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '12');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const sort = url.searchParams.get('sort') || '-createdAt';

    const { products, total } = getAllProducts(page, limit, category || undefined, search || undefined, sort);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse('Failed to fetch products', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, description, price, comparePrice, category, images, image, variants, stock, tags, isFeatured } = body;

    if (!name || !price || !category) {
      return errorResponse('Missing required fields', 400);
    }

    const imagesArray = Array.isArray(images)
      ? images
      : image
      ? [{ url: image, alt: '' }]
      : [];

    const product = createProduct({
      name,
      description: description || '',
      price,
      comparePrice,
      category,
      images: imagesArray,
      variants,
      stock: stock || 0,
      tags: tags || [],
      isFeatured: isFeatured || false,
    });

    return successResponse(product, 'Product created successfully', 201);
  } catch (error) {
    return errorResponse('Failed to create product', 500);
  }
}
