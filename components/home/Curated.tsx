import { brows, lash, nails, tatoo } from "@/assets";
import Image from "next/image";
import Link from "next/link";

const Curated = () => {
	const items = [
		{
			title: "Lashes",
			image: lash,
			desc: "Elevate your eyes with natural to dramatic lash styles.",
			link: "/shop/lashes",
		},
		{
			title: "Spa",
			image: nails,
			desc: "Press-on perfection — for glam that's quick and flawless.",
			link: "/shop/spa",
		},
		{
			title: "Tattoos",
			image: tatoo,
			desc: "Long-lasting, stylish body art to express your unique identity.",
			link: "/shop/tattoo",
		},
		{
			title: "Brows",
			image: brows,
			desc: "Shape, define, and perfect your brows with expert tools.",
			link: "/shop/brows",
		},
	];

	return (
		<div className='p-6 sm:p-8 mt-8'>
			{/* Header */}
			<div className='flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6'>
				<h1 className='text-2xl sm:text-3xl font-bold'>
					Curated by Lulu
				</h1>
				<p className='text-gray-600 max-w-lg text-sm sm:text-base leading-relaxed'>
					From delicate enhancements to dazzling details, our products
					are designed to complement your glow every day, every
					occasion, the Lulu way.
				</p>
			</div>

			{/* Grid */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-4'>
				{items.map((item, i) => (
					<div
						key={i}
						className='flex flex-col gap-3 items-start text-gray-800'
					>
						<Image
							src={item.image}
							alt={item.title}
							className='object-cover rounded-lg w-full h-48 sm:h-56 lg:h-64'
						/>
						<h2 className='font-semibold text-lg'>{item.title}</h2>
						<p className='text-sm sm:text-base'>{item.desc}</p>
						<Link 
							href={item.link}
							className='text-sm font-medium text-primary-gold cursor-pointer hover:underline'
						>
							Shop {item.title}
						</Link>
					</div>
				))}
			</div>
		</div>
	);
};

export default Curated;
