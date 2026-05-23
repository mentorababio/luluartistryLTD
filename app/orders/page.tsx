"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Package } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

const STATUS_TABS = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  shipped: "bg-purple-100 text-purple-600",
  delivered: "bg-green-100 text-green-600",
  processing: "bg-orange-100 text-orange-600",
  cancelled: "bg-red-100 text-red-600",
  pending: "bg-gray-100 text-gray-600",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
}

function formatPrice(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function OrderCard({ order }: { order: Order }) {
  const itemNames = order.items.map((i) => `${i.name || "Item"}( ${formatPrice(i.price)})`).join(", ");

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Order ID + Status */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
          <p className="font-semibold text-gray-800 text-sm">
            ORD-{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
            STATUS_COLORS[order.status] || STATUS_COLORS.pending
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Product Images */}
      <div className="flex gap-2 mb-3">
        {order.items.slice(0, 2).map((item, i) => (
          <div
            key={i}
            className="w-16 h-16 bg-[#fdf6ec] rounded-lg flex items-center justify-center border border-gray-100"
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package size={24} className="text-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Item Names + Date + Price */}
      <p className="text-sm text-gray-700 mb-1 truncate">{itemNames}</p>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
        <p className="text-sm font-semibold text-gray-800">{formatPrice(order.totalAmount)}</p>
      </div>

      {/* Track Order Button */}
      <Link href={`/orders/${order.id}`}>
        <button className="w-full border border-[#C9A84C] text-[#C9A84C] text-sm font-medium py-2.5 rounded-lg hover:bg-[#C9A84C] hover:text-white transition-colors">
          Track Order
        </button>
      </Link>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setOrders(data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const filtered = orders.filter((o) => {
    const matchesTab =
      activeTab === "All" || o.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.name?.toLowerCase().includes(search.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-500 hover:text-[#C9A84C] transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
              autoFocus
            />
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "bg-[#C9A84C] text-white"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab !== "All" ? `No ${activeTab.toLowerCase()} orders` : "You haven't placed any orders yet"}
            </p>
            <Link href="/shop">
              <button className="mt-6 bg-[#C9A84C] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}