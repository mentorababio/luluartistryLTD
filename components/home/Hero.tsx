"use client";

import { hero } from "@/assets";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
	return (
		<div className='relative w-full h-[500px] md:h-[700px] overflow-hidden'>
			{/* Background Image */}
			<Image
				src={hero}
				fill
				priority
				className='object-cover'
				quality={90}
				alt='Hero Image'
			/>

			{/* Dark Overlay */}
			<div className='absolute inset-0 bg-black/40 z-10' />

			{/* Content */}
			<div className='relative z-20 flex  items-center justify-start h-full p-8'>
				<div className='flex flex-col gap-8 text-white max-w-5xl md:px-20'>
					<h1 className='text-4xl md:text-6xl font-extrabold leading-tight'>
						Lash Like A Pro
					</h1>
					<p className='text-lg md:text-xl font-medium leading-relaxed max-w-[500px] text-gray-200'>
						Premium lash trays, glue, and tools made for artists who
						care about quality. Crafted by Lulu's Artistry, trusted by
						beauty pros across Nigeria.
					</p>
					<Link 
						href="/shop"
						className='bg-primary-gold hover:bg-yellow-600 cursor-pointer py-3 px-8 rounded-2xl text-center font-semibold transition-colors inline-block w-full'
					>
						SHOP NOW
					</Link>
					
					<div className='flex items-center gap-4'>
					<p className="leading-tight">Need a personal touch?</p>
						<Link 
							href="/book-session"
							className='bg-inherit border border-primary-gold text-primary-gold py-2 px-6 rounded-xl hover:bg-primary-gold hover:text-black transition-colors font-semibold'
						>
							Book Session
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Hero;
