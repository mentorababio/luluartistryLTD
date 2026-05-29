"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Search, Filter, Loader, X, Copy, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productSnapshot?: { name: string; price: number; image: string };
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  pricing: {
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
    reference?: string;
    senderName?: string;
    bankName?: string;
    paidAt?: string;
  };
  orderStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    landmark?: string;
  };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped:    "bg-purple-100 text-purple-800",
  delivered:  "bg-green-100 text-green-800",
  cancelled:  "bg-red-100 text-red-800",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending_payment:    "bg-yellow-100 text-yellow-800",
  payment_submitted:  "bg-blue-100 text-blue-800",
  paid:               "bg-green-100 text-green-800",
  failed:             "bg-red-100 text-red-800",
  refunded:           "bg-gray-100 text-gray-800",
};

function formatPrice(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await fetch(`${BASE_URL}/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setOrders(json?.data || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Confirm bank transfer payment ─────────────────────────────────────────
  const handleConfirmPayment = async (orderId: string) => {
    setActionLoading(orderId + "-confirm");
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/orders/admin/${orderId}/accept`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ confirmPayment: true })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to confirm payment");

      toast.success("Payment confirmed and order accepted!");
      setShowModal(false);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Decline order ─────────────────────────────────────────────────────────
  const handleDeclineOrder = async (orderId: string) => {
    setActionLoading(orderId + "-decline");
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/orders/admin/${orderId}/decline`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason: "Payment not confirmed" })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to decline order");

      toast.success("Order declined.");
      setShowModal(false);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to decline order");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Mark as delivered ─────────────────────────────────────────────────────
  const handleMarkDelivered = async (orderId: string) => {
    setActionLoading(orderId + "-deliver");
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/orders/admin/${orderId}/deliver`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to mark delivered");

      toast.success("Order marked as delivered!");
      setShowModal(false);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to update order");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter orders ─────────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending_payment" && o.payment.status === "pending_payment") ||
      (activeTab === "payment_submitted" && o.payment.status === "payment_submitted") ||
      (activeTab === "processing" && o.orderStatus === "processing") ||
      (activeTab === "delivered" && o.orderStatus === "delivered") ||
      (activeTab === "cancelled" && o.orderStatus === "cancelled");

    const matchesSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customerInfo.firstName} ${o.customerInfo.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      o.customerInfo.email.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all",               label: "All Orders",         count: orders.length },
    { id: "payment_submitted", label: "Awaiting Confirmation", count: orders.filter(o => o.payment.status === "payment_submitted").length },
    { id: "pending_payment",   label: "Pending Payment",    count: orders.filter(o => o.payment.status === "pending_payment").length },
    { id: "processing",        label: "Processing",         count: orders.filter(o => o.orderStatus === "processing").length },
    { id: "delivered",         label: "Delivered",          count: orders.filter(o => o.orderStatus === "delivered").length },
    { id: "cancelled",         label: "Cancelled",          count: orders.filter(o => o.orderStatus === "cancelled").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? "bg-yellow-600" : "bg-gray-100 text-gray-600"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order number, customer name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Order</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-sm text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{order.customerInfo.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-gray-900">{formatPrice(order.pricing.total)}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.payment.method}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.payment.status] || "bg-gray-100 text-gray-600"}`}>
                        {order.payment.status?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-600"}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">

                {/* Payment Alert — action required */}
                {selectedOrder.payment.status === "payment_submitted" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-800 mb-1">⏳ Payment Reference Submitted</p>
                    <p className="text-sm text-blue-700">
                      The customer has submitted a transfer reference. Verify the payment in your bank app, then confirm or decline below.
                    </p>
                    {selectedOrder.payment.reference && (
                      <div className="mt-3 flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-3 py-2">
                        <p className="text-sm font-mono font-bold text-gray-800 flex-1">{selectedOrder.payment.reference}</p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(selectedOrder.payment.reference!); toast.success("Reference copied!"); }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Name</p>
                      <p className="font-medium">{selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="font-medium">{selectedOrder.customerInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Phone</p>
                      <p className="font-medium">{selectedOrder.customerInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Address</p>
                      <p className="font-medium">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.productSnapshot?.name || "Product"}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{formatPrice(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{formatPrice(selectedOrder.pricing.shippingCost)}</span>
                  </div>
                  {selectedOrder.pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(selectedOrder.pricing.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.pricing.total)}</span>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Info</h3>
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Method</p>
                      <p className="font-medium capitalize">{selectedOrder.payment.method}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PAYMENT_STATUS_COLORS[selectedOrder.payment.status] || ""}`}>
                        {selectedOrder.payment.status?.replace(/_/g, " ")}
                      </span>
                    </div>
                    {selectedOrder.payment.reference && (
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Reference</p>
                        <p className="font-mono font-medium">{selectedOrder.payment.reference}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {/* Confirm Payment — show for pending_payment or payment_submitted */}
                  {(selectedOrder.payment.status === "payment_submitted" || selectedOrder.payment.status === "pending_payment") &&
                    selectedOrder.orderStatus !== "cancelled" && (
                    <button
                      onClick={() => handleConfirmPayment(selectedOrder._id)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedOrder._id + "-confirm"
                        ? <Loader size={16} className="animate-spin" />
                        : <CheckCircle size={16} />
                      }
                      Confirm Payment
                    </button>
                  )}

                  {/* Mark Delivered — show for processing orders */}
                  {selectedOrder.orderStatus === "processing" && (
                    <button
                      onClick={() => handleMarkDelivered(selectedOrder._id)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedOrder._id + "-deliver"
                        ? <Loader size={16} className="animate-spin" />
                        : <CheckCircle size={16} />
                      }
                      Mark Delivered
                    </button>
                  )}

                  {/* Decline — show for pending orders */}
                  {selectedOrder.orderStatus === "pending" && selectedOrder.orderStatus !== "cancelled" && (
                    <button
                      onClick={() => handleDeclineOrder(selectedOrder._id)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedOrder._id + "-decline"
                        ? <Loader size={16} className="animate-spin" />
                        : <XCircle size={16} />
                      }
                      Decline Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}