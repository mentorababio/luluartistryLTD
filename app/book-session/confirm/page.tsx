"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, Loader } from "lucide-react";
import toast from "react-hot-toast";
import type { BookingDraft } from "../appointment/page";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luluartistry-backend.onrender.com/api";

const DRAFT_KEY = "bookingDraft";

const LOCATION_LABELS: Record<string, string> = {
  calabar: "Calabar Studio",
   "home service": "Home Service",
};

function formatPrice(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
}

export default function ConfirmBookingPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [bookingCreated, setBookingCreated] = useState(false);
  const [bookingNumber, setBookingNumber] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [submittingRef, setSubmittingRef] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    bankName: "Monie Point",
    accountNumber: "5173346455",
    accountName: "Lulu's Artistry",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) {
      toast.error("Please fill in your appointment details first");
      router.replace("/book-session/appointment");
      return;
    }
    const parsed: BookingDraft = JSON.parse(raw);
    if (!parsed.paymentMethod) {
      toast.error("Please select a payment method first");
      router.replace("/book-session/payment");
      return;
    }
    setDraft(parsed);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetch("https://luluartistry-backend.onrender.com/api/settings/public")
      .then(res => res.json())
      .then(json => {
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

  // Step 1 — create the booking
  const handleConfirmBooking = async () => {
    if (!draft) return;
    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const body = {
        service: draft.serviceId,
        serviceSnapshot: {
          name: draft.serviceName,
          description: draft.serviceDescription,
          duration: draft.serviceDuration,
        },
        artist: { type: draft.artistType, name: draft.artistName },
        location: draft.location,
        appointmentDate: draft.appointmentDate,
        timeSlot: { start: draft.timeSlot, end: draft.timeSlotEnd },
        notes: draft.notes,
        customerInfo: {
          firstName: draft.firstName,
          lastName:  draft.lastName,
          email:     draft.email.trim().toLowerCase(),
          phone:     draft.phone.trim(),
        },
        pricing: {
          servicePrice:  draft.servicePrice,
          depositAmount: draft.depositAmount,
          balanceAmount: draft.balanceAmount,
        },
        payment: {
          depositPaid: false,
          balancePaid: false,
          paymentMethod: "transfer",
        },
      };

      const endpoint = token ? `${BASE_URL}/bookings` : `${BASE_URL}/bookings/guest`;

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

      const savedBookingNumber = json.data?.bookingNumber || "";
      const savedBookingId     = json.data?._id || json.data?.id || "";

      setBookingNumber(savedBookingNumber);
      setBookingId(savedBookingId);
      setBookingCreated(true);
      toast.success(`Booking created! Reference: ${savedBookingNumber}. Now complete your transfer.`);
    } catch (err) {
      console.error("[Booking] Error:", err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2 — submit transfer reference, then go to success
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
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/payment-reference`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reference: transferReference }),
      });

      if (res.ok) {
        toast.success("Payment reference submitted! We'll confirm your payment shortly.");
      } else {
        toast.success("Booking confirmed! Please contact us with your reference if needed.");
      }

      sessionStorage.removeItem(DRAFT_KEY);

      const params = new URLSearchParams({
        bookingNumber,
        service:  draft?.serviceName || "",
        fullName: `${draft?.firstName} ${draft?.lastName}`,
        email:    draft?.email || "",
        phone:    draft?.phone || "",
        date:     draft?.appointmentDate || "",
        time:     draft?.timeSlot || "",
        price:    String(draft?.servicePrice || ""),
        deposit:  String(draft?.depositAmount || ""),
        location: draft?.location || "",
        artist:   draft?.artistName || "",
        transferReference,
      });
      router.push(`/book-session/success?${params.toString()}`);
    } catch {
      toast.error("Failed to submit reference. Please contact us directly.");
    } finally {
      setSubmittingRef(false);
    }
  };

  if (loading || !draft) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Confirm Your Booking</h1>
          <p className="text-gray-500">Review your appointment details before confirming.</p>
        </div>

        <div className="space-y-5 mb-6">

          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Service Booked</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{draft.serviceName}</p>
                  <p className="text-sm text-gray-500">{draft.artistName}</p>
                </div>
                <p className="font-bold text-gray-800">{formatPrice(draft.servicePrice)}</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-yellow-200">
                <div>
                  <p className="font-semibold text-gray-800">Deposit Due Now (50%)</p>
                  <p className="text-sm text-gray-500">Balance paid on the day</p>
                </div>
                <p className="font-bold text-yellow-500">{formatPrice(draft.depositAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Appointment Details</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: "Date",     value: formatDate(draft.appointmentDate) },
                { label: "Time",     value: draft.timeSlot },
                { label: "Location", value: LOCATION_LABELS[draft.location] || draft.location },
                { label: "Payment",  value: "Bank transfer" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}:</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Your Information</h2>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{draft.firstName} {draft.lastName}</p>
              <p>{draft.email}</p>
              <p>{draft.phone}</p>
            </div>
          </div>

          {!bookingCreated && (
            <div className="bg-yellow-50 rounded-xl p-6">
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
          )}

          {bookingCreated && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <p className="font-bold text-green-700">
                  Booking created — Ref: {bookingNumber}
                </p>
              </div>

              <p className="text-sm text-green-700">
                Now transfer <span className="font-bold">{formatPrice(draft.depositAmount)}</span> to
                the account below, then enter your transfer receipt reference.
              </p>

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

                <div className="flex items-center justify-between p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Amount to Transfer</p>
                    <p className="font-bold text-yellow-500 text-lg">{formatPrice(draft.depositAmount)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(draft.depositAmount.toString(), "Amount")}
                    className="p-2 hover:bg-yellow-100 rounded-lg"
                  >
                    <Copy size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer receipt / reference number *
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
                  : <><CheckCircle size={16} /> I've made the transfer</>}
              </button>
            </div>
          )}
        </div>

        {!bookingCreated && (
          <div className="flex gap-4">
            <Link
              href="/book-session/payment"
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
      </div>
    </div>
  );
}