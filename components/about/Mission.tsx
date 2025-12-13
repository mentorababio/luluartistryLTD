const Mission = () => {
	return (
		<div className='flex flex-col gap-12 mt-10 px-6 md:px-20 mb-10 max-w-4xl mx-auto'>
			{/* Mission Section */}
			<div>
				<h2 className='text-2xl md:text-3xl font-bold mb-4 text-center'>
					Our Mission
				</h2>
				<p className='text-gray-700 leading-relaxed'>
					To empower beauty professionals and clients with
					high-quality, trusted lash and brow products—while creating
					a space for learning, luxury, and self-expression.
				</p>
			</div>

			{/* What We Offer */}
			<div>
				<h2 className='text-2xl md:text-3xl font-bold mb-4 text-center'>
					What We Offer
				</h2>
				<ul className='list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
					<li>
						<strong>Premium Lash & Brow Products</strong> – Tested by
						professionals, for professionals.
					</li>
					<li>
						<strong>In-Studio & Online Training</strong> – Learn the
						craft with expert guidance and earn your certificate.
					</li>
					<li>
						<strong>Nationwide & Worldwide Delivery</strong> – From
						Calabar to anywhere you are.
					</li>
					<li>
						<strong>A Beauty Community That Cares</strong> – You&apos;re
						not just a customer, you&apos;re family.
					</li>
				</ul>
			</div>

			{/* Our Values */}
			<div>
				<h2 className='text-2xl md:text-3xl font-bold mb-4 text-center'>
					Our Values
				</h2>
				<ul className='list-disc list-inside space-y-2 text-gray-700 leading-relaxed'>
					<li>Quality-first, always.</li>
					<li>Created by an artist, for artists.</li>
					<li>Tested and safe for professional use.</li>
					<li>Fast nationwide & global shipping.</li>
					<li>Learn with us — grow with us.</li>
				</ul>
			</div>
		</div>
	);
};
export default Mission;
