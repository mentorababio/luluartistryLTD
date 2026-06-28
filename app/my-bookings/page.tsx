"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, MapPin, CheckCircle, XCircle,
  Loader, Search, RefreshCw, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://luluartistry-backend.onrender.com/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RescheduleRequest {
  requestedDate: string;
  requestedTime: string;
  reason:        string;
  status:        "pending" | "approved" | "rejected";
  requestedAt:   string;
  adminResponse?: string;
}

interface Booking {
  _id:           string;
  bookingNumber: string;
  serviceSnapshot: { name: string; duration: number };
  artist:        { type: string; name?: string };
  location:      string;
  appointmentDate: string;
  timeSlot:      { start: string; end: string };
  pricing:       { servicePrice: number; depositAmount: number; balanceAmount: number };
  payment:       { depositPaid: boolean; balancePaid: boolean; paymentMethod?: string; depositPaymentId?: string };
  status:        string;
  notes?:        { customerNotes?: string };
  rescheduleRequest?: RescheduleRequest;
  createdAt:     string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATUS_STEPS = ["pending", "confirmed", "in-progress", "completed"];

const STATUS_COLORS: Record<string, string> = {
  pending:       "bg-yellow-100 text-yellow-800",
  confirmed:     "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed:     "bg-green-100 text-green-800",
  cancelled:     "bg-red-100 text-red-800",
  "no-show":     "bg-gray-100 text-gray-800",
};

const LOCATION_LABELS: Record<string, string> = {
  calabar:         "Calabar Studio",
  "port-harcourt": "Port Harcourt Studio",
  studio:          "Studio",
  home:            "Home Visit",
  mobile:          "Mobile Service",
};

const ARTIST_LABELS: Record<string, string> = {
  lulu:   "Lulu",
  sarah:  "Sarah Johnson",
  maya:   "Maya Williams",
  senior: "Senior Artist",
  artist: "Artist",
};

function formatPrice(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function formatShortDate(dateString: string) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Status Timeline component
// ---------------------------------------------------------------------------
function StatusTimeline({ status }: { status: string }) {
  const isCancelled = status === "cancelled" || status === "no-show";
  const currentStep = STATUS_STEPS.indexOf(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
        <XCircle size={16} />
        <span className="capitalize">{status}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-3 left-0 h-0.5 bg-yellow-500 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
        />

        {STATUS_STEPS.map((step, index) => {
          const isDone    = index < currentStep;
          const isActive  = index === currentStep;
          return (
            <div key={step} className="flex flex-col items-center z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                isDone   ? "bg-yellow-500 border-yellow-500" :
                isActive ? "bg-white border-yellow-500" :
                           "bg-white border-gray-300"
              }`}>
                {isDone && <CheckCircle size={14} className="text-white" />}
                {isActive && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
              </div>
              <span className={`text-[10px] mt-1 capitalize font-medium ${
                isDone || isActive ? "text-yellow-600" : "text-gray-400"
              }`}>
                {step === "in-progress" ? "In Progress" : step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Booking Card
// ---------------------------------------------------------------------------
function BookingCard({ booking, onRescheduleSuccess }: { booking: Booking; onRescheduleSuccess: () => void }) {
  const [expanded, setExpanded]               = useState(false);
  const [showReschedule, setShowReschedule]   = useState(false);
  const [rescheduleDate, setRescheduleDate]   = useState("");
  const [rescheduleTime, setRescheduleTime]   = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [submitting, setSubmitting]           = useState(false);

  const hasPendingReschedule = booking.rescheduleRequest?.status === "pending";
  const hasApprovedReschedule = booking.rescheduleRequest?.status === "approved";
  const canReschedule = !["completed", "cancelled", "no-show"].includes(booking.status) && !hasPendingReschedule;

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  ];

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error("Please select a new date and time");
      return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch(`${BASE_URL}/bookings/${booking._id}/reschedule`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          requestedDate: rescheduleDate,
          requestedTime: rescheduleTime,
          reason:        rescheduleReason,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || json?.message || "Failed to submit");
      toast.success("Reschedule request submitted! We'll confirm shortly.");
      setShowReschedule(false);
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleReason("");
      onRescheduleSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Booking Reference</p>
            <p className="font-bold text-gray-800 text-lg">{booking.bookingNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>
            {booking.status}
          </span>
        </div>

        {/* Status Timeline */}
        <div className="mb-4">
          <StatusTimeline status={booking.status} />
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Calendar size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Date</p>
              <p className="font-medium text-gray-800">{formatShortDate(booking.appointmentDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Time</p>
              <p className="font-medium text-gray-800">{booking.timeSlot?.start} – {booking.timeSlot?.end}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 col-span-2">
            <MapPin size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Service & Location</p>
              <p className="font-medium text-gray-800">{booking.serviceSnapshot?.name}</p>
              <p className="text-gray-500 text-xs">{LOCATION_LABELS[booking.location] || booking.location} · {ARTIST_LABELS[booking.artist?.type] || booking.artist?.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <span>View Details</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-4">

          {/* Payment Status */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Payment</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Service Price</span>
                <span className="font-semibold">{formatPrice(booking.pricing.servicePrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${booking.payment.depositPaid ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-gray-500">Deposit (50%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{formatPrice(booking.pricing.depositAmount)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${booking.payment.depositPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {booking.payment.depositPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-gray-500">Balance (pay on day)</span>
                </div>
                <span>{formatPrice(booking.pricing.balanceAmount)}</span>
              </div>
              {booking.payment.depositPaymentId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Transfer Ref</span>
                  <span className="font-medium text-gray-700">{booking.payment.depositPaymentId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reschedule Request Status */}
          {booking.rescheduleRequest && (
            <div className={`rounded-xl p-4 text-sm ${
              hasPendingReschedule  ? "bg-yellow-50 border border-yellow-200" :
              hasApprovedReschedule ? "bg-green-50 border border-green-200" :
                                      "bg-red-50 border border-red-200"
            }`}>
              <p className="font-semibold mb-1">
                {hasPendingReschedule  ? "⏳ Reschedule Requested" :
                 hasApprovedReschedule ? "✅ Reschedule Approved" :
                                         "❌ Reschedule Rejected"}
              </p>
              <p className="text-gray-600">
                New date: {formatShortDate(booking.rescheduleRequest.requestedDate)} at {booking.rescheduleRequest.requestedTime}
              </p>
              {booking.rescheduleRequest.reason && (
                <p className="text-gray-500 mt-1">Reason: {booking.rescheduleRequest.reason}</p>
              )}
              {booking.rescheduleRequest.adminResponse && (
                <p className="mt-2 font-medium">Admin: {booking.rescheduleRequest.adminResponse}</p>
              )}
            </div>
          )}

          {/* Customer Notes */}
          {booking.notes?.customerNotes && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Notes</p>
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">{booking.notes.customerNotes}</p>
            </div>
          )}

          {/* Reschedule Form */}
          {canReschedule && (
            <div>
              {!showReschedule ? (
                <button
                  onClick={() => setShowReschedule(true)}
                  className="w-full border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Request Reschedule
                </button>
              ) : (
                <div className="border-2 border-yellow-200 rounded-xl p-4 space-y-3">
                  <p className="font-semibold text-gray-800 text-sm">Request a New Date & Time</p>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Date *</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Time *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setRescheduleTime(t)}
                          className={`py-2 text-xs border rounded-lg transition-all ${
                            rescheduleTime === t
                              ? "border-yellow-500 bg-yellow-500 text-black font-semibold"
                              : "border-gray-200 hover:border-yellow-300"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Reason (optional)</label>
                    <textarea
                      value={rescheduleReason}
                      onChange={(e) => setRescheduleReason(e.target.value)}
                      placeholder="e.g. Work conflict, travel plans..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReschedule(false)}
                      className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReschedule}
                      disabled={submitting}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2.5 rounded-lg text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader size={14} className="animate-spin" /> : null}
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {hasPendingReschedule && (
            <p className="text-xs text-gray-400 text-center">
              Your reschedule request is being reviewed. We'll contact you shortly.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Content
// ---------------------------------------------------------------------------
function MyBookingsContent() {
  const searchParams = useSearchParams();

  const [bookings, setBookings]     = useState<Booking[]>([]);
  const [loading, setLoading]       = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Guest lookup
  const [guestRef, setGuestRef]     = useState(searchParams.get("ref") || "");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestBooking, setGuestBooking] = useState<Booking | null>(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState("");

  // Check if logged in and fetch bookings
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      setIsLoggedIn(true);
      fetchMyBookings(token);
    }

    // If ref param in URL, auto-fill guest ref
    const ref = searchParams.get("ref");
    if (ref) setGuestRef(ref);
  }, []);

  const fetchMyBookings = async (token: string) => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setBookings(json.data || []);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLookup = async () => {
    if (!guestRef.trim() || !guestPhone.trim()) {
      setGuestError("Please enter both your booking reference and phone number");
      return;
    }
    setGuestLoading(true);
    setGuestError("");
    setGuestBooking(null);
    try {
      const params = new URLSearchParams({ bookingNumber: guestRef.trim().toUpperCase(), phone: guestPhone.trim() });
      const res    = await fetch(`${BASE_URL}/bookings/track?${params}`);
      const json   = await res.json();
      if (!res.ok) throw new Error(json?.error || "Booking not found");
      setGuestBooking(json.data);
    } catch (err: any) {
      setGuestError(err.message || "Booking not found. Please check your details.");
    } finally {
      setGuestLoading(false);
    }
  };

  const refreshBookings = () => {
    const token = localStorage.getItem("token");
    if (token) fetchMyBookings(token);
    if (guestBooking) {
      handleGuestLookup();
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
            <p className="text-gray-500 text-sm mt-1">Track your appointments and payment status</p>
          </div>
          {(isLoggedIn || guestBooking) && (
            <button onClick={refreshBookings} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={18} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Logged-in view */}
        {isLoggedIn ? (
          <>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader className="animate-spin text-yellow-500" size={32} />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-20">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <p className="text-gray-400 text-sm mb-6">Book your first session with us!</p>
                <Link href="/book-session"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition-colors">
                  Book a Session
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} onRescheduleSuccess={refreshBookings} />
                ))}
              </div>
            )}
          </>
        ) : (
          /* Guest view */
          <div className="space-y-6">
            {/* Guest Lookup Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Track Your Booking</h2>
              <p className="text-sm text-gray-500 mb-5">
                Enter your booking reference and phone number to track your appointment.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Reference *
                  </label>
                  <input
                    type="text"
                    value={guestRef}
                    onChange={(e) => setGuestRef(e.target.value.toUpperCase())}
                    placeholder="e.g. BK-202607-0001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="e.g. 08012345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none text-sm"
                  />
                </div>

                {guestError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={16} />
                    <span>{guestError}</span>
                  </div>
                )}

                <button
                  onClick={handleGuestLookup}
                  disabled={guestLoading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {guestLoading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                  {guestLoading ? "Searching..." : "Track Booking"}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Have an account?{" "}
                  <Link href="/login" className="text-yellow-600 font-semibold hover:underline">
                    Log in
                  </Link>{" "}
                  to see all your bookings
                </p>
              </div>
            </div>

            {/* Guest Booking Result */}
            {guestBooking && (
              <div>
                <p className="text-sm text-gray-500 mb-3 font-medium">Booking found:</p>
                <BookingCard booking={guestBooking} onRescheduleSuccess={() => handleGuestLookup()} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function MyBookingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-yellow-500" size={32} />
      </div>
    }>
      <MyBookingsContent />
    </Suspense>
  );
}