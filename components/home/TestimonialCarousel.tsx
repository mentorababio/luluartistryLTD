"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import Igone from "@/assets/images/IG1.png";
import Igtwo from "@/assets/images/IG2.png";
import Igthree from "@/assets/images/IG3.png";
import Igfour from "@/assets/images/IG4.png";
import TestimonialOne from "@/assets/images/testimony1.png";
import TestimonialTwo from "@/assets/images/testimony2.png";
import TestimonialThree from "@/assets/images/testimony3.png";
import TestimonialFour from "@/assets/images/testimony4.png";
import TestimonialFive from "@/assets/images/testimony5.png";
import TestimonialSix from "@/assets/images/testimony6.png";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
  rating: number;
}

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "The lash extensions I purchased are absolutely amazing! They look so natural and the adhesive holds all day. I've received so many compliments from my clients.",
      author: "Emma Richardson",
      title: "Lash Technician",
      rating: 5,
    },
    {
      id: 2,
      quote: "Lulu Artistry has transformed my beauty routine! Their products are top-notch, and the service is exceptional. Highly recommend!",
      author: "Imma Richardson",
      title: "Beauty Enthusiast",
      rating: 5,
    },
    {
      id: 3,
      quote: "The training I received was incredible! Professional, hands-on, and comprehensive. I'm now confident in my lash application skills.",
      author: "Sarah Johnson",
      title: "Professional Lash Artist",
      rating: 5,
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="bg-[#fff4ea] py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
          What Our Beauties Are Saying
        </h2>

        {/* Background Image Collage with Testimonial Box */}
        <div className="relative rounded-xl overflow-hidden min-h-[500px] flex items-center justify-center">
          {/* Background Image Collage */}
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-4 opacity-50">
            <div className="relative aspect-square">
              <Image src={TestimonialOne} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={TestimonialTwo} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={TestimonialThree} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={TestimonialFour} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={TestimonialFive} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={TestimonialSix} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            {/* <div className="relative aspect-square">
              <Image src={} alt="Testimonial" fill className="object-cover rounded" />
            </div>
            <div className="relative aspect-square">
              <Image src={} alt="Testimonial" fill className="object-cover rounded" />
            </div>'
            
            <div className="relative aspect-square">
              <Image src={} alt="Testimonial" fill className="object-cover rounded" />
            </div> */}
          </div>

          {/* Central Testimonial Box */}
          <div className="relative z-10 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            {/* Rating Stars */}
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.floor(currentTestimonial.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-gray-700 italic text-lg mb-4 text-center">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="text-center mb-2">
              <span className="font-semibold text-gray-800 block">
                {currentTestimonial.author}
              </span>
              <p className="text-gray-600 text-sm">{currentTestimonial.title}</p>
            </div>

            {/* Carousel Navigation Dots */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;

