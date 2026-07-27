"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

export default function BookingForm() {
  const searchParams = useSearchParams();
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

  // Fetch real services from backend (no training)
  useEffect(() => {
    fetch(`${BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        const list: Service[] = data?.data || [];
        // Exclude training category
        const filtered = list.filter(s => s.category !== "training");
        setServices(filtered);

        // Pre-select if serviceId is in URL
        if (preselectedServiceId) {
          const found = filtered.find(s => s._id === preselectedServiceId);
          if (found) setSelectedService(found);
        }
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));
  }, [preselectedServiceId]);

  // Update selectedService when serviceId changes
  useEffect(() => {
    if (formData.serviceId) {
      const found = services.find(s => s._id === formData.serviceId);
      setSelectedService(found || null);
      setFormData(prev => ({ ...prev, artistType: "" })); // reset artist on service change
    } else {
      setSelectedService(null);
    }
  }, [formData.serviceId, services]);

  const getPrice = () => {
    if (!selectedService || !formData.artistType) return null;
    const pricing = selectedService.pricing.find(p => p.artistType === formData.artistType);
    return pricing?.price || null;
  };

  const getDepositAmount = () => {
    const price = getPrice();
    return price ? Math.ceil(price * 0.5) : null;
  };

  const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;

  const getEndTime = (startTime: string, durationMins: number) => {
    const [h, m] = startTime.split(":").map(Number);
    const total = h * 60 + m + durationMins;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.serviceId || !formData.artistType || !formData.location ||
        !formData.appointmentDate || !formData.timeSlot ||
        !formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = getPrice();
    const deposit = getDepositAmount();
    if (!price || !deposit) {
      toast.error("Could not determine service price");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const endTime = getEndTime(formData.timeSlot, selectedService?.duration || 60);

      const payload = {
        service: formData.serviceId,
        serviceSnapshot: {
          name: selectedService?.name,
          description: selectedService?.description,
          duration: selectedService?.duration,
        },
        artist: {
          type: formData.artistType,
          name: formData.artistType === "lulu" ? "Lulu" : formData.artistType,
        },
        location: formData.location,
        appointmentDate: formData.appointmentDate,
        timeSlot: {
          start: formData.timeSlot,
          end: endTime,
        },
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        pricing: {
          servicePrice: price,
          depositAmount: deposit,
          balanceAmount: price - deposit,
        },
        notes: {
          customerNotes: formData.notes,
        },
      };

      const res = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Failed to create booking");

      toast.success("Booking created! You'll receive a confirmation shortly.");

      // Reset form
      setFormData({
        serviceId: "", artistType: "", location: "",
        appointmentDate: "", timeSlot: "",
        firstName: "", lastName: "", email: "", phone: "", notes: "",
      });
      setSelectedService(null);

    } catch (err: any) {
      toast.error(err.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Service Select */}
      <div>
        <label className={labelClass}>Service *</label>
        {loadingServices ? (
          <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            Loading services...
          </div>
        ) : (
          <select
            value={formData.serviceId}
            onChange={e => setFormData(p => ({ ...p, serviceId: e.target.value }))}
            className={inputClass}
          >
            <option value="">Select a service</option>
            {services.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Artist Type — only show after service is selected */}
      {selectedService && selectedService.pricing?.length > 0 && (
        <div>
          <label className={labelClass}>Artist *</label>
          <div className="space-y-2">
            {selectedService.pricing.map(p => (
              <label key={p.artistType}
                className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.artistType === p.artistType
                    ? "border-yellow-500 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                <div className="flex items-center gap-3">
                  <input type="radio" name="artistType" value={p.artistType}
                    checked={formData.artistType === p.artistType}
                    onChange={e => setFormData(prev => ({ ...prev, artistType: e.target.value }))}
                    className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">{ARTIST_LABELS[p.artistType] || p.artistType}</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">{formatPrice(p.price)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Summary */}
      {getPrice() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Service Price</span>
            <span className="font-semibold">{formatPrice(getPrice()!)}</span>
          </div>
          <div className="flex justify-between font-bold text-yellow-700 border-t border-yellow-200 pt-2 mt-2">
            <span>Deposit Required (50%)</span>
            <span>{formatPrice(getDepositAmount()!)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Balance paid on the day of appointment</p>
        </div>
      )}

      {/* Location */}
      <div>
        <label className={labelClass}>Location *</label>
        <select value={formData.location}
          onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
          className={inputClass}>
          <option value="">Select location</option>
          <option value="calabar">Calabar</option>
          <option value="port-harcourt">Port Harcourt</option>
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preferred Date *</label>
          <input type="date" value={formData.appointmentDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={e => setFormData(p => ({ ...p, appointmentDate: e.target.value }))}
            className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Preferred Time *</label>
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

      {/* Customer Info */}
      <div className="border-t border-gray-100 pt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Your Information</h3>
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

      {/* Notes */}
      <div>
        <label className={labelClass}>Special Requests (optional)</label>
        <textarea value={formData.notes} rows={3} placeholder="Any special requests or notes..."
          onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
          className={`${inputClass} resize-none`} />
      </div>

      <button type="submit" disabled={submitting}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Booking...
          </>
        ) : "Book Appointment"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By booking, you agree to our booking policy. A 50% deposit is required to confirm your appointment.
      </p>
    </form>
  );
}