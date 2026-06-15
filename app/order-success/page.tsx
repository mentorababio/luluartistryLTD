"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Package, Download } from "lucide-react";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<"loading" | "success" | "failed" | "transfer">("loading");
  const [order, setOrder] = useState<any>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrder = localStorage.getItem("currentOrder");
      if (savedOrder) setOrder(JSON.parse(savedOrder));
    }

    if (!reference) {
      setStatus("transfer");
      return;
    }

    fetch(`${BASE_URL}/payment/verify/${reference}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data?.status === "success") {
          setPaymentInfo(data.data);
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [reference]);

  // ── FIX: get total from either pricing.total or totalAmount ──────────────
  const getTotal = (order: any): number => {
    if (!order) return 0;
    return order.pricing?.total || order.totalAmount || 0;
  };

  const getShipping = (order: any): number => {
    if (!order) return 0;
    return order.pricing?.shippingCost || order.deliveryZone?.cost || 0;
  };

  const getSubtotal = (order: any): number => {
    if (!order) return 0;
    return order.pricing?.subtotal || (getTotal(order) - getShipping(order));
  };

  // ── Get bank details from order or fallback to env defaults ──────────────
  const getBankDetails = (order: any) => {
    const bankDetails = order?.bankDetails || order?.payment?.bankDetails;
    return {
      bankName:      bankDetails?.bankName      || process.env.NEXT_PUBLIC_BANK_NAME      || 'GTBank',
      accountNumber: bankDetails?.accountNumber || process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || '0123456789',
      accountName:   bankDetails?.accountName   || process.env.NEXT_PUBLIC_ACCOUNT_NAME   || 'Lulu Artistry',
      reference:     order?.payment?.reference  || order?.paymentReference || '',
    };
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleDownloadReceipt = () => {
    if (!order) return;
    const rawId = order._id || order.id || "";
    const orderId = `ORD-${rawId.slice(-8).toUpperCase()}`;
    const date = new Date().toLocaleDateString("en-NG", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const items = order.items?.map((item: any) =>
      `  - ${item.productSnapshot?.name || item.name || item.product} x${item.quantity}  ₦${((item.price || 0) * item.quantity).toLocaleString()}`
    ).join("\n") || "  - Items unavailable";

    const total = getTotal(order);
    const shipping = getShipping(order);
    const subtotal = getSubtotal(order);

    const receipt = `
================================================
           LULU ARTISTRY - ORDER RECEIPT
================================================

Date:        ${date}
Order ID:    ${orderId}
Status:      ${status === "success" ? "Payment Confirmed" : "Awaiting Bank Transfer"}
${paymentInfo ? `Reference:   ${paymentInfo.reference}` : ""}

------------------------------------------------
ITEMS ORDERED:
${items}

------------------------------------------------
Subtotal:    ₦${subtotal.toLocaleString()}
Shipping:    ₦${shipping.toLocaleString()}
TOTAL:       ₦${total.toLocaleString()}

------------------------------------------------
SHIPPING ADDRESS:
${order.shippingAddress?.street || ""}
${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}

------------------------------------------------
CUSTOMER:
${order.customerInfo?.firstName || ""} ${order.customerInfo?.lastName || ""}
${order.customerInfo?.email || ""}
${order.customerInfo?.phone || ""}

================================================
  Thank you for shopping with Lulu Artistry!
  For support: lulusartistry321@gmail.com
================================================
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderId}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <XCircle size={56} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
          <p className="text-gray-500 mb-6">
            Your payment could not be completed. Please try again or use bank transfer.
          </p>
          <Link href="/checkout">
            <button className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors">
              Try Again
            </button>
          </Link>
          <Link href="/">
            <button className="w-full mt-3 border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const rawId = order?._id || order?.id || "";
  const total = getTotal(order);
  const bankDetails = getBankDetails(order);

  return (
    <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {status === "transfer" ? "Order Placed!" : "Payment Successful!"}
        </h1>
        <p className="text-gray-500 mb-6">
          {status === "transfer"
            ? "Your order has been placed. We'll confirm your payment shortly."
            : "Your payment was successful and your order is confirmed!"}
        </p>

        {order && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Order ID</span>
              <span className="font-semibold text-gray-800">
                ORD-{rawId.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total</span>
              {/* ── FIX: use getTotal() instead of order.totalAmount ── */}
              <span className="font-semibold text-gray-800">
                ₦{total.toLocaleString()}
              </span>
            </div>
            {paymentInfo && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Reference</span>
                <span className="font-semibold text-gray-800 text-xs">
                  {paymentInfo.reference}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`font-semibold capitalize ${
                status === "success" ? "text-green-600" : "text-orange-500"
              }`}>
                {status === "transfer" ? "Under Review" : "Confirmed"}
              </span>
            </div>
          </div>
        )}

        {status === "transfer" && (
          <div className="bg-yellow-50 border border-[#C9A84C] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">Transfer to:</p>
            <p className="text-sm text-gray-600">Bank: <span className="font-medium">{bankDetails.bankName}</span></p>
            <p className="text-sm text-gray-600">Account: <span className="font-medium">{bankDetails.accountNumber}</span></p>
            <p className="text-sm text-gray-600">Name: <span className="font-medium">{bankDetails.accountName}</span></p>
            {bankDetails.reference && (
              <p className="text-sm text-gray-600 mt-1">
                Reference: <span className="font-medium text-[#C9A84C]">{bankDetails.reference}</span>
              </p>
            )}
            {/* ── FIX: use getTotal() for amount display ── */}
            <p className="text-sm text-gray-600 mt-2">
              Amount: <span className="font-bold text-[#C9A84C]">₦{total.toLocaleString()}</span>
            </p>
          </div>
        )}

        <Link href="/orders">
          <button className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2">
            <Package size={16} />
            Track My Order
          </button>
        </Link>

        <button
          onClick={handleDownloadReceipt}
          className="w-full mt-3 border border-[#C9A84C] text-[#C9A84C] font-medium py-3 rounded-lg hover:bg-[#C9A84C] hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <Download size={16} />
          Download Receipt
        </button>

        <Link href="/shop">
          <button className="w-full mt-3 border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading details...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
