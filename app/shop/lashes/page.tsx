"use client";

import Image from "next/image";
import ProductGrid from "@/components/shop/ProductGrid";
import MapSection from "@/components/common/MapSection";
import Curated from "@/components/home/Curated";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";

const LashesPage = () => {
  return (
    <>
      <ProductGrid category="lashes" title="Lashes" />
      <Curated />
      
      {/* ===================== TESTIMONIALS ===================== */}
      <TestimonialCarousel />

      {/* ===================== INSTAGRAM ===================== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Follow Us on Instagram</h2>
            <p className="text-gray-600">@luluartistry.ng</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Image
              src={Igone}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
            <Image
              src={Igtwo}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
            <Image
              src={Igthree}
              alt="Instagram Post"
              width={300}
              height={300}
              className="rounded-xl object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className="bg-[#fff9ef] py-16">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Glow in Your Inbox
          </h2>
          <p className="text-gray-600 mb-6">
            Sign up for exclusive offers, original stories, events and more.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-4">
            <input
              type="email"
              placeholder="Your email, please"
              className="border border-gray-300 rounded-lg px-4 py-3 w-full sm:w-2/3 focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <MapSection />
    </>
  );
};

export default LashesPage;

