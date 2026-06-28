"use client";

import { useState, useEffect } from "react";
import {
  Calendar, Search, Filter, Loader, X, CheckCircle,
  XCircle, Clock, MapPin, User, RefreshCw, Eye
} from "lucide-react";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

interface Booking {
  _id: string;
  bookingNumber: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  serviceSnapshot: {
    name: string;
    duration: number;
  };
  artist: {
    type: string;
    name?: string;
  };
  location: string;
  appointmentDate: string;
  timeSlot: {
    start: string;
    end: string;
  };
  pricing: {
    servicePrice: number;
    depositAmount: number;
    balanceAmount: number;
  };
  payment: {
    depositPaid: boolean;
    balancePaid: boolean;
    paymentMethod?: string;
  };
  status: string;
 notes?: {
    customerNotes?: string;
    adminNotes?: string;
  };
  rescheduleRequest?: {
    requestedDate: string;
    requestedTime: string;
    reason?: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: string;
    adminResponse?: string;
  };
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-yellow-100 text-yellow-800",
  confirmed:   "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed:   "bg-green-100 text-green-800",
  cancelled:   "bg-red-100 text-red-800",
  "no-show":   "bg-gray-100 text-gray-800",
};

const LOCATION_LABELS: Record<string, string> = {
  calabar:       "Calabar",
  "port-harcourt": "Port Harcourt",
};

const ARTIST_LABELS: Record<string, string> = {
  lulu:   "Lulu (Lead Artist)",
  senior: "Senior Artist",
  artist: "Artist",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function formatPrice(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [adminNote, setAdminNote] = useState("");
 const [rescheduleLoading, setRescheduleLoading] = useState<string | null>(null);
 const [rescheduleNote, setRescheduleNote] = useState("");
  const getToken = () => localStorage.getItem("token");

  const fetchBookings = async () => {
  try {
    setLoading(true);
    const token = getToken();
    // Always fetch ALL bookings — filter client-side so tab counts stay accurate
    const params = new URLSearchParams({ limit: "200" });
    if (locationFilter !== "all") params.append("location", locationFilter);

    const res = await fetch(`${BASE_URL}/bookings/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setBookings(json?.data || []);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, [locationFilter]);

  const handleStatusUpdate = async (bookingId: string, status: string, note?: string) => {
    setActionLoading(bookingId + "-" + status);
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status, note })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update");

      toast.success(`Booking ${status}!`);
      setShowModal(false);
      setAdminNote("");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to update booking");
    } finally {
      setActionLoading(null);
    }
  };
  const handleRescheduleResponse = async (bookingId: string, status: 'approved' | 'rejected', note: string) => {
  setRescheduleLoading(bookingId + "-" + status);
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}/reschedule/respond`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminResponse: note })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to respond");
    toast.success(`Reschedule ${status}!`);
    setShowModal(false);
    setRescheduleNote("");
    fetchBookings();
  } catch (err: any) {
    toast.error(err.message || "Failed to respond");
  } finally {
    setRescheduleLoading(null);
  }
};

  const handleCancel = async (bookingId: string) => {
    setActionLoading(bookingId + "-cancel");
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ reason: adminNote || "Cancelled by admin" })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to cancel");

      toast.success("Booking cancelled");
      setShowModal(false);
      setAdminNote("");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const name = `${b.customerInfo.firstName} ${b.customerInfo.lastName}`.toLowerCase();
    const matchesSearch = !search ||
      name.includes(search.toLowerCase()) ||
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerInfo.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: "all",         label: "All",         count: bookings.length },
    { id: "pending",     label: "Pending",      count: bookings.filter(b => b.status === "pending").length },
    { id: "confirmed",   label: "Confirmed",    count: bookings.filter(b => b.status === "confirmed").length },
    { id: "in-progress", label: "In Progress",  count: bookings.filter(b => b.status === "in-progress").length },
    { id: "completed",   label: "Completed",    count: bookings.filter(b => b.status === "completed").length },
    { id: "cancelled",   label: "Cancelled",    count: bookings.filter(b => b.status === "cancelled").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all service appointments</p>
        </div>
        <button onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setStatusFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              statusFilter === tab.id ? "bg-yellow-600" : "bg-gray-100 text-gray-600"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name, email or booking number..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" />
        </div>
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white">
          <option value="all">All Locations</option>
          <option value="calabar">Calabar</option>
          <option value="port-harcourt">Port Harcourt</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Calendar size={48} className="mb-3 opacity-30" />
            <p className="font-medium">No bookings found</p>
            <p className="text-sm mt-1">Bookings will appear here once customers make appointments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Booking</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Service</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Payment</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-sm text-gray-900">{booking.bookingNumber}</p>
                      <p className="text-xs text-gray-400">{formatDate(booking.createdAt)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.customerInfo.firstName} {booking.customerInfo.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{booking.customerInfo.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">{booking.serviceSnapshot?.name}</p>
                      <p className="text-xs text-gray-500">{ARTIST_LABELS[booking.artist?.type] || booking.artist?.type}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">{formatDate(booking.appointmentDate)}</p>
                      <p className="text-xs text-gray-500">{booking.timeSlot?.start} – {booking.timeSlot?.end}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{LOCATION_LABELS[booking.location] || booking.location}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${booking.payment.depositPaid ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs text-gray-600">
                            Deposit {booking.payment.depositPaid ? "paid" : "pending"} ({formatPrice(booking.pricing.depositAmount)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${booking.payment.balancePaid ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs text-gray-600">
                            Balance {booking.payment.balancePaid ? "paid" : "pending"} ({formatPrice(booking.pricing.balanceAmount)})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[booking.status] || "bg-gray-100 text-gray-600"}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => { setSelectedBooking(booking); setAdminNote(""); setShowModal(true); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBooking.bookingNumber}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedBooking.status]}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* Customer */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={15} /> Customer
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <p className="font-medium">{selectedBooking.customerInfo.firstName} {selectedBooking.customerInfo.lastName}</p>
                    <p className="text-gray-500">{selectedBooking.customerInfo.email}</p>
                    <p className="text-gray-500">{selectedBooking.customerInfo.phone}</p>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Service Details</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <p className="font-medium">{selectedBooking.serviceSnapshot?.name}</p>
                    <p className="text-gray-500">Artist: {ARTIST_LABELS[selectedBooking.artist?.type]}</p>
                    <p className="text-gray-500">Duration: {selectedBooking.serviceSnapshot?.duration} mins</p>
                  </div>
                </div>

                {/* Appointment */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={15} /> Appointment
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <p className="font-medium">{formatDate(selectedBooking.appointmentDate)}</p>
                    <p className="text-gray-500 flex items-center gap-1">
                      <Clock size={13} /> {selectedBooking.timeSlot?.start} – {selectedBooking.timeSlot?.end}
                    </p>
                    <p className="text-gray-500 flex items-center gap-1">
                      <MapPin size={13} /> {LOCATION_LABELS[selectedBooking.location]}
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Pricing & Payment</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service Price</span>
                      <span className="font-semibold">{formatPrice(selectedBooking.pricing.servicePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Deposit (50%)</span>
                      <div className="flex items-center gap-2">
                        <span>{formatPrice(selectedBooking.pricing.depositAmount)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          selectedBooking.payment.depositPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {selectedBooking.payment.depositPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Balance</span>
                      <div className="flex items-center gap-2">
                        <span>{formatPrice(selectedBooking.pricing.balanceAmount)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          selectedBooking.payment.balancePaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {selectedBooking.payment.balancePaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes?.customerNotes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Customer Notes</h3>
                    <p className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-3">
                      {selectedBooking.notes.customerNotes}
                    </p>
                  </div>
                )}
                

{selectedBooking.rescheduleRequest?.status === "pending" && (
  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 space-y-3">
    {/* Banner */}
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-black font-bold text-sm">!</span>
      </div>
      <div>
        <p className="font-bold text-yellow-800 text-sm">Reschedule Requested</p>
        <p className="text-xs text-yellow-700">Customer wants to change their appointment</p>
      </div>
    </div>

    {/* Request details */}
    <div className="bg-white rounded-lg p-3 space-y-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">New Date</span>
        <span className="font-semibold text-gray-800">
          {new Date(selectedBooking.rescheduleRequest.requestedDate).toLocaleDateString("en-GB", {
            weekday: "short", day: "2-digit", month: "short", year: "numeric"
          })}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">New Time</span>
        <span className="font-semibold text-gray-800">{selectedBooking.rescheduleRequest.requestedTime}</span>
      </div>
      {selectedBooking.rescheduleRequest.reason && (
        <div className="pt-1 border-t border-gray-100">
          <p className="text-gray-500 text-xs">Customer reason:</p>
          <p className="text-gray-700 mt-0.5">{selectedBooking.rescheduleRequest.reason}</p>
        </div>
      )}
    </div>

    {/* Admin response note */}
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        Response note (optional)
      </label>
      <textarea
        value={rescheduleNote}
        onChange={(e) => setRescheduleNote(e.target.value)}
        placeholder="e.g. Confirmed for new date, please arrive 10 mins early..."
        rows={2}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
      />
    </div>

    {/* Approve / Reject buttons */}
    <div className="flex gap-3">
      <button
        onClick={() => handleRescheduleResponse(selectedBooking._id, "rejected", rescheduleNote)}
        disabled={!!rescheduleLoading}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
      >
        {rescheduleLoading === selectedBooking._id + "-rejected"
          ? <Loader size={14} className="animate-spin" />
          : <XCircle size={14} />}
        Reject
      </button>
      <button
        onClick={() => handleRescheduleResponse(selectedBooking._id, "approved", rescheduleNote)}
        disabled={!!rescheduleLoading}
        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-1"
      >
        {rescheduleLoading === selectedBooking._id + "-approved"
          ? <Loader size={14} className="animate-spin" />
          : <CheckCircle size={14} />}
        Approve
      </button>
    </div>
  </div>
)}

{/* Show approved/rejected reschedule status */}
{selectedBooking.rescheduleRequest?.status === "approved" && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
    <p className="font-semibold text-green-700">✅ Reschedule Approved</p>
    <p className="text-green-600 text-xs mt-1">
      New date: {new Date(selectedBooking.rescheduleRequest.requestedDate).toLocaleDateString("en-GB")} at {selectedBooking.rescheduleRequest.requestedTime}
    </p>
    {selectedBooking.rescheduleRequest.adminResponse && (
      <p className="text-green-600 text-xs mt-1">Note: {selectedBooking.rescheduleRequest.adminResponse}</p>
    )}
  </div>
)}

{selectedBooking.rescheduleRequest?.status === "rejected" && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
    <p className="font-semibold text-red-700">❌ Reschedule Rejected</p>
    {selectedBooking.rescheduleRequest.adminResponse && (
      <p className="text-red-600 text-xs mt-1">Note: {selectedBooking.rescheduleRequest.adminResponse}</p>
    )}
  </div>
)}

                {/* Admin Note Input */}
                {["pending", "confirmed", "in-progress"].includes(selectedBooking.status) && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Admin Note (optional)</label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Add a note about this action..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                )}
        

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {selectedBooking.status === "pending" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking._id, "confirmed", adminNote)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedBooking._id + "-confirmed"
                        ? <Loader size={15} className="animate-spin" />
                        : <CheckCircle size={15} />}
                      Confirm
                    </button>
                  )}

                  {selectedBooking.status === "confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking._id, "in-progress", adminNote)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedBooking._id + "-in-progress"
                        ? <Loader size={15} className="animate-spin" />
                        : <Clock size={15} />}
                      Start Session
                    </button>
                  )}

                  {selectedBooking.status === "in-progress" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking._id, "completed", adminNote)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
                    >
                      {actionLoading === selectedBooking._id + "-completed"
                        ? <Loader size={15} className="animate-spin" />
                        : <CheckCircle size={15} />}
                      Mark Completed
                    </button>
                  )}

                  {["pending", "confirmed"].includes(selectedBooking.status) && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking._id, "no-show", adminNote)}
                        disabled={!!actionLoading}
                        className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60"
                      >
                        No Show
                      </button>
                      <button
                        onClick={() => handleCancel(selectedBooking._id)}
                        disabled={!!actionLoading}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-60"
                      >
                        {actionLoading === selectedBooking._id + "-cancel"
                          ? <Loader size={15} className="animate-spin" />
                          : <XCircle size={15} />}
                        Cancel
                      </button>
                    </>
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