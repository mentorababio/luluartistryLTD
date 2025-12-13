export default function ReturnsPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-primary-gray text-white py-12">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary-gold">
						Return & Refund Policy
					</h1>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-4xl mx-auto px-6 py-16">
				<div className="prose prose-lg max-w-none">
					<section className="mb-8">
						<h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Returns & Refund</h2>
						<p className="text-gray-600 mb-4">
						Due to the hygienic nature of our beauty products, we do not accept returns or exchanges once items have been opened or used.
						</p>
						<p className="text-gray-600 mb-4">
						If your item arrives damaged or incorrect, please contact us within 48 hours of delivery for a quick resolution.
						</p>
						<p className="text-gray-600 mb-4">contact us Anytime
						 <br/><a href="mailto:hello@luluartistry.com" className="text-primary-gold hover:underline">hello@luluartistry.com</a> </p>
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

