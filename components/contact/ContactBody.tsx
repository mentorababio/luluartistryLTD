"use client";

import { useState } from "react";

const ContactBody = () => {
	const [email, setEmail] = useState("");

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle newsletter subscription
		console.log("Subscribed:", email);
		setEmail("");
	};

	return (
		<div className='bg-white py-16'>
			<div className='max-w-6xl mx-auto px-6 space-y-16'>
				{/* General Inquiries & Support */}
				<div>
					<h2 className='text-2xl md:text-3xl font-bold mb-6 text-dark-gray text-center'>
						General Inquiries & Support
					</h2>
					<p className='text-gray-700 mb-8 text-lg leading-relaxed'>
						Have questions about our services, products, bookings, or training sessions? We're always happy to help!
					</p>
					<div className='space-y-6'>
						<div className='flex flex-col md:flex-row md:items-start gap-4'>
							<div className='flex-shrink-0'>
								<span className='font-semibold text-dark-gray'>• WhatsApp:</span>
							</div>
							<div>
								<a
									href='https://wa.me/+234 703 100 2094'
									className='text-primary-gold font-semibold hover:underline'
								>
									+234 703 100 2094
								</a>
								<p className='text-gray-600 mt-1'>
									Get instant responses from our team, whether it's about booking, delivery, or products.
								</p>
							</div>
						</div>
						
						<div className='flex flex-col md:flex-row md:items-start gap-4'>
							<div className='flex-shrink-0'>
								<span className='font-semibold text-dark-gray'>• Instagram DM:</span>
							</div>
							<div>
								<a
									href='https://instagram.com/lulusartistry.ng'
									className='text-primary-gold font-semibold hover:underline'
								>
									@lulusartistry.ng
								</a>
								<p className='text-gray-600 mt-1'>
									Slide into our DMs for inquiries, collaborations, or feedback.
								</p>
							</div>
						</div>
						
						<div className='flex flex-col md:flex-row md:items-start gap-4'>
							<div className='flex-shrink-0'>
								<span className='font-semibold text-dark-gray'>• Email:</span>
							</div>
							<div>
								<a
									href='mailto:lulusartistry7@gmail.com'
									className='text-primary-gold font-semibold hover:underline'
								>
									lulusartistry7@gmail.com
								</a>
								<p className='text-gray-600 mt-1'>
									Reach us via email for order issues, training registrations, or business proposals.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Our Studio */}
				<div>
					<h2 className='text-2xl md:text-3xl font-bold mb-6 text-dark-gray text-center'>
						Our Studio
					</h2>
					<div className='space-y-3 text-gray-700'>
						<p>• We're proudly based in Calabar, Nigeria.</p>
						<p>• All services and product orders are handled from our studio.</p>
						<p>
							• Find us at{" "}
							<a
								href='https://maps.app.goo.gl/yDa5c32xqGrvUms26?g_st=ac'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary-gold font-semibold hover:underline'
							>
								Unogwu Plaza, Marian Road (Lat: 4.9750875, Lon: 8.3406566)
							</a>
						</p>
					</div>
				</div>

				{/* Business Hours */}
				<div>
					<h2 className='text-2xl md:text-3xl font-bold mb-6 text-dark-gray text-center'>
						Business Hours
					</h2>
					<div className='space-y-3 text-gray-700'>
						<p>• Monday - Saturday: 9 AM - 6 PM</p>
						<p>• Sunday: Closed (except special sessions)</p>
					</div>
				</div>

				{/* Newsletter Signup */}
				<div className='text-center'>
					<h2 className='text-2xl md:text-3xl font-bold mb-6 text-dark-gray text-center'>
						Glow in Your Inbox
					</h2>
					<p className='text-gray-700 mb-8 text-lg leading-relaxed'>
						Be the first to hear about new arrivals, exclusive deals, and beauty tips made just for you.
					</p>
					<form onSubmit={handleSubscribe} className='max-w-md mx-auto'>
						<div className='flex flex-col sm:flex-row gap-4'>
							<input
								type='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder='Your Email address'
								className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent'
								required
							/>
							<button
								type='submit'
								className='bg-primary-gold hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap'
							>
								Subscribe & Stay Beautiful!
							</button>
						</div>
						<p className='text-sm text-gray-500 mt-3'>
							By subscribing you agree to continually receive emails and text message updates from Lulu Artistry.
						</p>
					</form>
				</div>

			</div>
		</div>
	);
};
export default ContactBody;
