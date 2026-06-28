"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, ShoppingBag, Heart, CreditCard, HelpCircle,Calendar,
  LogOut, Edit2, ChevronRight, Home, X, Plus, Trash2,
  Building2, Check,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface PaymentMethod {
  id: string;
  type: "bank_transfer" | "card";
  label: string;
  detail: string;
  isDefault: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm_1", type: "bank_transfer", label: "Bank Transfer", detail: "Direct bank transfer", isDefault: true },
  { id: "pm_2", type: "card", label: "Paystack/Flutterwave", detail: "Debit/Credit Card", isDefault: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [latestOrder, setLatestOrder] = useState<any>(null);
  const [latestWishlistItem, setLatestWishlistItem] = useState<string>("");

  // ── Edit Profile Modal ────────────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [editLoading, setEditLoading] = useState(false);

  // ── Payment Methods Modal ─────────────────────────────────────────────────
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({ label: "", detail: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch("https://luluartistry-backend.onrender.com/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => { if (!res.ok) { router.push("/login"); return null; } return res.json(); })
      .then((data) => { if (data?.data) setUser(data.data); setLoading(false); })
      .catch(() => router.push("/login"));

    fetch("https://luluartistry-backend.onrender.com/api/orders/my", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((res) => res.json())
  .then((data) => {
    const orders = data?.data || [];
    setOrderCount(orders.length);
    if (orders.length > 0) {
      const latest = orders[0]; // sorted newest first
      setLatestOrder(latest);
    }
  })
  .catch(() => {});

    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      const ids = JSON.parse(savedWishlist);
      setWishlistCount(ids.length);
      if (ids.length > 0) setLatestWishlistItem("View your saved items");
    }
  }, [router]);

  // ── Edit Profile handlers ─────────────────────────────────────────────────
  const openEditModal = () => {
    setEditForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!editForm.firstName || !editForm.lastName) {
      toast.error("First name and last name are required");
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch("https://luluartistry-backend.onrender.com/api/auth/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");
      setUser((prev) => prev ? { ...prev, ...editForm } : prev);
      toast.success("Profile updated successfully!");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Payment Methods handlers ──────────────────────────────────────────────
  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
    toast.success("Default payment method updated!");
  };

  const handleRemoveMethod = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id);
    if (method?.isDefault) { toast.error("Cannot remove the default payment method"); return; }
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };

  const handleAddMethod = () => {
    if (!newCard.label || !newCard.detail) { toast.error("Please fill in all fields"); return; }
    const newMethod: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: "card",
      label: newCard.label,
      detail: newCard.detail,
      isDefault: false,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    setNewCard({ label: "", detail: "" });
    setShowAddCard(false);
    toast.success("Payment method added!");
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/login"); };

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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome {user?.firstName} {user?.lastName}!
        </h1>
        <div className="flex items-center gap-2 text-sm mb-10">
          <span className="text-[#C9A84C] font-medium cursor-pointer hover:underline">MY Profile</span>
          <span className="text-gray-400">/</span>
          <Link href="/" className="text-gray-500 flex items-center gap-1 hover:underline">
            <Home size={14} /> Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Personal Information ─────────────────────────── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <User size={18} className="text-gray-500" />
                Personal Information
              </div>
              <button
                onClick={openEditModal}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#C9A84C] transition-colors"
              >
                <Edit2 size={14} /> Edit
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Full Name</p>
                <p className="text-gray-800 font-medium">{user?.firstName} {user?.lastName}</p>
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

          {/* ── Right Column ─────────────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <ShoppingBag size={18} className="text-gray-500" />
                Total Order ({orderCount})
              </div>
              <div className="text-sm text-gray-500 mb-1">Latest Order</div>
              <div className="text-sm text-gray-800 mb-3">
               {latestOrder
  ? latestOrder.orderNumber || `ORD-${(latestOrder._id || latestOrder.id || "").slice(-8).toUpperCase()}`
  : <span className="text-gray-400">No orders yet</span>}
              </div>
             <Link href="/orders">
  <button className="border border-[#C9A84C] text-[#C9A84C] text-sm px-4 py-1.5 rounded hover:bg-[#C9A84C] hover:text-white transition-colors">
    View All Order
  </button>
</Link>
</div>

{/* My Bookings Card */}
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
    <Calendar size={18} className="text-gray-500" />
    My Bookings
  </div>
  <div className="text-sm text-gray-500 mb-1">Track your appointments</div>
  <div className="text-sm text-gray-800 mb-3">
    View status, payment and reschedule requests
  </div>
  <Link href="/my-bookings">
    <button className="border border-[#C9A84C] text-[#C9A84C] text-sm px-4 py-1.5 rounded hover:bg-[#C9A84C] hover:text-white transition-colors">
      View My Bookings
    </button>
  </Link>
</div>

<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
    <Heart size={18} className="text-gray-500" />
    Saved Items ({wishlistCount})
              </div>
              <div className="text-sm text-gray-500 mb-1">Latest Items</div>
              <div className="text-sm text-gray-800 mb-3">
                {latestWishlistItem || <span className="text-gray-400">No saved items</span>}
              </div>
              <Link href="/wishlist">
                <button className="border border-[#C9A84C] text-[#C9A84C] text-sm px-4 py-1.5 rounded hover:bg-[#C9A84C] hover:text-white transition-colors">
                  View All Wishlist
                </button>
              </Link>
            </div>
          </div>

          {/* ── Payment Methods ───────────────────────────────── */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <CreditCard size={18} className="text-gray-500" />
                Payment Methods
              </div>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-sm text-gray-500 hover:text-[#C9A84C] transition-colors"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {paymentMethods.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 font-medium flex items-center gap-1">
                      {m.label}
                      {m.isDefault && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full ml-1">Default</span>
                      )}
                    </p>
                    <p className="text-gray-400">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Support ───────────────────────────────────────── */}
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

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* ── Edit Profile Modal ──────────────────────────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Edit Personal Information</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={editLoading}
                className="flex-1 bg-[#C9A84C] text-white font-semibold py-2.5 rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-60"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Methods Modal ───────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">Payment Methods</h3>
              <button onClick={() => { setShowPaymentModal(false); setShowAddCard(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {paymentMethods.map((m) => (
                <div key={m.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${m.isDefault ? "border-[#C9A84C] bg-yellow-50" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${m.type === "bank_transfer" ? "bg-blue-100" : "bg-purple-100"}`}>
                      {m.type === "bank_transfer"
                        ? <Building2 size={16} className="text-blue-500" />
                        : <CreditCard size={16} className="text-purple-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.isDefault ? (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(m.id)}
                        className="text-xs text-[#C9A84C] hover:underline"
                      >
                        Set default
                      </button>
                    )}
                    {!m.isDefault && (
                      <button onClick={() => handleRemoveMethod(m.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new method */}
            {showAddCard ? (
              <div className="border border-gray-200 rounded-xl p-4 space-y-3 mb-4">
                <p className="text-sm font-medium text-gray-700">Add Payment Method</p>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label (e.g. GTBank, Visa Card)</label>
                  <input
                    type="text"
                    value={newCard.label}
                    onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="Payment method name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Details (e.g. Account number, Card type)</label>
                  <input
                    type="text"
                    value={newCard.detail}
                    onChange={(e) => setNewCard({ ...newCard, detail: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    placeholder="Details"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddCard(false)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleAddMethod} className="flex-1 bg-[#C9A84C] text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-600">
                    Add Method
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddCard(true)}
                className="w-full border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#C9A84C] hover:text-[#C9A84C] py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Plus size={16} /> Add Payment Method
              </button>
            )}

            <button
              onClick={() => { setShowPaymentModal(false); setShowAddCard(false); }}
              className="w-full bg-[#C9A84C] text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}