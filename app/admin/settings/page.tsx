"use client";

import { useState, useEffect } from "react";
import { Save, Bell, CreditCard, Truck, Shield, Globe, Eye, EyeOff, CheckCircle, Building2 } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "bank", label: "Bank Details", icon: Building2 },
  { id: "payment", label: "Payment Keys", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // 1. Initialized with empty strings to prevent "uncontrolled" input errors
  const [settings, setSettings] = useState({
    businessName: "", businessEmail: "", businessPhone: "", businessAddress: "", businessWebsite: "",
    bankName: "", accountNumber: "", accountName: "", bankBranch: "",
    paystackPublicKey: "", paystackSecretKey: "", flutterwavePublicKey: "", flutterwaveSecretKey: "",
    standardShippingCost: "", expressShippingCost: "", freeShippingThreshold: "", pickupAvailable: false,
    emailNotifications: false, smsNotifications: false, orderNotifications: false, 
    bookingNotifications: false, lowStockAlerts: false, paymentAlerts: false,
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setSettings(prev => ({ 
          ...prev, 
          ...json.data.general, ...json.data.bank, ...json.data.payment, 
          ...json.data.shipping, ...json.data.notifications 
        }));
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const set = (field: string, value: any) => setSettings(prev => ({ ...prev, [field]: value }));
  const toggleSecret = (field: string) => setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSave = async (section: string) => {
    setSaving(true);
    let payload: any = { section: section.toLowerCase() };

    if (section === "General") payload.data = { businessName: settings.businessName, businessEmail: settings.businessEmail, businessPhone: settings.businessPhone, businessAddress: settings.businessAddress, businessWebsite: settings.businessWebsite };
    else if (section === "Bank") payload.data = { bankName: settings.bankName, accountNumber: settings.accountNumber, accountName: settings.accountName, bankBranch: settings.bankBranch };
    else if (section === "Payment") payload.data = { paystackPublicKey: settings.paystackPublicKey, paystackSecretKey: settings.paystackSecretKey, flutterwavePublicKey: settings.flutterwavePublicKey, flutterwaveSecretKey: settings.flutterwaveSecretKey };
    else if (section === "Shipping") payload.data = { standardShippingCost: Number(settings.standardShippingCost), expressShippingCost: Number(settings.expressShippingCost), freeShippingThreshold: Number(settings.freeShippingThreshold), pickupAvailable: settings.pickupAvailable };
    else if (section === "Notifications") payload.data = { emailNotifications: settings.emailNotifications, smsNotifications: settings.smsNotifications, orderNotifications: settings.orderNotifications, bookingNotifications: settings.bookingNotifications, lowStockAlerts: settings.lowStockAlerts, paymentAlerts: settings.paymentAlerts };

    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(`${section} settings saved successfully!`);
      await fetchSettings();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!settings.currentPassword || !settings.newPassword || !settings.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (settings.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/auth/update-password`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: settings.currentPassword,
          newPassword: settings.newPassword
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update password");
      toast.success("Password updated successfully!");
      set("currentPassword", "");
      set("newPassword", "");
      set("confirmPassword", "");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm bg-white transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  const SaveButton = ({ section }: { section: string }) => (
    <button
      onClick={() => handleSave(section)}
      disabled={saving}
      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-60 text-sm"
    >
      {saving ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Save size={16} />
      )}
      Save Changes
    </button>
  );

  const SecretInput = ({ field, label, placeholder }: { field: string; label: string; placeholder?: string }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type={showSecrets[field] ? "text" : "password"}
          value={(settings as any)[field]}
          onChange={e => set(field, e.target.value)}
          placeholder={placeholder}
          className={inputClass + " pr-10"}
        />
        <button
          type="button"
          onClick={() => toggleSecret(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showSecrets[field] ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );

  const Toggle = ({ field, label, description }: { field: string; label: string; description?: string }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => set(field, !(settings as any)[field])}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          (settings as any)[field] ? "bg-yellow-500" : "bg-gray-300"
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          (settings as any)[field] ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your business preferences and configurations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 ${
                    activeTab === tab.id
                      ? "bg-yellow-50 text-yellow-700 border-l-4 border-l-yellow-500"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* General */}
          {activeTab === "general" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500">Basic business information</p>
                </div>
                <SaveButton section="General" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business Name</label>
                  <input type="text" value={settings.businessName} onChange={e => set("businessName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Business Email</label>
                  <input type="email" value={settings.businessEmail} onChange={e => set("businessEmail", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" value={settings.businessPhone} onChange={e => set("businessPhone", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input type="url" value={settings.businessWebsite} onChange={e => set("businessWebsite", e.target.value)} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Business Address</label>
                  <input type="text" value={settings.businessAddress} onChange={e => set("businessAddress", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {activeTab === "bank" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Bank Account Details</h2>
                  <p className="text-sm text-gray-500">Used for bank transfer payments</p>
                </div>
                <SaveButton section="Bank" />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 font-medium">These details are shown to customers when they choose bank transfer payment.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input type="text" value={settings.bankName} onChange={e => set("bankName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Account Number</label>
                  <input type="text" value={settings.accountNumber} onChange={e => set("accountNumber", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Account Name</label>
                  <input type="text" value={settings.accountName} onChange={e => set("accountName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Branch (Optional)</label>
                  <input type="text" value={settings.bankBranch} onChange={e => set("bankBranch", e.target.value)} placeholder="e.g. Victoria Island" className={inputClass} />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Customer Preview</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">Bank: <span className="font-semibold text-gray-900">{settings.bankName}</span></p>
                  <p className="text-gray-600">Account: <span className="font-semibold text-gray-900">{settings.accountNumber}</span></p>
                  <p className="text-gray-600">Name: <span className="font-semibold text-gray-900">{settings.accountName}</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Keys */}
          {activeTab === "payment" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Payment Gateway Keys</h2>
                  <p className="text-sm text-gray-500">API keys for payment processing</p>
                </div>
                <SaveButton section="Payment" />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-medium">⚠️ Keep these keys secret. Never share them publicly.</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Paystack</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Public Key</label>
                    <input type="text" value={settings.paystackPublicKey} onChange={e => set("paystackPublicKey", e.target.value)} placeholder="pk_test_..." className={inputClass} />
                  </div>
                  <SecretInput field="paystackSecretKey" label="Secret Key" placeholder="sk_test_..." />
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-4">Flutterwave</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Public Key</label>
                      <input type="text" value={settings.flutterwavePublicKey} onChange={e => set("flutterwavePublicKey", e.target.value)} placeholder="FLWPUBK_..." className={inputClass} />
                    </div>
                    <SecretInput field="flutterwaveSecretKey" label="Secret Key" placeholder="FLWSECK_..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping */}
          {activeTab === "shipping" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Shipping Settings</h2>
                  <p className="text-sm text-gray-500">Configure delivery costs and options</p>
                </div>
                <SaveButton section="Shipping" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className={labelClass}>Standard Shipping (₦)</label>
                  <input type="number" value={settings.standardShippingCost} onChange={e => set("standardShippingCost", e.target.value)} className={inputClass} />
                  <p className="text-xs text-gray-500 mt-1">2-3 business days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className={labelClass}>Express Shipping (₦)</label>
                  <input type="number" value={settings.expressShippingCost} onChange={e => set("expressShippingCost", e.target.value)} className={inputClass} />
                  <p className="text-xs text-gray-500 mt-1">Next business day</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className={labelClass}>Free Shipping Threshold (₦)</label>
                  <input type="number" value={settings.freeShippingThreshold} onChange={e => set("freeShippingThreshold", e.target.value)} className={inputClass} />
                  <p className="text-xs text-gray-500 mt-1">Orders above this get free shipping</p>
                </div>
              </div>
              <Toggle field="pickupAvailable" label="Enable Store Pickup" description="Allow customers to pick up orders from your location" />
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Notification Settings</h2>
                  <p className="text-sm text-gray-500">Control when and how you receive alerts</p>
                </div>
                <SaveButton section="Notifications" />
              </div>
              <div className="space-y-3">
                <Toggle field="emailNotifications"   label="Email Notifications"   description="Receive notifications via email" />
                <Toggle field="smsNotifications"     label="SMS Notifications"     description="Receive notifications via SMS" />
                <Toggle field="orderNotifications"   label="New Order Alerts"      description="Get notified when a new order is placed" />
                <Toggle field="bookingNotifications" label="Booking Alerts"        description="Get notified when a new booking is made" />
                <Toggle field="lowStockAlerts"       label="Low Stock Alerts"      description="Get notified when product stock is running low" />
                <Toggle field="paymentAlerts"        label="Payment Alerts"        description="Get notified when a payment is confirmed or fails" />
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500">Update your admin password</p>
              </div>
              <div className="max-w-md space-y-4">
                <SecretInput field="currentPassword" label="Current Password" placeholder="Enter current password" />
                <SecretInput field="newPassword" label="New Password" placeholder="Enter new password" />
                <SecretInput field="confirmPassword" label="Confirm New Password" placeholder="Confirm new password" />

                {settings.newPassword && settings.confirmPassword && (
                  <div className={`flex items-center gap-2 text-sm ${
                    settings.newPassword === settings.confirmPassword ? "text-green-600" : "text-red-500"
                  }`}>
                    <CheckCircle size={16} />
                    {settings.newPassword === settings.confirmPassword ? "Passwords match" : "Passwords do not match"}
                  </div>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Shield size={16} />
                  }
                  Update Password
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}