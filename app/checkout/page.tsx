"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Truck, CreditCard, CheckCircle, Shield, Copy, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient, endpoints } from "@/lib/api/client";

// ── FIX: BASE_URL must NOT include /api — endpoints already include it ────────
const BASE_URL = "https://luluartistry-backend.onrender.com";
// Previously was "https://luluartistry-backend.onrender.com/api" which caused
// handleSubmitReference to call /api/api/orders/... → 404
// ─────────────────────────────────────────────────────────────────────────────

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface LiveBankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  paymentReference?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(2);

  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: ""
  });

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [rememberInfo, setRememberInfo] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [transferReference, setTransferReference] = useState("");
  const [submittingRef, setSubmittingRef] = useState(false);

  const [liveBankDetails, setLiveBankDetails] = useState<LiveBankDetails>({
    bankName: "Lulu Artistry LTD - GTBank",
    accountNumber: "0123456789",
    accountName: "Lulu Artistry",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access the checkout screen.");
      router.push("/login");
      return;
    }

    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.length === 0) {
        router.push("/cart");
      } else {
        // ── FIX: Warn if any cart item has a non-ObjectId id ─────────────────
        // This catches products added from static pages (home, new-arrivals)
        // before the PRODUCT_ID_MAP is filled in.
        const invalidItems = parsedCart.filter(
          (item: CartItem) => !/^[a-f\d]{24}$/i.test(item.id)
        );
        if (invalidItems.length > 0) {
          toast.error(
            `Some items in your cart aren't linked to our store yet: ${invalidItems.map((i: CartItem) => i.name).join(", ")}. Please remove them or add them from the Shop page.`,
            { duration: 6000 }
          );
        }
        // ─────────────────────────────────────────────────────────────────────
        setCartItems(parsedCart);
      }
    } else {
      router.push("/cart");
    }
  }, [router]);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  const getShippingCost = () => {
    switch (deliveryMethod) {
      case "standard": return 1200;
      case "express":  return 2500;
      case "pickup":   return 0;
      default:         return 1200;
    }
  };

  const calculateTotal = () => calculateSubtotal() + getShippingCost();
  const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

  const getDeliveryDate = () => {
    const today = new Date();
    const days = deliveryMethod === "standard" ? 3 : deliveryMethod === "express" ? 1 : 0;
    const d = new Date(today);
    d.setDate(today.getDate() + days);
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // ── Submit Transfer Reference ─────────────────────────────────────────────
  const handleSubmitReference = async () => {
    if (!transferReference.trim()) {
      toast.error("Please enter your transfer reference number");
      return;
    }
    if (!placedOrderId) {
      toast.error("Order not found. Please try again.");
      return;
    }

    setSubmittingRef(true);
    try {
      const token = localStorage.getItem("token");

      // ── FIX: Use BASE_URL (no /api) + full path including /api ────────────
      // Previously: `${BASE_URL}/api/orders/my/...` with BASE_URL ending in /api
      // → became /api/api/orders/... → 404
      // Now BASE_URL = "https://luluartistry-backend.onrender.com" (no /api)
      const res = await fetch(
        `${BASE_URL}/api/orders/my/${placedOrderId}/payment-reference`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: transferReference }),
        }
      );
      // ─────────────────────────────────────────────────────────────────────

      if (!res.ok) throw new Error("Failed to submit reference");

      toast.success("Payment reference submitted! We will confirm your payment shortly.");
      router.push("/order-success");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit reference. Please try again.");
    } finally {
      setSubmittingRef(false);
    }
  };

  // ── Main Proceed Handler ──────────────────────────────────────────────────
  const handleProceed = async () => {
    if (
      !customerData.fullName ||
      !customerData.email ||
      !customerData.phone ||
      !customerData.streetAddress ||
      !customerData.city ||
      !customerData.state
    ) {
      toast.error("Please fill in all required customer details");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms & conditions");
      return;
    }

    // ── FIX: Block checkout if any item has an invalid product ID ─────────
    const invalidItems = cartItems.filter(item => !/^[a-f\d]{24}$/i.test(item.id));
    if (invalidItems.length > 0) {
      toast.error(
        `Cannot checkout: some items aren't linked to our store: ${invalidItems.map(i => i.name).join(", ")}. Please remove them and add from the Shop page.`,
        { duration: 6000 }
      );
      return;
    }
    // ─────────────────────────────────────────────────────────────────────

    setIsProcessing(true);

    try {
      const nameParts = customerData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

const orderPayload = {
  orderNumber,
  items: cartItems.map((item) => ({
    product: item.id,
    quantity: item.quantity || 1,
    price: item.price,
    subtotal: item.price * (item.quantity || 1),
  })),
        customerInfo: {
          firstName,
          lastName,
          email: customerData.email,
          phone: customerData.phone,
        },
        shippingAddress: {
          street: customerData.streetAddress,
          city: customerData.city,
          state: customerData.state,
          landmark: "",
        },
        deliveryZone: {
          zone: customerData.state,
          cost: getShippingCost(),
        },
        paymentMethod: paymentMethod === "card" ? "paystack" : "transfer",
        notes: "",
      };

      const orderRes = await apiClient.post<any>(endpoints.createOrder, orderPayload);
      const order = orderRes?.data || orderRes;
      const orderId = order?._id || order?.id;

      if (!orderId) throw new Error("Failed to create order");

      localStorage.setItem("currentOrder", JSON.stringify(order));
      localStorage.removeItem("cart");

      if (paymentMethod === "transfer") {
        if (order?.payment?.bankDetails) {
          setLiveBankDetails({
            bankName: order.payment.bankDetails.bankName || liveBankDetails.bankName,
            accountNumber: order.payment.bankDetails.accountNumber || liveBankDetails.accountNumber,
            accountName: order.payment.bankDetails.accountName || liveBankDetails.accountName,
            paymentReference: order.payment?.reference,
          });
        } else if (order?.bankDetails) {
          setLiveBankDetails({
            bankName: order.bankDetails.bankName || liveBankDetails.bankName,
            accountNumber: order.bankDetails.accountNumber || liveBankDetails.accountNumber,
            accountName: order.bankDetails.accountName || liveBankDetails.accountName,
            paymentReference: order.payment?.reference || order.paymentReference,
          });
        } else if (order?.paymentReference || order?.payment?.reference) {
          setLiveBankDetails(prev => ({
            ...prev,
            paymentReference: order?.paymentReference || order?.payment?.reference
          }));
        }

        setPlacedOrderId(orderId);
        setOrderPlaced(true);
        setIsProcessing(false);
        toast.success("Order created! Please complete your bank transfer.");
        return;
      }

      const payRes = await apiClient.post<any>(endpoints.initializePayment, {
        type: "order",
        referenceId: orderId,
        amount: calculateTotal(),
        email: customerData.email,
      });

      const authorizationUrl =
        payRes?.data?.authorizationUrl ||
        payRes?.authorizationUrl ||
        payRes?.data?.authorization_url ||
        payRes?.authorization_url;

      if (!authorizationUrl) throw new Error("Failed to get payment URL from Paystack");

      window.location.href = authorizationUrl;

    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"}`}>1</div>
              <span className={`ml-3 font-medium ${currentStep >= 1 ? "text-primary-gold" : "text-gray-600"}`}>Delivery Info</span>
            </div>
            <div className={`h-1 w-32 mx-4 ${currentStep >= 2 ? "bg-primary-gold" : "bg-gray-300"}`} />
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"}`}>2</div>
              <span className={`ml-3 font-medium ${currentStep >= 2 ? "text-primary-gold" : "text-gray-600"}`}>Payment</span>
            </div>
            <div className={`h-1 w-32 mx-4 ${currentStep >= 3 ? "bg-primary-gold" : "bg-gray-300"}`} />
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${currentStep >= 3 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"}`}>3</div>
              <span className={`ml-3 font-medium ${currentStep >= 3 ? "text-primary-gold" : "text-gray-600"}`}>Review & confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="text-primary-gold" size={24} />
                <h2 className="text-xl font-bold text-dark-gray">Customer Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *",            key: "fullName",      type: "text",  placeholder: "Enter your name" },
                  { label: "Email Address *",         key: "email",         type: "email", placeholder: "Enter email" },
                  { label: "Phone Number *",          key: "phone",         type: "tel",   placeholder: "Enter phone number" },
                  { label: "Street Address *",        key: "streetAddress", type: "text",  placeholder: "Enter street address" },
                  { label: "City *",                  key: "city",          type: "text",  placeholder: "Enter city" },
                  { label: "State *",                 key: "state",         type: "text",  placeholder: "Enter state" },
                  { label: "Zip/Postcode (Optional)", key: "zipCode",       type: "text",  placeholder: "Enter zip/postcode" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <input
                      type={type}
                      value={customerData[key as keyof CustomerData]}
                      onChange={(e) => setCustomerData({ ...customerData, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="text-primary-gold" size={24} />
                <h2 className="text-xl font-bold text-dark-gray">Delivery Method</h2>
              </div>
              <div className="space-y-4">
                {[
                  { value: "standard", label: "Standard delivery", sub: "2-3 Days", price: 1200 },
                  { value: "express",  label: "Express Delivery",  sub: "Next Day", price: 2500 },
                  { value: "pickup",   label: "Pickup",            sub: "Available now", price: 0 },
                ].map((opt) => (
                  <label key={opt.value} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${deliveryMethod === opt.value ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="delivery" value={opt.value} checked={deliveryMethod === opt.value} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-5 h-5 text-primary-gold focus:ring-primary-gold" />
                    <div className="ml-4 flex-1 flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-dark-gray">{opt.label}</p>
                        <p className="text-sm text-gray-600">{opt.sub}</p>
                        {opt.value !== "pickup" && <p className="text-sm text-gray-600">By {getDeliveryDate()}</p>}
                      </div>
                      <p className="font-semibold text-dark-gray">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-primary-gold" size={24} />
                <h2 className="text-xl font-bold text-dark-gray">Payment Method</h2>
              </div>
              <div className="space-y-4">
                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary-gold focus:ring-primary-gold mt-1" />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-dark-gray">Paystack/Flutterwave (Debit/Credit Card)</p>
                    <p className="text-sm text-gray-600">Debit/Credit Card</p>
                    {paymentMethod === "card" && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium">
                          🔒 You will be redirected to Paystack's secure payment page to complete your payment.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "transfer" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value="transfer" checked={paymentMethod === "transfer"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-primary-gold focus:ring-primary-gold mt-1" />
                  <div className="ml-4 flex-1">
                    <p className="font-semibold text-dark-gray">Bank Transfer</p>
                    <p className="text-sm text-gray-600">Direct bank transfer</p>
                    {paymentMethod === "transfer" && (
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "Bank Name",      value: liveBankDetails.bankName },
                          { label: "Account Number", value: liveBankDetails.accountNumber },
                          { label: "Account Name",   value: liveBankDetails.accountName },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-600">{label}</p>
                              <p className="font-semibold">{value}</p>
                            </div>
                            <button type="button" onClick={() => copyToClipboard(value, label)} className="p-2 hover:bg-gray-200 rounded"><Copy size={16} /></button>
                          </div>
                        ))}
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-2 border-primary-gold">
                          <div>
                            <p className="text-xs text-gray-600">Amount to Transfer</p>
                            <p className="font-bold text-primary-gold text-lg">{formatPrice(calculateTotal())}</p>
                          </div>
                          <button type="button" onClick={() => copyToClipboard(calculateTotal().toString(), "Amount")} className="p-2 hover:bg-yellow-100 rounded"><Copy size={16} /></button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Select your bank</label>
                          <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent">
                            <option value="">Select your bank</option>
                            <option value="gtb">GTBank</option>
                            <option value="access">Access Bank</option>
                            <option value="uba">UBA</option>
                            <option value="zenith">Zenith Bank</option>
                            <option value="firstbank">First Bank</option>
                          </select>
                        </div>

                        {orderPlaced && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={18} className="text-green-500" />
                              <p className="text-sm font-semibold text-green-700">Order created! Now confirm your payment.</p>
                            </div>
                            {liveBankDetails.paymentReference && (
                              <div className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                                <div>
                                  <p className="text-xs text-gray-500">Your Payment Reference</p>
                                  <p className="font-bold text-gray-800">{liveBankDetails.paymentReference}</p>
                                </div>
                                <button type="button" onClick={() => copyToClipboard(liveBankDetails.paymentReference!, "Payment reference")} className="p-2 hover:bg-gray-100 rounded"><Copy size={16} /></button>
                              </div>
                            )}
                            <p className="text-xs text-green-600">
                              Transfer <span className="font-bold">{formatPrice(calculateTotal())}</span> to the account above
                              {liveBankDetails.paymentReference && <span>, using the reference above as narration</span>}.
                              Then enter your transfer receipt/reference below.
                            </p>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Receipt Reference *</label>
                              <input
                                type="text"
                                value={transferReference}
                                onChange={(e) => setTransferReference(e.target.value)}
                                placeholder="e.g. TRF202401151230"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent text-sm"
                              />
                              <p className="text-xs text-gray-400 mt-1">This is the reference/receipt number from your bank app or USSD.</p>
                            </div>
                            <button
                              type="button"
                              onClick={handleSubmitReference}
                              disabled={submittingRef}
                              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                              {submittingRef ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle size={16} />}
                              {submittingRef ? "Submitting..." : "I've Made the Payment"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Proceed Button */}
            <div>
              <button
                onClick={handleProceed}
                disabled={isProcessing || orderPlaced}
                className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isProcessing || orderPlaced ? "bg-gray-400 text-gray-600 cursor-not-allowed" : "bg-primary-gold hover:bg-yellow-500 text-black"
                }`}
              >
                {isProcessing && <Loader className="w-4 h-4 animate-spin" />}
                {isProcessing ? "Processing..." : orderPlaced ? "Order Placed ✓" : paymentMethod === "card" ? "Proceed to Payment" : "Place Order"}
              </button>
              <label className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="w-4 h-4 text-primary-gold focus:ring-primary-gold rounded" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="underline text-primary-gold">terms & conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="underline text-primary-gold">privacy policy</Link>
                </span>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-dark-gray mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-dark-gray">{item.name}</p>
                      <p className="text-xs text-gray-600">qty {item.quantity || 1}</p>
                      <p className="font-bold text-primary-gold">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo code/optional</label>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter promo code" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent" />
                  <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors">Apply</button>
                </div>
              </div>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">{formatPrice(getShippingCost())}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-bold text-lg text-primary-gold">{formatPrice(calculateTotal())}</span>
                </div>
              </div>
              <label className="flex items-center gap-2 mb-6 text-sm text-gray-600">
                <input type="checkbox" checked={rememberInfo} onChange={(e) => setRememberInfo(e.target.checked)} className="w-4 h-4 text-primary-gold focus:ring-primary-gold rounded" />
                <span>Remember all information for faster payments</span>
              </label>
            </div>
          </div>
        </div>

        {/* Security Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="text-green-500" size={16} />
            <Shield className="text-green-500" size={16} />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="text-green-500" size={16} />
            <span>Verify by Paystack</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="text-green-500" size={16} />
            <span>Privacy Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}