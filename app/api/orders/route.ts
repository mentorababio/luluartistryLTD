import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { createOrder, getUserOrders, getAllOrders } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    // Check if admin is requesting all orders
    if (user.role === 'admin') {
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const status = url.searchParams.get('status');

      const { orders, total } = getAllOrders(page, limit, status || undefined);
      return successResponse({
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    // Get user's orders
    const orders = getUserOrders(user.id);
    return successResponse(orders);
  } catch (error) {
    return errorResponse('Failed to fetch orders', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { items, customerInfo, shippingAddress, deliveryZone, paymentMethod, notes } = body;

    if (!items || items.length === 0) {
      return errorResponse('Order items are required', 400);
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const total = deliveryZone ? totalAmount + deliveryZone.cost : totalAmount;

    const order = createOrder({
      userId: user.id,
      items,
      customerInfo,
      shippingAddress,
      deliveryZone,
      paymentMethod,
      notes,
      totalAmount: total,
    });

    return createdResponse(order, 'Order created successfully');
  } catch (error) {
    return errorResponse('Failed to create order', 500);
  }
}
