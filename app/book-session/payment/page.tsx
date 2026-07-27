"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, CheckCircle, Shield, Copy } from "lucide-react";
import toast from "react-hot-toast";
import type { BookingDraft } from "../appointment/page";

const DRAFT_KEY = "bookingDraft";

interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

function formatPrice(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
}

export default function PaymentPage() {
  const router = useRouter();

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("transfer");
  const [selectedBank, setSelectedBank] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "Monie Point",
    accountNumber: "5173346455",
    accountName: "Lulu's Artistry",
  });

  // Load draft — if missing, the user skipped the form, send them back
  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) {
      toast.error("Please fill in your appointment details first");
      router.replace("/book-session/appointment");
      return;
    }
    try {
      setDraft(JSON.parse(raw));
    } catch {
      router.replace("/book-session/appointment");
      return;
    }
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

  const handleContinue = () => {
    if (!draft) return;

    if (paymentMethod === "transfer" && !selectedBank) {
      toast.error("Please select your bank");
      return;
    }

    const updated: BookingDraft = { ...draft, paymentMethod, selectedBank };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    router.push("/book-session/confirm");
  };

  if (loading || !draft) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const depositAmount = draft.depositAmount;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
          <Link
            href="/book-session/appointment"
            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            Book a Session — Lulu's Artistry
          </h1>
          <p className="text-gray-600">
            Choose how you'd like to pay for your appointment.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Payment Options</h2>
          <p className="text-gray-500 mb-6">Select your preferred payment method.</p>

          <div className="bg-gray-50 rounded-xl p-5 mb-8 space-y-3">
            <h3 className="font-semibold text-gray-800">Payment Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-800">{draft.serviceName || "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Full Price</span>
              <span className="font-medium">{formatPrice(draft.servicePrice)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
              <span className="text-gray-500">Deposit Required (50%)</span>
              <span className="font-bold text-yellow-500">{formatPrice(depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Balance (pay on day)</span>
              <span className="font-medium text-gray-600">{formatPrice(draft.balanceAmount)}</span>
            </div>
          </div>

          <div className="space-y-4">

            {/* Card — not wired up yet */}
            <label
              className="flex items-start p-4 border-2 rounded-xl cursor-not-allowed opacity-50 border-gray-200"
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                disabled
                className="w-5 h-5 mt-0.5"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-gray-500" />
                  <p className="font-semibold text-gray-800">Card payment</p>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">Coming soon</p>
              </div>
            </label>

            {/* Bank Transfer */}
            <div className="border-2 rounded-xl transition-all border-yellow-500 bg-yellow-50">
              <div className="flex items-start p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked
                  readOnly
                  className="w-5 h-5 mt-0.5 accent-yellow-500"
                />
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">₦</span>
                    </div>
                    <p className="font-semibold text-gray-800">Bank Transfer</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">Direct bank transfer</p>
                </div>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {[
                  { label: "Bank Name",      value: bankDetails.bankName },
                  { label: "Account Number", value: bankDetails.accountNumber },
                  { label: "Account Name",   value: bankDetails.accountName },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-800">{value}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(value, label)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy size={15} className="text-gray-500" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center justify-between p-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Amount to Transfer (Deposit)</p>
                    <p className="font-bold text-yellow-500 text-lg">
                      {formatPrice(depositAmount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(depositAmount.toString(), "Amount")}
                    className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                  >
                    <Copy size={15} className="text-gray-500" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select your bank *
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                  >
                    <option value="">Select your bank</option>
                    <option value="gtb">GTBank</option>
                    <option value="access">Access Bank</option>
                    <option value="uba">UBA</option>
                    <option value="zenith">Zenith Bank</option>
                    <option value="firstbank">First Bank</option>
                    <option value="moniepoint">Moniepoint</option>
                    <option value="opay">OPay</option>
                    <option value="palmpay">PalmPay</option>
                    <option value="kuda">Kuda Bank</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <p className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg p-3">
                  💡 Transfer the deposit amount above, then on the next page you'll enter your
                  transfer reference number so we can confirm your payment.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
            {[
              { icon: <CheckCircle size={15} className="text-green-500" />, label: "SSL Secure" },
              { icon: <Shield size={15} className="text-green-500" />,     label: "Privacy Protected" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/book-session/appointment"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors text-center"
            >
              ← Back
            </Link>
            <button
              onClick={handleContinue}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200"
            >
              Continue to Confirm →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}