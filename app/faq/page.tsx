import MapSection from "@/components/common/MapSection";

export default function FAQPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-primary-gray text-white py-12">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary-gold">
						Frequently Asked Questions (FAQ)
					</h1>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-6 py-16">
				{/* General Information */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">General Information</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Where are you located?</h3>
							<p className="text-gray-600">
							 We are based in Calabar, Nigeria. All orders are shipped from our studio
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Do you ship nationwide?</h3>
							<p className="text-gray-600">
							  Yes, we deliver to all states in Nigeria. 
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">How long does delivery take?</h3>
							<p className="text-gray-600">
							  2–4 business days after processing, depending on your location.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Do you offer same-day delivery?</h3>
							<p className="text-gray-600">
							   Yes, within Calabar for orders placed before 12 PM.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Can I pick up my order?</h3>
							<p className="text-gray-600">
							   Yes, choose “Pickup” at checkout and we’ll notify you when it’s ready.
							</p>
						</div>
					</div>
				</section>

				{/* Payment */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Payment</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">What payment methods do you accept?</h3>
							<p className="text-gray-600">
							   Bank transfers, debit/credit cards, and Paystack.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Do you offer payment on delivery?</h3>
							<p className="text-gray-600">
							   No, all orders must be prepaid to confirm processing.
							</p>
						</div>
					</div>
				</section>

				{/* Product Info */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Product Information</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">What’s the difference between Easy Fan and Classic lashes?</h3>
							<p className="text-gray-600">
							 Easy Fans (0.07) bloom into fans for volume sets; Classic (0.15) are for single-strand natural looks.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">What lash curls do you have?</h3>
							<p className="text-gray-600">
							  Easy Fans: J, B, L, C, Cc, D, Dd, M <br />
							  Classic: C, Cc, D
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">What lash lengths are available?</h3>
							<p className="text-gray-600">
							Single trays: 8mm–25mm <br />
							Mixed trays: 8–14mm, 14–20mm, 20–25mm <br />
							Bottom lashes: 5–10mm
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">How long does your lash glue last?</h3>
							<p className="text-gray-600">
							  4–6 weeks retention. Available in 5ml and 10ml.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Are your products safe?</h3>
							<p className="text-gray-600">
							   Yes, all products are tested and safe for professional use.
							</p>
						</div>
					</div>
				</section>

				{/* Training */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Training</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Do you offer lash or brow training?</h3>
							<p className="text-gray-600">
							 Yes! We offer both online and in-person classes.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Will I receive a certificate after training?</h3>
							<p className="text-gray-600">
								Yes, upon successful completion of our training courses, you will receive a certificate of completion that you can use to showcase your skills.
							</p>
						</div>
					</div>
				</section>

				{/* Returns & Support */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Returns & Support</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">Can I return or exchange a product?</h3>
							<p className="text-gray-600">
							All sales are final. If you receive a damaged or wrong item, contact us within 24 hours.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2 text-gray-700">What if my order is missing an item?</h3>
							<p className="text-gray-600">
							   Message us via WhatsApp or email within 24 hours and we’ll resolve it quickly.
							</p>
						</div>
					</div>
				</section>

				{/* Still Have Questions */}
				<section className="mb-12 bg-gray-50 p-8 rounded-lg">
					<h2 className="text-2xl font-bold mb-4 text-gray-800">Still Have Questions?</h2>
					<p className="text-gray-600 mb-4">
						If you couldn't find the answer you're looking for, feel free to reach out to us. We're here to help!
					</p>
					<p className="text-gray-700">
						Email us at: <a href="mailto:hello@luluartistry.com" className="text-primary-gold hover:underline"> hello@luluartistry.com</a>
					</p>
				</section>

				{/* Newsletter */}
				<section className="mb-12 bg-[#fff9ef] p-8 rounded-lg">
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

			{/* Map Section */}
			<MapSection />
		</div>
	);
}

