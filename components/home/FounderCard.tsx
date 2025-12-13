import { lulu } from "@/assets";
import Image from "next/image";
import Link from "next/link";

const FounderCard = () => {
	return (
		<div className='mt-8 mb-6 px-4 flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 text-center lg:text-left'>
			{/* Founder Image */}
			<Image
				className='rounded-tl-[60px] rounded-br-[60px] w-[220px] h-[280px] sm:w-[250px] sm:h-[300px] object-cover'
				src={lulu}
				alt='Lulu Artistry'
			/>

			{/* Text Content */}
			<div className='flex flex-col gap-4 max-w-2xl'>
				<p className='text-gray-700 text-sm sm:text-base leading-relaxed'>
					"At Lulu Artistry, beauty is more than appearance — it's
					self-expression, confidence, and celebration. We craft every
					lash, nail, brow, and tattoo detail to empower bold women
					with elegance, identity, and intention."
				</p>
				<Link 
					href="/about"
					className='text-primary-gold font-semibold cursor-pointer hover:underline w-fit'
				>
					LEARN MORE
				</Link>
				<p className='text-gray-500 text-sm sm:text-base italic'>
					— Lulu, Founder of Lulu Artistry
				</p>
			</div>
		</div>
	);
};

export default FounderCard;
