import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getProductById, updateProduct, deleteProduct } from '@/lib/api/db';
import { requireAuth, requireAdmin } from '@/lib/api/auth';

interface ProductParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  try {
    const { id } = await params;
    const product = getProductById(id);

    if (!product) {
      return errorResponse('Product not found', 404);
    }

    const stock = typeof (product as any).stock === 'number' ? (product as any).stock : ((product as any)?.variants ? (product as any).variants.reduce((s: number, v: any) => s + (v.stock || 0), 0) : 0);
    const inStock = (product as any).inStock !== undefined ? (product as any).inStock : stock > 0;
    const isLowStock = (product as any).isLowStock !== undefined ? (product as any).isLowStock : (stock > 0 && stock <= 5);

    return successResponse({ ...product, stock, inStock, isLowStock });
  } catch (error) {
    return errorResponse('Failed to fetch product', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
      const body = await request.json();

      const normalizeImage = (img: any) => {
        if (!img) return null;
        if (typeof img === 'string') return { url: img, alt: '' };
        const url = img.url || img.secure_url || img.src;
        return url ? { url, alt: img.alt || '' } : null;
      };

      const updates: any = { ...body };
      let imagesArray: Array<{ url: string; alt: string }> = [];
      if (Array.isArray(body.images)) {
        imagesArray = body.images.map(normalizeImage).filter(Boolean) as Array<{ url: string; alt: string }>;
      } else if (typeof body.images === 'string') {
        imagesArray = [normalizeImage(body.images)] as Array<{ url: string; alt: string }>;
      }

      if (imagesArray.length > 0) {
        updates.images = imagesArray;
      } else if (body.image) {
        const normalized = normalizeImage(body.image);
        if (normalized) updates.images = [normalized];
      }

      const updated = updateProduct(id, updates);
    if (!updated) {
      return errorResponse('Product not found', 404);
    }

    return successResponse(updated);
  } catch (error) {
    return errorResponse('Failed to update product', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const deleted = deleteProduct(id);

    if (!deleted) {
      return errorResponse('Product not found', 404);
    }

    return successResponse({ message: 'Product deleted successfully' });
  } catch (error) {
    return errorResponse('Failed to delete product', 500);
  }
}
