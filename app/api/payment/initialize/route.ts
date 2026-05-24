import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, metadata } = body;

    if (!email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: email and amount are required." },
        { status: 400 }
      );
    }

    // Paystack expects amount in Kobo (multiply Naira by 100)
    const paystackAmount = Math.round(parseFloat(amount) * 100);

    // Call Paystack API to initialize the transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: paystackAmount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/verify`,
        metadata: metadata || {},
      }),
    });

    const data = await paystackResponse.json();

    if (!paystackResponse.ok || !data.status) {
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment with Paystack" },
        { status: paystackResponse.status }
      );
    }

    // Return the authorization URL and reference back to the frontend
    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });

  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}