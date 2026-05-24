/**
 * GET /api/payment/verify?reference=xxx
 *
 * Verifies a Paystack payment after the user is redirected back.
 * Called from the order-success page.
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { updateOrder } from '@/lib/api/db';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_test_key_here';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return errorResponse('Payment reference is required', 400);
    }

    // Verify transaction with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      return errorResponse('Payment verification failed', 400);
    }

    const transaction = data.data;
    const isSuccessful = transaction.status === 'success';

    // Update order status if payment was successful
    if (isSuccessful && transaction.metadata?.orderId) {
      updateOrder(transaction.metadata.orderId, {
        status: 'confirmed',
      });
    }

    return successResponse({
      status: transaction.status,         // 'success' | 'failed' | 'abandoned'
      reference: transaction.reference,
      amount: transaction.amount / 100,   // Convert back from kobo to naira
      email: transaction.customer?.email,
      orderId: transaction.metadata?.orderId,
      paidAt: transaction.paid_at,
    }, isSuccessful ? 'Payment successful' : 'Payment not completed');
  } catch (error) {
    console.error('[GET /api/payment/verify]', error);
    return errorResponse('Failed to verify payment', 500);
  }
}