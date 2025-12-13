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

    return successResponse(product);
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

    const updated = updateProduct(id, body);
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
