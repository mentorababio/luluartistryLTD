"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, GraduationCap, Calendar, MapPin, Phone, Mail, Clock } from "lucide-react";
import { lulu } from "@/assets";

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
  image?: { url?: string };
}

const ARTIST_LABELS: Record<string, string> = {
  lulu:   "Lulu (Lead Artist)",
  senior: "Senior Artist",
  artist: "Artist",
};

const CATEGORY_LABELS: Record<string, string> = {
  lashes:    "Lashes",
  brows:     "Brows",
  signature: "Signature",
};

const formatPrice = (p: number) => `₦${p.toLocaleString("en-NG")}`;
const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minutes`;
  if (m === 0) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${h} hour${h > 1 ? "s" : ""} ${m} minutes`;
};

export default function BookSessionPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetch(`${BASE_URL}/services`)
      .then(res => res.json())
      .then(data => {
        setServices((data?.data || []).filter((s: Service) => s.category !== "training"));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["all", "lashes", "brows", "signature"];
  const filteredServices = activeFilter === "all"
    ? services
    : services.filter(s => s.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-[#4a4a4a] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">Book a Session</h1>
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            • Premium Brows & Lashes Services • Expert Artists •
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#services"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-colors">
              View Services
            </a>
            <Link href="/book-session/appointment"
              className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold py-3 px-8 rounded-lg transition-colors">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional beauty treatments designed to enhance your natural beauty
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors capitalize ${
                  activeFilter === cat
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {cat === "all" ? "All" : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No services available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map(service => (
                <div key={service._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-yellow-50">
                    {service.image?.url ? (
                      <img src={service.image.url} alt={service.name}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">✂️</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold capitalize">
                        {CATEGORY_LABELS[service.category] || service.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.description}</p>
                    <p className="text-xs text-gray-400 mb-4">⏱ {formatDuration(service.duration)}</p>
                    {service.pricing?.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {service.pricing.map(p => (
                          <div key={p.artistType} className="flex justify-between text-xs text-gray-500">
                            <span>{ARTIST_LABELS[p.artistType] || p.artistType}</span>
                            <span className="font-semibold text-gray-700">{formatPrice(p.price)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-xs text-gray-400">Starting from</p>
                        <span className="text-xl font-bold text-yellow-500">
                          {formatPrice(Math.min(...(service.pricing?.map(p => p.price) || [0])))}
                        </span>
                      </div>
                      <Link href={`/book-session/appointment?serviceId=${service._id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">About Lulu's Beauty Studio</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Lulu's Beauty Studio, we are dedicated to providing exceptional beauty services.
                Available in Calabar and home services — book your session at the location most convenient for you.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Star, label: "Premium Quality" },
                  { icon: GraduationCap, label: "Expert Artists" },
                  { icon: Calendar, label: "Flexible Schedule" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Icon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image src={lulu} alt="Lulu's Beauty Studio" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Calabar Studio", "Home Services"].map(city => (
              <div key={city} className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-left">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="text-yellow-500" /> {city}
                </h4>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><Phone size={13} /> +234 703 100 2094</p>
                  <p className="flex items-center gap-2"><Mail size={13} /> lulusartistry321@gmail.com</p>
                  <p className="flex items-center gap-2"><Clock size={13} /> Mon–Sat: 8AM – 6PM</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}