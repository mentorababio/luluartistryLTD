"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, Calendar, Phone, MapPin } from "lucide-react";

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

const BookingSuccessContent = () => {
  const searchParams = useSearchParams();

  const bookingNumber     = searchParams.get("bookingNumber")     || "";
  const service           = searchParams.get("service")           || "";
  const fullName          = searchParams.get("fullName")          || "";
  const email             = searchParams.get("email")             || "";
  const phone             = searchParams.get("phone")             || "";
  const date              = searchParams.get("date")              || "";
  const time              = searchParams.get("time")              || "";
  const price             = searchParams.get("price")             || "0";
  const paymentMethod     = searchParams.get("paymentMethod")     || "";
  const transferReference = searchParams.get("transferReference") || "";

  const depositAmount = Math.round((parseFloat(price) || 0) * 0.5);
  const isTransfer    = paymentMethod === "transfer";

  const handleDownloadReceipt = () => {
    const date_str = new Date().toLocaleDateString("en-NG", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const receipt = `
================================================
       LULU ARTISTRY — BOOKING RECEIPT
================================================

Date:            ${date_str}
Booking Ref:     ${bookingNumber || "Pending"}
Status:          ${isTransfer ? "Awaiting Payment Confirmation" : "Confirmed"}

------------------------------------------------
SERVICE:         ${service}
Appointment:     ${formatDate(date)} at ${time}

DEPOSIT PAID:    ${formatPrice(depositAmount)}
TOTAL PRICE:     ${formatPrice(price)}
BALANCE DUE:     ${formatPrice(Math.round(parseFloat(price) * 0.5))} (pay on the day)

PAYMENT:         ${isTransfer ? "Bank Transfer" : "Card"}
${transferReference ? `TRANSFER REF:    ${transferReference}` : ""}

------------------------------------------------
CUSTOMER:
Name:   ${fullName}
Email:  ${email}
Phone:  ${phone}

================================================
  Thank you for booking with Lulu Artistry!
  Questions? Call 09018022296
  Email: lulusartistry321@gmail.com
================================================
    `.trim();

    const blob = new Blob([receipt], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${bookingNumber || "booking"}-receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isTransfer ? "Booking Created!" : "Booking Confirmed!"}
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {isTransfer
            ? "We've received your booking and transfer reference. We'll confirm once payment is verified."
            : "Your appointment is confirmed. See you soon!"}
        </p>

        {/* Booking summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          {bookingNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Booking Ref</span>
              <span className="font-bold text-gray-800">{bookingNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service</span>
            <span className="font-semibold text-gray-800 text-right max-w-[60%]">{service}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold text-gray-800">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Time</span>
            <span className="font-semibold text-gray-800">{time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deposit</span>
            <span className="font-bold text-yellow-500">{formatPrice(depositAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Balance</span>
            <span className="text-gray-500">{formatPrice(Math.round(parseFloat(price) * 0.5))} (pay on the day)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className={`font-semibold ${isTransfer ? "text-orange-500" : "text-green-600"}`}>
              {isTransfer ? "Awaiting Confirmation" : "Confirmed"}
            </span>
          </div>
          {transferReference && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transfer Ref</span>
              <span className="font-semibold text-gray-800">{transferReference}</span>
            </div>
          )}
        </div>

        {/* Transfer pending note */}
        {isTransfer && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-yellow-800 font-semibold mb-1">Payment Pending</p>
            <p className="text-xs text-yellow-700">
              Your booking is reserved. Once we confirm your transfer, your appointment will be
              fully confirmed. This usually takes 1–2 hours during business hours.
            </p>
          </div>
        )}

        {/* Save reference reminder */}
        {bookingNumber && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-800 font-semibold mb-1">Save Your Reference</p>
            <p className="text-xs text-blue-700">
              Use <span className="font-bold">{bookingNumber}</span> to track your booking anytime.
            </p>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleDownloadReceipt}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <Download size={16} />
          Download Receipt
        </button>

        {/* Track My Booking — key new button */}
        <Link
          href={`/my-bookings${bookingNumber ? `?ref=${bookingNumber}` : ""}`}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <MapPin size={16} />
          Track My Booking
        </Link>

        <Link href="/book-session">
          <button className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-3">
            <Calendar size={16} />
            Book Another Session
          </button>
        </Link>

        <Link href="/">
          <button className="w-full border border-gray-200 text-gray-500 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
            Back to Home
          </button>
        </Link>

        {/* Contact */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Phone size={12} />
          <span>Questions? Call 09018022296</span>
        </div>
      </div>
    </div>
  );
};

const BookingSuccessPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    }
  >
    <BookingSuccessContent />
  </Suspense>
);

export default BookingSuccessPage;