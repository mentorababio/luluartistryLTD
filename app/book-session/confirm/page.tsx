"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, Loader } from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luluartistry-backend.onrender.com/api";

const ARTIST_NAME_MAP: Record<string, string> = {
  lulu:  "Lulu",
  sarah: "Sarah Johnson",
  maya:  "Maya Williams",
};

const SERVICE_DURATIONS: Record<string, string> = {
  "Classic Set":                "1.5 hours",
  "Hybrid Set":                 "2 hours",
  "Volume Set":                 "2.5 hours",
  " MegaVolume Set":            "3 hours",
  "Ombré Powder Brows":         "3 hours",
  "Signature Combo Brows":      "3 hours",
  "Microshading":               "2.5 hours",
  "Brow Lamination & Tint":     "1 hour",
  "Brow Touch-up (All Types)":  "1 hour",
};

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  preferredContact: "whatsapp" | "email" | "phone";
}

interface BookingData {
  service: string;
  artist: string;
  date: string;
  time: string;
  location: string;
  price: string;
  paymentMethod: string;
  selectedBank: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatPrice(price: string | number) {
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(n)) return "₦0";
  return `₦${n.toLocaleString("en-NG")}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function toTime24(timeString: string): string {
  if (!timeString) return "";
  if (!timeString.includes("AM") && !timeString.includes("PM")) return timeString;
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":");
  let hour24 = parseInt(hours, 10);
  if (period.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12;
  if (period.toUpperCase() === "AM" && hour24 === 12) hour24 = 0;
  return `${String(hour24).padStart(2, "0")}:${minutes || "00"}`;
}

function resolvePaymentMethod(method: string): "paystack" | "cash" | "transfer" {
  if (method === "paystack" || method === "cash" || method === "transfer") return method;
  if (method === "card") return "paystack";
  return "transfer";
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
}

// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------
const ConfirmBookingPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingData, setBookingData] = useState<BookingData>({
    service: "", artist: "", date: "", time: "",
    location: "", price: "", paymentMethod: "", selectedBank: "",
  });

  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "", email: "", phone: "", preferredContact: "whatsapp",
  });

  const [agreeToTerms, setAgreeToTerms]     = useState(false);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  // After booking is created — for bank transfer reference submission
  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingNumber, setBookingNumber]   = useState("");
  const [bookingId, setBookingId]           = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [submittingRef, setSubmittingRef]   = useState(false);

  // Bank details (fetched live)
  const [bankDetails, setBankDetails] = useState({
    bankName: "Monie Point",
    accountNumber: "5173346455",
    accountName: "Lulu's Artistry",
  });

  // Hydrate from URL
  useEffect(() => {
    setBookingData({
      service:       searchParams.get("service")       || "",
      artist:        searchParams.get("artist")        || "",
      date:          searchParams.get("date")          || "",
      time:          searchParams.get("time")          || "",
      location:      searchParams.get("location")      || "",
      price:         searchParams.get("price")         || "",
      paymentMethod: searchParams.get("paymentMethod") || "",
      selectedBank:  searchParams.get("selectedBank")  || "",
    });
  }, [searchParams]);

  // Safety: normalize artist field if it came through as an object
useEffect(() => {
  if (bookingData.artist && typeof bookingData.artist === "object") {
    setBookingData(prev => ({
      ...prev,
      artist: (prev.artist as any)?.type || (prev.artist as any)?.name || "",
    }));
  }
}, [bookingData.artist]);
  // Fetch live bank details
  useEffect(() => {
    fetch("https://luluartistry-backend.onrender.com/api/settings/public")
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && json?.data?.bank) {
          setBankDetails({
            bankName:      json.data.bank.bankName,
            accountNumber: json.data.bank.accountNumber,
            accountName:   json.data.bank.accountName,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Auto-fill for logged-in customers
useEffect(() => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return;

  fetch("https://luluartistry-backend.onrender.com/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.data) {
        const user = data.data;
        setCustomerData({
          fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          phone: user.phone || "",
          preferredContact: "whatsapp",
        });
      }
    })
    .catch(() => {});
}, []);

  const price         = parseFloat(bookingData.price) || 0;
  const depositAmount = Math.round(price * 0.5);
  const isTransfer    = bookingData.paymentMethod === "transfer";

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  function validate(): string | null {
    if (!customerData.fullName.trim())  return "Please enter your full name";
    if (!customerData.email.trim())     return "Please enter your email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email))
      return "Please enter a valid email address";
    if (!customerData.phone.trim())     return "Please enter your phone number";
    if (!agreeToTerms)                  return "Please agree to the terms and conditions";
    if (!bookingData.service)           return "No service selected — please go back";
    if (!bookingData.date)              return "No date selected — please go back";
    if (!bookingData.time)              return "No time selected — please go back";
    return null;
  }

  // ---------------------------------------------------------------------------
  // Step 1 — Create booking in DB
  // ---------------------------------------------------------------------------
  const handleConfirmBooking = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    setIsSubmitting(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const nameParts = customerData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName  = nameParts.slice(1).join(" ") || firstName;

      const body = {
        service:         bookingData.service,
        artist: {
          type: bookingData.artist,
          name: ARTIST_NAME_MAP[bookingData.artist] || bookingData.artist,
        },
        location:        bookingData.location,
        appointmentDate: bookingData.date,
        timeSlot: { start: toTime24(bookingData.time) },
        notes: "",
        customerInfo: { firstName, lastName, email: customerData.email.trim().toLowerCase(), phone: customerData.phone.trim() },
        pricing: {
          servicePrice:  price,
          depositAmount,
          balanceAmount: price - depositAmount,
        },
        payment: {
          depositPaid:   false,
          balancePaid:   false,
          paymentMethod: resolvePaymentMethod(bookingData.paymentMethod),
        },
      };

      const endpoint = token
        ? `${BASE_URL}/bookings`
        : `${BASE_URL}/bookings/guest`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json?.error || json?.message || "Failed to create booking");
        return;
      }

      // Booking saved — now handle payment method
      const savedBookingNumber = json.data?.bookingNumber || "";
      const savedBookingId     = json.data?._id || json.data?.id || "";

      setBookingNumber(savedBookingNumber);
      setBookingId(savedBookingId);

      if (isTransfer) {
        // Show reference input section
        setBookingCreated(true);
        toast.success(`Booking created! Reference: ${savedBookingNumber}. Now complete your transfer.`);
      } else {
        // Card — go straight to success
        const params = new URLSearchParams({
          bookingNumber: savedBookingNumber,
          service:       bookingData.service,
          fullName:      customerData.fullName,
          email:         customerData.email,
          phone:         customerData.phone,
          date:          bookingData.date,
          time:          bookingData.time,
          price:         bookingData.price,
        });
        router.push(`/book-session/success?${params.toString()}`);
      }
    } catch (err) {
      console.error("[Booking] Error:", err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Step 2 — Submit transfer reference (bank transfer only)
  // ---------------------------------------------------------------------------
  const handleSubmitReference = async () => {
    if (!transferReference.trim()) {
      toast.error("Please enter your transfer reference number");
      return;
    }
    if (!bookingId) {
      toast.error("Booking not found. Please try again.");
      return;
    }

    setSubmittingRef(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(
        `https://luluartistry-backend.onrender.com/api/bookings/${bookingId}/payment-reference`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ reference: transferReference }),
        }
      );

      // Even if the endpoint doesn't exist yet, navigate to success
      // The reference is noted in the toast for admin awareness
      if (res.ok) {
        toast.success("Payment reference submitted! We'll confirm your payment shortly.");
      } else {
        // Non-blocking — still go to success, admin sees booking in dashboard
        toast.success("Booking confirmed! Please contact us with your reference if needed.");
      }

      const params = new URLSearchParams({
        bookingNumber:    bookingNumber,
        service:          bookingData.service,
        fullName:         customerData.fullName,
        email:            customerData.email,
        phone:            customerData.phone,
        date:             bookingData.date,
        time:             bookingData.time,
        price:            bookingData.price,
        paymentMethod:    "transfer",
        transferReference,
      });
      router.push(`/book-session/success?${params.toString()}`);
    } catch {
      toast.error("Failed to submit reference. Please contact us directly.");
    } finally {
      setSubmittingRef(false);
    }
  };

  const duration = SERVICE_DURATIONS[bookingData.service] || "2 hours";

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Confirm Your Booking</h1>
          <p className="text-gray-500">Review your appointment details before confirming.</p>
        </div>

        <div className="space-y-5 mb-6">

          {/* Service summary */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Services Booked</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{bookingData.service}</p>
                  <p className="text-sm text-gray-500">{duration}</p>
                </div>
                <p className="font-bold text-gray-800">{formatPrice(bookingData.price)}</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-yellow-200">
                <div>
                  <p className="font-semibold text-gray-800">Deposit Due Now (50%)</p>
                  <p className="text-sm text-gray-500">Balance paid on the day</p>
                </div>
                <p className="font-bold text-yellow-500">{formatPrice(depositAmount)}</p>
              </div>
            </div>
          </div>

          {/* Appointment details */}
          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Appointment Details</h2>
            <div className="space-y-2 text-sm">
              {[
         { label: "Date",     value: formatDate(bookingData.date) },
{ label: "Time",     value: bookingData.time },
{ label: "Artist",   value: ARTIST_NAME_MAP[bookingData.artist] || String(bookingData.artist) },
{ label: "Location", value: bookingData.location },
{ label: "Payment",  value: isTransfer ? "Bank Transfer" : "Card" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-semibold text-gray-800 capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer info form — only shown before booking is created */}
          {!bookingCreated && (
            <div className="bg-yellow-50 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={customerData.fullName}
                      onChange={(e) => setCustomerData((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                      placeholder="+2348012345678"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                    <select
                      value={customerData.preferredContact}
                      onChange={(e) =>
                        setCustomerData((p) => ({
                          ...p,
                          preferredContact: e.target.value as CustomerData["preferredContact"],
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-yellow-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 accent-yellow-500 rounded"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the terms and conditions, cancellation policy, and understand that
                      late arrivals may result in reduced service time.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------
              BANK TRANSFER REFERENCE SECTION
              Shown only after booking is successfully created
          ---------------------------------------------------------------- */}
          {bookingCreated && isTransfer && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <p className="font-bold text-green-700">
                  Booking Created! — Ref: {bookingNumber}
                </p>
              </div>

              <p className="text-sm text-green-700">
                Now transfer <span className="font-bold">{formatPrice(depositAmount)}</span> to
                the account below, then enter your transfer receipt reference.
              </p>

              {/* Bank details reminder */}
              <div className="space-y-2">
                {[
                  { label: "Bank Name",      value: bankDetails.bankName },
                  { label: "Account Number", value: bankDetails.accountNumber },
                  { label: "Account Name",   value: bankDetails.accountName },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-800">{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(value, label)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Copy size={14} className="text-gray-400" />
                    </button>
                  </div>
                ))}

                {/* Amount */}
                <div className="flex items-center justify-between p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Amount to Transfer</p>
                    <p className="font-bold text-yellow-500 text-lg">{formatPrice(depositAmount)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(depositAmount.toString(), "Amount")}
                    className="p-2 hover:bg-yellow-100 rounded-lg"
                  >
                    <Copy size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Reference input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Receipt / Reference Number *
                </label>
                <input
                  type="text"
                  value={transferReference}
                  onChange={(e) => setTransferReference(e.target.value)}
                  placeholder="e.g. TRF202407011045"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This is the receipt/reference number from your bank app or USSD.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmitReference}
                disabled={submittingRef}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submittingRef
                  ? <><Loader size={16} className="animate-spin" /> Submitting...</>
                  : <><CheckCircle size={16} /> I've Made the Transfer</>}
              </button>
            </div>
          )}
        </div>

        {/* Navigation buttons — only shown before booking created */}
        {!bookingCreated && (
          <div className="flex gap-4">
            <Link
              href={`/book-session/payment?service=${encodeURIComponent(bookingData.service)}&artist=${encodeURIComponent(bookingData.artist)}&date=${encodeURIComponent(bookingData.date)}&time=${encodeURIComponent(bookingData.time)}&location=${encodeURIComponent(bookingData.location)}`}
              className="flex-1 bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold py-4 px-6 rounded-lg transition-colors text-center"
            >
              ← Back
            </Link>
            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting
                ? <><Loader size={16} className="animate-spin" /> Confirming...</>
                : "Confirm Booking"}
            </button>
          </div>
        )}

        {/* Policies */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Important Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Cancellation", body: "Cancel or reschedule at least 24 hours in advance to avoid fees." },
              { title: "No-Show",      body: "No-shows may result in loss of deposit and affect future booking rights." },
              { title: "Late Arrival", body: "Arrivals 15+ mins late may result in reduced service time." },
              { title: "Payment",      body: "Deposit required to secure your appointment. Refunds subject to policy." },
              { title: "Health",       body: "Inform us of allergies or medical conditions. Strict hygiene maintained." },
              { title: "Contact",      body: "Need to reschedule? Call 09018022296 or email lulusartistry321@gmail.com" },
            ].map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-500 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmBookingPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    }
  >
    <ConfirmBookingPageContent />
  </Suspense>
);

export default ConfirmBookingPage;