"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Calendar, Clock, MapPin, User, CheckCircle, Shield } from "lucide-react";
import toast from "react-hot-toast";

const PaymentPageContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [bookingData, setBookingData] = useState({
		service: "",
		artist: "",
		date: "",
		time: "",
		location: ""
	});

	const [paymentData, setPaymentData] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: "",
		paymentMethod: "card"
	});

	useEffect(() => {
		const service = searchParams.get("service");
		const artist = searchParams.get("artist");
		const date = searchParams.get("date");
		const time = searchParams.get("time");
		const location = searchParams.get("location");

		if (service && artist && date && time && location) {
			setBookingData({
				service: service,
				artist: artist,
				date: date,
				time: time,
				location: location
			});
		}
	}, [searchParams]);

	const getServicePrice = (service: string) => {
		// Map service IDs from book-session/page.tsx to prices
		const prices: { [key: string]: number } = {
			"Ombré Powder Brows": 700000,
			"Signature Combo Brows": 80000,
			"Microshading": 70000,
			"Brow Lamination & Tint": 40000,
			"Brow Touch-up (All Types)": 60000,
			"Classic Set": 20000,
			"Hybrid Set": 25000,
			"Volume Set": 1200000,
			" MegaVolume Set": 40000,
			" Bottom Lashes": 10000,
			" Wispy Add-On": 8000,
			" The Aleks Set": 50000,
			" Dolly Set": 66000,
			" Flirty Fox Eye": 40000,
			" The Eb Luxe Set": 40000,
			" Private Brow Training": 400000,
			"Group Brow Training": 300000,
			" Private Lash Training": 300000,
			" Group Lash Training": 200000,
			" Private Combo Lash + Brow Training": 650000,
			" Group Combo Lash + Brow Training": 450000,
			"Private Brow Lamination & Tint Training": 150000
		};
		return prices[service] || 25000;
	};

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	const price = getServicePrice(bookingData.service);

	const handlePaymentMethodChange = (method: string) => {
		setPaymentData(prev => ({ ...prev, paymentMethod: method }));
	};

	const handleInputChange = (field: string, value: string) => {
		setPaymentData(prev => ({ ...prev, [field]: value }));
	};

	const handlePayNow = () => {
		// Validate payment form
		if (paymentData.paymentMethod === "card") {
			if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
				toast.error("Please fill in all payment details");
				return;
			}
		}

		// Navigate to confirmation page
		const params = new URLSearchParams({
			...bookingData,
			price: price.toString(),
			paymentMethod: paymentData.paymentMethod
		});
		
		router.push(`/book-session/confirm?${params.toString()}`);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
					<div className="flex items-center gap-4 mb-4">
						<Link 
							href="/book-session/appointment"
							className="flex items-center gap-2 text-primary-gold hover:text-yellow-500"
						>
							<ArrowLeft size={20} />
							<span>Back</span>
						</Link>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-2">
						Book a Session - Lulu's Artistry
					</h1>
					<p className="text-lg text-gray-600">
						Elevate your beauty. Book your luxury lash, brow, or training session with ease.
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
					{/* Payment Form */}
					<div className="max-w-2xl mx-auto">
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold text-dark-gray mb-2">Payment Options</h2>
							<p className="text-gray-600 mb-6">Choose how you'd like to pay for your appointment.</p>
							
							{/* Payment Summary */}
							<div className="bg-gray-50 rounded-lg p-6 mb-8">
								<h3 className="font-semibold text-lg mb-4">Payment Summary</h3>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal:</span>
										<span className="font-medium">{formatPrice(price)}</span>
									</div>
									<div className="flex justify-between border-t border-gray-300 pt-3">
										<span className="font-semibold">Total:</span>
										<span className="font-bold text-lg text-primary-gold">{formatPrice(price)}</span>
									</div>
								</div>
							</div>

							{/* Payment Methods */}
							<div className="space-y-6">
								{/* Paystack/Flutterwave Card Payment */}
								<div className={`border-2 rounded-lg p-6 transition-all ${
									paymentData.paymentMethod === "card" 
										? "border-primary-gold bg-yellow-50/30" 
										: "border-gray-200"
								}`}>
									<div className="flex items-center gap-3 mb-4">
										<input
											type="radio"
											id="card"
											name="paymentMethod"
											value="card"
											checked={paymentData.paymentMethod === "card"}
											onChange={(e) => handlePaymentMethodChange(e.target.value)}
											className="text-primary-gold focus:ring-primary-gold w-5 h-5"
										/>
										<CreditCard className="text-gray-600" size={20} />
										<label htmlFor="card" className="font-semibold text-gray-800">
											Paystack/Flutterwave (Debit/Credit Card)
										</label>
									</div>
									
									{paymentData.paymentMethod === "card" && (
										<div className="space-y-4 mt-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Card Number
												</label>
												<input
													type="text"
													value={paymentData.cardNumber}
													onChange={(e) => handleInputChange("cardNumber", e.target.value)}
													placeholder="0000 0000 0000 0000"
													maxLength={19}
													className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														Expiry Date
													</label>
													<input
														type="text"
														value={paymentData.expiryDate}
														onChange={(e) => handleInputChange("expiryDate", e.target.value)}
														placeholder="MM/YY"
														maxLength={5}
														className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">
														CVV
													</label>
													<input
														type="text"
														value={paymentData.cvv}
														onChange={(e) => handleInputChange("cvv", e.target.value)}
														placeholder="000"
														maxLength={4}
														className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">
													Cardholder Name
												</label>
												<input
													type="text"
													value={paymentData.cardholderName}
													onChange={(e) => handleInputChange("cardholderName", e.target.value)}
													placeholder="Enter name as it appears on card"
													className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
												/>
											</div>
										</div>
									)}
								</div>

								{/* Bank Transfer */}
								<div className={`border-2 rounded-lg p-6 transition-all ${
									paymentData.paymentMethod === "transfer" 
										? "border-primary-gold bg-yellow-50/30" 
										: "border-gray-200"
								}`}>
									<div className="flex items-center gap-3">
										<input
											type="radio"
											id="transfer"
											name="paymentMethod"
											value="transfer"
											checked={paymentData.paymentMethod === "transfer"}
											onChange={(e) => handlePaymentMethodChange(e.target.value)}
											className="text-primary-gold focus:ring-primary-gold w-5 h-5"
										/>
										<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
											<span className="text-white font-bold text-sm">₦</span>
										</div>
										<label htmlFor="transfer" className="font-semibold text-gray-800">
											Bank Transfer
										</label>
										{paymentData.paymentMethod === "transfer" && (
											<p className="text-sm text-gray-600 ml-11 mt-2">
												Direct bank transfer
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Security Indicators */}
							<div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<CheckCircle className="text-green-500" size={16} />
									<span>SSL Secure</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Shield className="text-green-500" size={16} />
									<span>Verify by Paystack</span>
								</div>
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Shield className="text-green-500" size={16} />
									<span>Privacy Protected</span>
								</div>
							</div>

							{/* Navigation Buttons */}
							<div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
								<Link
									href={`/book-session/appointment?service=${encodeURIComponent(bookingData.service)}`}
									className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg transition-colors text-center"
								>
									← Back
								</Link>
								<button
									onClick={handlePayNow}
									className="flex-1 bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
								>
									Continue to Confirm
								</button>
							</div>
						</div>
					</div>

					{/* Important Notes & Policies Section */}
					<div className="max-w-4xl mx-auto px-6 sm:px-8 mt-12">
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold text-dark-gray mb-2">Important Notes & Policies</h2>
							<p className="text-gray-600 mb-8">Please review our policies to ensure a smooth experience</p>
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">Cancellation Policy</h3>
									<p className="text-gray-600 text-sm">
										Please cancel or reschedule at least 24 hours in advance to avoid cancellation fees.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">No-Show Policy</h3>
									<p className="text-gray-600 text-sm">
										No-shows may result in loss of deposit and may affect future booking privileges.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">Late Arrival Policy</h3>
									<p className="text-gray-600 text-sm">
										Late arrivals of 15+ minutes may result in reduced service time to accommodate other clients.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">Payment Terms</h3>
									<p className="text-gray-600 text-sm">
										Full payment or deposit required to secure your appointment. Refunds subject to cancellation policy.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">Health & Safety</h3>
									<p className="text-gray-600 text-sm">
										Please inform us of any allergies or medical conditions. We maintain strict hygiene standards.
									</p>
								</div>
								<div>
									<h3 className="font-semibold text-lg text-dark-gray mb-2">Contact Us</h3>
									<p className="text-gray-600 text-sm">
										Need to reschedule? Contact us at +234 XXX XXX XXXX or email info@lulusartistry.com
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Newsletter Signup Section */}
					<div className="max-w-4xl mx-auto px-6 sm:px-8 mt-12">
						<div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold text-dark-gray mb-2">Glow in Your Inbox</h2>
							<p className="text-gray-600 mb-6">
								Be the first to hear about new arrivals, exclusive deals, and beauty tips made just for you.
							</p>
							
							<form 
								onSubmit={(e) => {
									e.preventDefault();
									const form = e.target as HTMLFormElement;
									const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
									if (emailInput?.value) {
										toast.success("Thank you for subscribing!");
										emailInput.value = "";
									}
								}}
								className="flex flex-col sm:flex-row gap-4"
							>
								<input
									type="email"
									placeholder="Your Email address"
									required
									className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
								/>
								<button
									type="submit"
									className="bg-primary-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
								>
									Subscribe & Stay Beautiful
								</button>
							</form>
							
							<p className="text-xs text-gray-500 mt-4">
								By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
							</p>
						</div>
					</div>
			</div>
		</div>
	);
};

const PaymentPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-white p-8">Loading payment options...</div>}>
			<PaymentPageContent />
		</Suspense>
	);
};

export default PaymentPage;
