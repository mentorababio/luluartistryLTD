"use client";

import { aboutLulu } from "@/assets";
import { lulu } from "@/assets";
import Image from "next/image";
import { useState, useEffect } from "react";

const About = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	
	// Array of images for the carousel
	const images = [
		{
			src: aboutLulu,
			alt: "Lulu - Founder of Lulu's Artistry"
		},
		{
			src: lulu, // You'll need to add this second image
			alt: "Lulu working in her studio"
		}
	];

	// Auto-rotate images every 4 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) => 
				prevIndex === images.length - 1 ? 0 : prevIndex + 1
			);
		}, 4000);

		return () => clearInterval(interval);
	}, [images.length]);

	return (
		<div className='flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 px-6 sm:px-10 py-12 max-w-7xl mx-auto'>
			{/* Image Carousel */}
			<div className='relative w-full sm:w-[400px] lg:w-[450px] h-[500px] lg:h-[600px]'>
				{/* Main Image */}
				<div className='relative w-full h-full overflow-hidden rounded-lg'>
					<Image
						src={images[currentImageIndex].src}
						alt={images[currentImageIndex].alt}
						fill
						className='object-cover transition-opacity duration-500'
						priority
					/>
					
					{/* Gradient Overlay for better text readability */}
					<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
				</div>

				{/* Carousel Indicators */}
				<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentImageIndex(index)}
							className={`w-3 h-3 rounded-full transition-all duration-300 ${
								index === currentImageIndex 
									? 'bg-primary-gold scale-110' 
									: 'bg-white/50 hover:bg-white/70'
							}`}
						/>
					))}
				</div>

				{/* Navigation Arrows */}
				<button
					onClick={() => setCurrentImageIndex(
						currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
					)}
					className='absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				
				<button
					onClick={() => setCurrentImageIndex(
						currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
					)}
					className='absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{/* Text Section */}
			<div className='flex flex-col gap-4 text-gray-700 max-w-2xl'>
				<h2 className='text-2xl sm:text-3xl font-bold leading-snug'>
					Hey lovelies — I'm Lulu, the heart behind Lulu's Artistry.
				</h2>

				<p className='leading-relaxed text-sm sm:text-base'>
					When I first began my journey as a lash and brow artist, I
					struggled to find products I could fully trust — products
					that delivered consistent results, felt luxurious, and
					respected the skin and confidence of real women like me.
				</p>

				<p className='leading-relaxed text-sm sm:text-base'>
					That's why I created Lulu's Artistry — not just a beauty
					brand, but a full experience built on intention, quality,
					and empowerment.
				</p>

				<p className='leading-relaxed text-sm sm:text-base'>
					Every lash tray, glue bottle, and tool in our store has been
					handpicked, tested, and trusted by artists like myself. We
					only sell what we proudly use on our clients, students, and
					even ourselves.
				</p>

				<p className='leading-relaxed text-sm sm:text-base'>
					This is more than beauty. It's your glow-up toolbox. Your
					artistry deserves luxury — and that's exactly what we're
					here to deliver.
				</p>

				<p className='mt-4 font-medium text-primary-gold'>
					With love, <br /> Lulu — Founder, Lulu's Artistry
				</p>
			</div>
		</div>
	);
};

export default About;
