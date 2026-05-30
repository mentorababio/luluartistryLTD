"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Circle, Download, RotateCcw, HeadphonesIcon } from "lucide-react";
import { apiClient, endpoints } from "@/lib/api/client";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  _id: string;
  id?: string;
  orderStatus: OrderStatus;  // ← backend field
  status?: OrderStatus;      // ← fallback
  orderNumber?: string;
  items: Array<{
    product: any;
    productSnapshot?: { name?: string; image?: string; price?: number };
    name?: string;
    image?: string;
    quantity: number;
    price: number;
    subtotal?: number;
  }>;
  customerInfo: { firstName: string; lastName: string; email: string; phone: string };
  shippingAddress: { street: string; city: string; state: string };
  pricing?: { total: number; subtotal: number; shippingCost: number };
  totalAmount?: number;
  deliveryZone?: { zone: string; cost: number };
  payment?: { method: string; status: string; reference?: string };
  createdAt: string;
  updatedAt: string;
}

const TIMELINE_STEPS = [
  { key: "placed",       label: "Order Placed" },
  { key: "confirmed",    label: "Payment Confirmed" },
  { key: "processing",   label: "Processing" },
  { key: "shipped",      label: "Shipped" },
  { key: "out_delivery", label: "Out for Delivery" },
  { key: "delivered",    label: "Delivered" },
];

// ── When admin clicks "Confirm Payment" → orderStatus becomes "processing"
// ── When admin clicks "Mark Delivered"  → orderStatus becomes "delivered"
const STATUS_STEP: Record<string, number> = {
  pending:    0,  // Order Placed only
  processing: 2,  // Order Placed + Payment Confirmed + Processing
  shipped:    3,  // + Shipped
  delivered:  5,  // All steps
  cancelled: -1,
};

const STATUS_COLORS: Record<string, string> = {
  shipped:    "bg-purple-100 text-purple-600",
  delivered:  "bg-green-100 text-green-600",
  processing: "bg-orange-100 text-orange-600",
  cancelled:  "bg-red-100 text-red-600",
  pending:    "bg-yellow-100 text-yellow-600",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

function getStatus(order: Order): OrderStatus {
  return order.orderStatus || order.status || "pending";
}

function getTotal(order: Order): number {
  return order.pricing?.total || order.totalAmount || 0;
}

function getItemName(item: Order["items"][0]): string {
  return item.productSnapshot?.name || item.name ||
    (typeof item.product === "object" ? item.product?.name : "") || "Product";
}

function getItemImage(item: Order["items"][0]): string | null {
  return item.productSnapshot?.image || item.image ||
    (typeof item.product === "object" ? item.product?.images?.[0]?.url : null) || null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    apiClient.get<any>(endpoints.myOrder(id))
      .then((data) => {
        setOrder(data?.data || data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, router]);

  const handleDownloadReceipt = () => {
    if (!order) return;
    const rawId = order._id || order.id || "";
    const orderId = order.orderNumber || `ORD-${rawId.slice(-8).toUpperCase()}`;
    const date = new Date(order.createdAt).toLocaleDateString("en-NG", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const items = order.items.map((i) =>
      `  - ${getItemName(i)} x${i.quantity}  ₦${(i.price * i.quantity).toLocaleString()}`
    ).join("\n");

    const receipt = `
================================================
           LULU ARTISTRY - ORDER RECEIPT
================================================
Date:        ${date}
Order ID:    ${orderId}
Status:      ${getStatus(order).toUpperCase()}
------------------------------------------------
ITEMS:
${items}
------------------------------------------------
Shipping:    ₦${(order.pricing?.shippingCost || order.deliveryZone?.cost || 0).toLocaleString()}
TOTAL:       ₦${getTotal(order).toLocaleString()}
------------------------------------------------
SHIP TO:
${order.shippingAddress?.street}
${order.shippingAddress?.city}, ${order.shippingAddress?.state}
------------------------------------------------
CUSTOMER:
${order.customerInfo?.firstName} ${order.customerInfo?.lastName}
${order.customerInfo?.email} | ${order.customerInfo?.phone}
================================================
  Thank you for shopping with Lulu Artistry!
  Support: lulusartistry321@gmail.com
================================================`.trim();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Order not found.</p>
        <button onClick={() => router.push("/orders")} className="text-[#C9A84C] underline text-sm">
          Back to Orders
        </button>
      </div>
    );
  }

  const status = getStatus(order);
  const currentStep = STATUS_STEP[status] ?? 0;
  const isCancelled = status === "cancelled";

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push("/orders")} className="text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left: Order Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Order Date</p>
              <p className="text-sm font-medium text-gray-800 mb-4">{formatDate(order.createdAt)}</p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Order ID</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {order.orderNumber || `ORD-${(order._id || order.id || "").slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600"}`}>
                  {status}
                </span>
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {order.items.map((item, i) => {
                const img = getItemImage(item);
                return (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-[#fdf6ec] rounded-lg flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden">
                      {img
                        ? <img src={img} alt={getItemName(item)} className="w-full h-full object-cover" />
                        : <span className="text-2xl">🛍️</span>
                      }
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{getItemName(item)}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                );
              })}

              <div className="h-px bg-gray-100 my-3" />
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-sm font-bold text-gray-900">₦{getTotal(order).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
              <p className="text-sm text-gray-800">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
              <p className="text-xs text-gray-400 mt-3 mb-1">Delivery Method</p>
              <p className="text-sm text-gray-800">Standard Shipping</p>
            </div>

            {/* Payment Status Banner */}
            {order.payment && (
              <div className={`rounded-xl p-4 border text-sm ${
                order.payment.status === "paid"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : order.payment.status === "payment_submitted"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-yellow-50 border-yellow-200 text-yellow-700"
              }`}>
                <p className="font-semibold">
                  {order.payment.status === "paid"
                    ? "✅ Payment Confirmed"
                    : order.payment.status === "payment_submitted"
                    ? "⏳ Payment Submitted — Awaiting Confirmation"
                    : "⏳ Awaiting Payment"}
                </p>
                {order.payment.reference && (
                  <p className="text-xs mt-1 opacity-80">Ref: {order.payment.reference}</p>
                )}
              </div>
            )}

            <button
              onClick={() => router.push("/shop")}
              className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              Reorder
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="w-full border border-[#C9A84C] text-[#C9A84C] font-medium py-3 rounded-lg hover:bg-[#C9A84C] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download Receipt
            </button>
            <button
              onClick={() => router.push("/support")}
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <HeadphonesIcon size={16} />
              Contact Support
            </button>
          </div>

          {/* Right: Tracking Timeline */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-6">Tracking Timeline</h2>

            {isCancelled ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">✕</span>
                </div>
                <p className="text-red-500 font-medium">Order Cancelled</p>
                <p className="text-gray-400 text-sm mt-1">This order has been cancelled</p>
              </div>
            ) : (
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, index) => {
                  const isDone = index <= currentStep;
                  const isLast = index === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? "bg-green-500" : "bg-gray-100"
                        }`}>
                          {isDone
                            ? <CheckCircle size={18} className="text-white" />
                            : <Circle size={18} className="text-gray-300" />
                          }
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 mt-1 transition-colors ${
                            isDone && index < currentStep ? "bg-green-400" : "bg-gray-200"
                          }`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isDone ? "text-gray-800" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        {isDone && (
                          <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.updatedAt)}</p>
                        )}
                        {step.key === "shipped" && status === "shipped" && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            🚚 In Transit
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}