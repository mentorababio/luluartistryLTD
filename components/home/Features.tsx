import { payment, pack, returns, ship } from "@/assets";
import Image from "next/image";

const Features = () => {
	const items = [
		{
			title: "Very Fast Shipping",
			image: ship,
			desc: "Delivery across Nationwide",
		},
		{
			title: "Secure Payments",
			image: payment,
			desc: "Pay safely via Paystack & major cards",
		},
		{
			title: "Hassle-Free Returns",
			image: returns,
			desc: "Return or exchange with ease",
		},
		{
			title: "Gift-Ready Packaging",
			image: pack,
			desc: "Beautifully wrapped for any occasion",
		},
	];

	return (
		<div className="mt-8 p-6 sm:p-8">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
				{items.map((item, i) => (
					<div
						key={i}
						className="flex flex-col gap-3 items-center text-gray-700"
					>
						<Image
							className="object-contain w-12 h-12"
							src={item.image}
							alt={item.title}
						/>
						<h1 className="font-semibold text-base sm:text-lg">{item.title}</h1>
						<p className="text-sm sm:text-base">{item.desc}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Features;
