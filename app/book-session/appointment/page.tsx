"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { lulu } from "@/assets";
import toast from "react-hot-toast";

const BASE_URL = "https://luluartistry-backend.onrender.com/api";

interface ServicePricing {
  artistType: string;
  price: number;
}

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  pricing: ServicePricing[];
}

const ARTIST_LABELS: Record<string, string> = {
  lulu:   "Lulu (Lead Artist)",
  senior: "Senior Artist",
  artist: "Artist",
};

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export interface BookingDraft {
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  serviceDuration: number;
  artistType: string;
  artistName: string;
  location: string;
  appointmentDate: string;
  timeSlot: string;
  timeSlotEnd: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  servicePrice: number;
  depositAmount: number;
  balanceAmount: number;
  paymentMethod?: "transfer" | "card";
  selectedBank?: string;
}

const DRAFT_KEY = "bookingDraft";

function AppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedServiceId = searchParams.get("serviceId");

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    serviceId:       preselectedServiceId || "",
    artistType:      "",
    location:        "",
    appointmentDate: "",
    timeSlot:        "",
    firstName:       "",
    lastName:        "",
    email:           "",
    phone:           "",
    notes:           "",
  });

  // Fetch services
  useEffect(() => {
    fetch(`${BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        const list: Service[] = data?.data || [];
        const filtered = list.filter(s => s.category !== "training");
        setServices(filtered);

        if (preselectedServiceId) {
          const found = filtered.find(s => s._id === preselectedServiceId);
          if (found) {
            setSelectedService(found);
            setFormData(p => ({ ...p, serviceId: found._id }));
          }
        }
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));
  }, [preselectedServiceId]);

  // Auto-fill logged-in user's info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const u = data?.data;
        if (!u) return;
        setFormData(p => ({
          ...p,
          firstName: u.firstName || p.firstName,
          lastName:  u.lastName  || p.lastName,
          email:     u.email     || p.email,
          phone:     u.phone     || p.phone,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (formData.serviceId && services.length > 0) {
      const found = services.find(s => s._id === formData.serviceId);
      setSelectedService(found || null);
      setFormData(p => ({ ...p, artistType: "" }));
    } else if (!formData.serviceId) {
      setSelectedService(null);
    }
  }, [formData.serviceId, services]);

  const getPrice = () => {
    if (!selectedService || !formData.artistType) return 0;
    const pricing = selectedService.pricing.find(p => p.artistType === formData.artistType);
    return pricing?.price || 0;
  };

  const getDepositAmount = () => Math.ceil(getPrice() * 0.5);
  const getBalanceAmount = () => getPrice() - getDepositAmount();

  const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} minutes`;
    if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
    return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
  };

  const getEndTime = (startTime: string, durationMins: number) => {
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + durationMins;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.artistType || !formData.location ||
        !formData.appointmentDate || !formData.timeSlot ||
        !formData.firstName || !formData.lastName ||
        !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = getPrice();
    if (!price) {
      toast.error("Could not determine service price");
      return;
    }

    setSubmitting(true);

    const draft: BookingDraft = {
      serviceId:           formData.serviceId,
      serviceName:         selectedService?.name || "",
      serviceDescription:  selectedService?.description || "",
      serviceDuration:     selectedService?.duration || 60,
      artistType:          formData.artistType,
      artistName:          ARTIST_LABELS[formData.artistType] || formData.artistType,
      location:            formData.location,
      appointmentDate:     formData.appointmentDate,
      timeSlot:            formData.timeSlot,
      timeSlotEnd:         getEndTime(formData.timeSlot, selectedService?.duration || 60),
      firstName:           formData.firstName,
      lastName:            formData.lastName,
      email:               formData.email,
      phone:               formData.phone,
      notes:               formData.notes,
      servicePrice:        price,
      depositAmount:       getDepositAmount(),
      balanceAmount:       getBalanceAmount(),
    };

    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    router.push("/book-session/payment");
  };

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Book Your Appointment</h1>
          <p className="text-gray-500">Fill in the details below to schedule your session</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
                Appointment Details
              </h2>

              {/* Service — name only, no duration in the label */}
              <div>
                <label className={labelClass}>Service *</label>
                {loadingServices ? (
                  <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-400 bg-white">
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    Loading services...
                  </div>
                ) : (
                  <select value={formData.serviceId}
                    onChange={e => setFormData(p => ({ ...p, serviceId: e.target.value }))}
                    className={inputClass}>
                    <option value="">Select a service</option>
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Duration — its own read-only box */}
              {selectedService && (
                <div>
                  <label className={labelClass}>Duration</label>
                  <input type="text" readOnly
                    value={formatDuration(selectedService.duration)}
                    className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
                </div>
              )}

              {/* Artist — native dropdown, options only show on click */}
              {selectedService && selectedService.pricing?.length > 0 && (
                <div>
                  <label className={labelClass}>Artist *</label>
                  <select value={formData.artistType}
                    onChange={e => setFormData(p => ({ ...p, artistType: e.target.value }))}
                    className={inputClass}>
                    <option value="">Select artist</option>
                    {selectedService.pricing.map(p => (
                      <option key={p.artistType} value={p.artistType}>
                        {ARTIST_LABELS[p.artistType] || p.artistType} — {formatPrice(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {getPrice() > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm space-y-2">
                  <p className="font-semibold text-gray-700 mb-2">Pricing Summary</p>
                  <div className="flex justify-between text-gray-600">
                    <span>Service Price</span>
                    <span className="font-semibold">{formatPrice(getPrice())}</span>
                  </div>
                  <div className="flex justify-between text-yellow-700 font-bold border-t border-yellow-200 pt-2">
                    <span>Deposit Required (50%)</span>
                    <span>{formatPrice(getDepositAmount())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Balance (pay on the day)</span>
                    <span>{formatPrice(getBalanceAmount())}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date *</label>
                  <input type="date" value={formData.appointmentDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Time *</label>
                  <select value={formData.timeSlot}
                    onChange={e => setFormData(p => ({ ...p, timeSlot: e.target.value }))}
                    className={inputClass}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Location *</label>
                <select value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  className={inputClass}>
                  <option value="">Select location</option>
                  <option value="calabar">Calabar Studio</option>
                  <option value="home service">Home Service</option>
                </select>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-base font-bold text-gray-800 mb-4">Your Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input type="text" value={formData.firstName} placeholder="First name"
                      onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input type="text" value={formData.lastName} placeholder="Last name"
                      onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                      className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={formData.email} placeholder="your@email.com"
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" value={formData.phone} placeholder="08012345678"
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Special Requests (optional)</label>
                <textarea value={formData.notes} rows={3}
                  placeholder="Any special requests or notes..."
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className={`${inputClass} resize-none`} />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Continuing...
                  </>
                ) : "Continue to Payment"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                By booking, you agree to our booking policy. A 50% deposit is required to confirm your appointment.
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">About Lulu</h3>
              <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                <Image src={lulu} alt="Lulu" fill className="object-cover" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                With over 5 years of experience in the beauty industry, Lulu has mastered
                the art of lash extensions and beauty enhancement. Her passion for perfection
                ensures you'll leave feeling confident and beautiful.
              </p>
            </div>

            <div className="bg-yellow-500 rounded-2xl p-6 text-black">
              <h3 className="text-lg font-bold mb-4">Lulu's Beauty Studio</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span>Shop A51, Calabar Municipal Plaza Marian, Calabar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>07031002094</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span>lulusartistry321@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="flex-shrink-0" />
                  <div>
                    <p>Mon–Fri: 9 AM – 6 PM</p>
                    <p>Sat: 10 AM – 4 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-bold text-gray-800 mb-3">Booking Policy</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">•</span>
                  Appointments require 24-hour advance booking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">•</span>
                  Cancellations must be made at least 48 hours in advance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">•</span>
                  50% deposit required to confirm booking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">•</span>
                  Balance is paid on the day of the appointment
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AppointmentContent />
    </Suspense>
  );
}