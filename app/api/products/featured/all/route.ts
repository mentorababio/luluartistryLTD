import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { getFeaturedProducts } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const products = getFeaturedProducts();
    const normalized = products.map(p => {
      const stock = typeof (p as any).stock === 'number' ? (p as any).stock : ((p as any)?.variants ? (p as any).variants.reduce((s: number, v: any) => s + (v.stock || 0), 0) : 0);
      const inStock = (p as any).inStock !== undefined ? (p as any).inStock : stock > 0;
      const isLowStock = (p as any).isLowStock !== undefined ? (p as any).isLowStock : (stock > 0 && stock <= 5);
      return { ...p, stock, inStock, isLowStock };
    });
    return successResponse(normalized);
  } catch (error) {
    return successResponse([]);
  }
}
