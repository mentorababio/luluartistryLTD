import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { getOrderById, updateOrder } from '@/lib/api/db';

interface StatusParams {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<StatusParams> }) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    const order = getOrderById(id);
    if (!order) {
      return errorResponse('Order not found', 404);
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status', 400);
    }

    const updated = updateOrder(id, {
      status,
      ...(note && { notes: note }),
    });

    return successResponse(updated, 'Order status updated successfully');
  } catch (error) {
    return errorResponse('Failed to update order status', 500);
  }
}
