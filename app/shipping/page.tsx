export default function ShippingPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-primary-gray text-white py-12">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary-gold">
						Shipping Information Policy
					</h1>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-6 py-16">
				<div className="prose prose-lg max-w-none">
					{/* Shipping Information */}
					<section className="mb-12">
						<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Shipping Information</h2>
						
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 text-gray-700">processing Time:</h3>
							<p className="text-gray-600 mb-4">
							  All orders are processed within 1–2 business days after payment is confirmed.
							</p>
						</div>

						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 text-gray-700">Within Nigeria:</h3>
							<p className="text-gray-600 mb-4">
							 Delivery takes 2–5 business days via trusted couriers like GIG, DHL, or dispatch riders.
							</p>
						</div>
						
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 text-gray-700">International Shipping:</h3>
							<p className="text-gray-600 mb-4">
							 We deliver to the UK, USA, Canada, South Africa, Zimbabwe, and more. <br /> Shipping time is typically 7–14 business days, depending on location.
							</p>
						</div>

						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 text-gray-700">Order Tracking:</h3>
							<p className="text-gray-600 mb-4">
							   You'll receive a tracking number via email once your order is dispatched.
							</p>
						</div>
						<div className="mb-6">
							<h3 className="text-lg font-semibold mb-3 text-gray-700">Note for International Orders:</h3>
							<p className="text-gray-600 mb-4">
							Customs duties or import taxes are not included and must be paid by the buyer.
							</p>
						</div>
					</section>

					{/* Terms & Conditions */}
					<section className="mb-12">
						<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Terms & Conditions</h2>
						
						<div className="mb-6">
							<p className="text-gray-600 mb-4">
								By using our website and placing an order with Lulu’s Artistry, you agree to the following:
							</p>
						</div>

						<div className="mb-6">
							<ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
								<li>All content (images, text, etc.) is owned by Lulu’s Artistry.</li>
								<li>You may not copy or reproduce any part of the site without our permission.</li>
								<li>Service bookings and product orders are subject to our stated policies.</li>
							</ul>
						</div>
					</section>

					{/* Newsletter */}
					<section className="mt-12 bg-[#fff9ef] p-8 rounded-lg">
						<h2 className="text-2xl md:text-3xl font-bold mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
							Glow In Your Inbox
						</h2>
						<p className="text-gray-600 text-center mb-6">
							Be the first to hear about new arrivals, exclusive deals, and beauty tips made just for you.
						</p>
						<form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
							<input
								type="email"
								placeholder="Your Email address"
								className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-primary-gold focus:border-transparent"
							/>
							<button
								type="submit"
								className="bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors whitespace-nowrap"
							>
								Subscribe & Stay Beautiful
							</button>
						</form>
					</section>
				</div>
			</div>
		</div>
	);
}

