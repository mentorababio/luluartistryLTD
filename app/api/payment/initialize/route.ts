/**
 * POST /api/payment/initialize
 *
 * Creates a Paystack payment session and returns the payment URL.
 * The frontend redirects the user to this URL to complete payment.
 */

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your_test_key_here';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { email, amount, orderId, callbackUrl } = body;

    if (!email || !amount || !orderId) {
      return errorResponse('Email, amount and orderId are required', 400);
    }

    // Convert amount to kobo (Paystack uses kobo, not naira)
    // e.g. ₦5000 = 500000 kobo
    const amountInKobo = Math.round(amount * 100);

    // Initialize transaction with Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference: `ORD-${orderId}-${Date.now()}`,
        callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-success`,
        metadata: {
          orderId,
          userId: user.id,
          custom_fields: [
            {
              display_name: 'Order ID',
              variable_name: 'order_id',
              value: orderId,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return errorResponse(data.message || 'Failed to initialize payment', 400);
    }

    return successResponse({
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference,
    }, 'Payment initialized successfully');
  } catch (error) {
    console.error('[POST /api/payment/initialize]', error);
    return errorResponse('Failed to initialize payment', 500);
  }
}