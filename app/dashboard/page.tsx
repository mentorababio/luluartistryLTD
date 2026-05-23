"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  ShoppingBag,
  Heart,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit2,
  ChevronRight,
  Home,
} from "lucide-react";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [latestWishlistItem, setLatestWishlistItem] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user profile
   fetch("https://luluartistry-backend.onrender.com/api/auth/me",{
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.data) setUser(data.data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });

    // Fetch orders count
    fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const orders = data?.data || [];
        setOrderCount(orders.length);
        if (orders.length > 0) setLatestOrder(orders[orders.length - 1]);
      })
      .catch(() => {});

    // Fetch wishlist count
    // Read wishlist from localStorage
const savedWishlist = localStorage.getItem("wishlist");
if (savedWishlist) {
  const wishlistIds = JSON.parse(savedWishlist);
  setWishlistCount(wishlistIds.length);
  if (wishlistIds.length > 0) setLatestWishlistItem("View your saved items");
}
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Welcome Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome {user?.firstName} {user?.lastName}!
        </h1>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-10">
          <span className="text-[#C9A84C] font-medium cursor-pointer hover:underline">
            MY Profile
          </span>
          <span className="text-gray-400">/</span>
          <Link href="/" className="text-gray-500 flex items-center gap-1 hover:underline">
            <Home size={14} />
            Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Personal Information ───────────────────────────── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <User size={18} className="text-gray-500" />
                Personal Information
              </div>
              <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors">
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Full Name</p>
                <p className="text-gray-800 font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Email Address</p>
                <p className="text-gray-800">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Phone Number</p>
                <p className="text-gray-800">{user?.phone || "—"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Default Shipping Address</p>
                <p className="text-gray-800">—</p>
              </div>
            </div>
          </div>

          {/* ── Right Column ───────────────────────────────────── */}
          <div className="space-y-6">

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <ShoppingBag size={18} className="text-gray-500" />
                Total Order ({orderCount})
              </div>
              <div className="text-sm text-gray-500 mb-1">Latest Order</div>
              <div className="text-sm text-gray-800 mb-3">
                {latestOrder
                  ? `ORD-${latestOrder.id.slice(0, 8).toUpperCase()}`
                  : <span className="text-gray-400">No orders yet</span>}
              </div>
              <Link href="/orders">
                <button className="border border-[#C9A84C] text-[#C9A84C] text-sm px-4 py-1.5 rounded hover:bg-[#C9A84C] hover:text-white transition-colors">
                  View All Order
                </button>
              </Link>
            </div>

            {/* Saved Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <Heart size={18} className="text-gray-500" />
                Saved Items ({wishlistCount})
              </div>
              <div className="text-sm text-gray-500 mb-1">Latest Items</div>
              <div className="text-sm text-gray-800 mb-3">
                {latestWishlistItem
                  ? latestWishlistItem
                  : <span className="text-gray-400">No saved items</span>}
              </div>
              <Link href="/wishlist">
                <button className="border border-[#C9A84C] text-[#C9A84C] text-sm px-4 py-1.5 rounded hover:bg-[#C9A84C] hover:text-white transition-colors">
                  View All Wishlist
                </button>
              </Link>
            </div>
          </div>

          {/* ── Payment Methods ────────────────────────────────── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <CreditCard size={18} className="text-gray-500" />
                Payment Methods
              </div>
              <button className="text-sm text-gray-500 hover:text-[#C9A84C] transition-colors">
                Manage
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-700 font-medium">Bank Transfer</p>
                <p className="text-gray-400">Direct bank transfer</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Paystack/Flutterwave</p>
                <p className="text-gray-400">Debit/Credit Card</p>
              </div>
            </div>
          </div>

          {/* ── Support ────────────────────────────────────────── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
              <HelpCircle size={18} className="text-gray-500" />
              Support
            </div>
            <div className="space-y-2">
              {["Contact Support", "FAQ", "Returns & Refunds"].map((item) => (
                <Link href="/support" key={item}>
                  <button className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-[#C9A84C] py-1.5 transition-colors">
                    {item}
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* ── Logout Button ───────────────────────────────────── */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}