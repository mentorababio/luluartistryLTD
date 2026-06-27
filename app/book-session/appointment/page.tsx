"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { lulu } from "@/assets";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";

// ---------------------------------------------------------------------------
// Base prices (Lulu = full price)
// Sarah = 10% less, Maya = 15% less
// ---------------------------------------------------------------------------
const BASE_PRICES: Record<string, number> = {
  "Ombré Powder Brows":                      700000,
  "Signature Combo Brows":                    80000,
  "Microshading":                             70000,
  "Brow Lamination & Tint":                   40000,
  "Brow Touch-up (All Types)":                60000,
  "Classic Set":                              20000,
  "Hybrid Set":                               25000,
  "Volume Set":                             1200000,
  " MegaVolume Set":                          40000,
  " Bottom Lashes":                           10000,
  " Wispy Add-On":                             8000,
  " The Aleks Set":                           50000,
  " Dolly Set":                               66000,
  " Flirty Fox Eye":                          40000,
  " The Eb Luxe Set":                         40000,
  " Private Brow Training":                  400000,
  "Group Brow Training":                     300000,
  " Private Lash Training":                  300000,
  " Group Lash Training":                    200000,
  " Private Combo Lash + Brow Training":     650000,
  " Group Combo Lash + Brow Training":       450000,
  "Private Brow Lamination & Tint Training": 150000,
};

const ARTIST_MULTIPLIERS: Record<string, number> = {
  lulu:  1.00,  // full price
  sarah: 0.90,  // 10% less
  maya:  0.85,  // 15% less
};

function getPrice(service: string, artist: string): number {
  const base       = BASE_PRICES[service] || 0;
  const multiplier = ARTIST_MULTIPLIERS[artist] || 1;
  return Math.round(base * multiplier);
}

function formatPrice(n: number) {
  return `₦${n.toLocaleString("en-NG")}`;
}

// ---------------------------------------------------------------------------
const AppointmentPageContent = () => {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [formData, setFormData] = useState({
    service:  "",
    artist:   "",
    date:     "",
    time:     "",
    location: "",
  });

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Hydrate service from URL
 useEffect(() => {
    const service = searchParams.get("service");
    const date    = searchParams.get("date");
    const time    = searchParams.get("time");

    // Convert HH:MM (24hr) to "H:MM AM/PM" to match time slot buttons
    let convertedTime = "";
    if (time) {
        const decoded = decodeURIComponent(time);
        if (decoded.includes("AM") || decoded.includes("PM")) {
            convertedTime = decoded; // already 12-hour format
        } else {
            const [h, m] = decoded.split(":").map(Number);
            const period = h >= 12 ? "PM" : "AM";
            const hour12 = h % 12 || 12;
            convertedTime = `${hour12}:${String(m).padStart(2, "0")} ${period}`;
        }
    }

    setFormData(prev => ({
        ...prev,
        ...(service       ? { service: decodeURIComponent(service) } : {}),
        ...(date          ? { date }                                  : {}),
        ...(convertedTime ? { time: convertedTime }                   : {}),
    }));

    if (date) setAvailableTimes(timeSlots);
}, [searchParams]);

  const artists = [
    { id: "lulu",  name: "Lulu" },
    { id: "sarah", name: "Sarah Johnson" },
    { id: "maya",  name: "Maya Williams" },
  ];

  const locations = [
    { id: "calabar",       name: "Calabar Studio" },
    { id: "port-harcourt", name: "Port Harcourt Studio" },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "date") setAvailableTimes(timeSlots);
  };

  // Derived pricing
  const servicePrice  = getPrice(formData.service, formData.artist);
  const depositAmount = Math.round(servicePrice * 0.5);
  const balanceAmount = servicePrice - depositAmount;

  const handleNext = () => {
    if (!formData.artist || !formData.date || !formData.time || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    const params = new URLSearchParams({
      service:  formData.service,
      artist:   formData.artist,
      date:     formData.date,
      time:     formData.time,
      location: formData.location,
      price:    servicePrice.toString(),
    });

    router.push(`/book-session/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
          <Link
            href="/book-session"
            className="flex items-center gap-2 text-primary-gold hover:text-yellow-500 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-2">
            Book a Session — Lulu's Academy
          </h1>
          <p className="text-lg text-gray-600">Book Your Appointment.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark-gray mb-6">Appointment Details</h2>

              <div className="space-y-6">

                {/* Service — read only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <input
                    type="text"
                    value={formData.service}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                {/* Artist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Artist *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={formData.artist}
                      onChange={(e) => handleInputChange("artist", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                    >
                      <option value="">Select an artist</option>
                      {artists.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price breakdown — shows after artist selected */}
                {formData.artist && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Pricing</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Service Price</span>
                      <span className="font-bold text-gray-800">{formatPrice(servicePrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-yellow-200 pt-2">
                      <span className="text-gray-500">Deposit Required (50%)</span>
                      <span className="font-bold text-yellow-500">{formatPrice(depositAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Balance (pay on the day)</span>
                      <span className="text-gray-500">{formatPrice(balanceAmount)}</span>
                    </div>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time — shown after date selected */}
                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleInputChange("time", time)}
                          className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                            formData.time === time
                              ? "border-primary-gold bg-primary-gold text-black font-semibold"
                              : "border-gray-300 hover:border-primary-gold hover:bg-primary-gold/10"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                    >
                      <option value="">Select location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <div className="mt-8">
                <button
                  onClick={handleNext}
                  className="w-full bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-dark-gray mb-4">
                About Lulu — Beauty & Skills
              </h3>
              <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4">
                <Image src={lulu} alt="About Lulu" fill className="object-cover" />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                With over 5 years of experience in the beauty industry, Lulu has mastered the art
                of lash extensions and beauty enhancement. Her passion for perfection ensures
                you'll leave feeling confident and beautiful.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const AppointmentPage = () => (
  <Suspense fallback={<div className="min-h-screen bg-white p-8">Loading booking details...</div>}>
    <AppointmentPageContent />
  </Suspense>
);

export default AppointmentPage;