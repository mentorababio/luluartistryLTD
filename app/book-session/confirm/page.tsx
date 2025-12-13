"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const ConfirmBookingPageContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [bookingData, setBookingData] = useState({
		service: "",
		artist: "",
		date: "",
		time: "",
		location: "",
		price: "",
		paymentMethod: ""
	});

	const [customerData, setCustomerData] = useState({
		fullName: "",
		email: "",
		phone: "",
		preferredContact: "whatsapp"
	});

	const [agreeToTerms, setAgreeToTerms] = useState(false);

	useEffect(() => {
		const service = searchParams.get("service");
		const artist = searchParams.get("artist");
		const date = searchParams.get("date");
		const time = searchParams.get("time");
		const location = searchParams.get("location");
		const price = searchParams.get("price");
		const paymentMethod = searchParams.get("paymentMethod");

		if (service && artist && date && time && location && price && paymentMethod) {
			setBookingData({
				service: service,
				artist: artist,
				date: date,
				time: time,
				location: location,
				price: price,
				paymentMethod: paymentMethod
			});
		}
	}, [searchParams]);

	const getServiceDuration = (service: string) => {
		const durations: { [key: string]: string } = {
			"Hybrid Set": "2hours",
			"Classic Set": "1.5hours",
			"Volume Set": "2.5hours",
			" MegaVolume Set": "3hours",
			"Ombré Powder Brows": "3hours",
			"Signature Combo Brows": "3hours",
			"Microshading": "2.5hours",
			"Brow Lamination & Tint": "1hour",
			"Brow Touch-up (All Types)": "1hour",
		};
		return durations[service] || "2hours";
	};

	const formatPrice = (price: string) => {
		const numPrice = parseFloat(price);
		return `₦${numPrice.toLocaleString('en-NG')}`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			weekday: 'long', 
			month: 'long', 
			day: 'numeric', 
			year: 'numeric' 
		});
	};

	const formatTime = (timeString: string) => {
		// Convert "10:00 AM" to "10:00" or "4:00 PM" to "16:00" format
		if (!timeString) return "";
		
		// If already in 24-hour format, return as is
		if (timeString.includes(":") && !timeString.includes("AM") && !timeString.includes("PM")) {
			return timeString;
		}
		
		// Convert 12-hour to 24-hour format
		const [time, period] = timeString.split(" ");
		if (!period) return timeString;
		
		const [hours, minutes] = time.split(":");
		let hour24 = parseInt(hours);
		
		if (period.toUpperCase() === "PM" && hour24 !== 12) {
			hour24 += 12;
		} else if (period.toUpperCase() === "AM" && hour24 === 12) {
			hour24 = 0;
		}
		
		return `${hour24.toString().padStart(2, "0")}:${minutes || "00"}`;
	};

	const handleInputChange = (field: string, value: string) => {
		setCustomerData(prev => ({ ...prev, [field]: value }));
	};

	const handleConfirmBooking = () => {
		// Validate customer information
		if (!customerData.fullName || !customerData.email || !customerData.phone) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (!agreeToTerms) {
			toast.error("Please agree to the terms and conditions");
			return;
		}

		// Navigate to success page
		const params = new URLSearchParams({
			...bookingData,
			...customerData,
			preferredContact: customerData.preferredContact || "whatsapp"
		});
		
		router.push(`/book-session/success?${params.toString()}`);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Main Content */}
			<div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-3">
						Confirm Your Booking
					</h1>
					<p className="text-lg text-gray-600">
						Please review your appointment details.
					</p>
				</div>

				{/* Booking Details Sections */}
				<div className="space-y-6 mb-8">
					{/* Services Booked */}
					<div className="bg-yellow-50 rounded-xl p-6">
						<h2 className="text-xl font-bold text-dark-gray mb-4">Services Booked</h2>
						<div className="space-y-3">
							<div className="flex justify-between items-start">
								<div>
									<p className="font-semibold text-dark-gray">{bookingData.service}</p>
									<p className="text-sm text-gray-600">{getServiceDuration(bookingData.service)}</p>
								</div>
								<p className="font-bold text-dark-gray">{formatPrice(bookingData.price)}</p>
							</div>
							<div className="flex justify-between pt-3 border-t border-yellow-200">
								<div>
									<p className="font-semibold text-dark-gray">Total</p>
									<p className="text-sm text-gray-600">Duration: {getServiceDuration(bookingData.service)}</p>
								</div>
								<p className="font-bold text-lg text-dark-gray">{formatPrice(bookingData.price)}</p>
							</div>
						</div>
					</div>

					{/* Appointment Details */}
					<div className="bg-yellow-50 rounded-xl p-6">
						<h2 className="text-xl font-bold text-dark-gray mb-4">Appointment Details</h2>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-gray-600">Date:</span>
								<span className="font-semibold text-dark-gray">{formatDate(bookingData.date)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Time:</span>
								<span className="font-semibold text-dark-gray">{formatTime(bookingData.time)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Preferred Artist:</span>
								<span className="font-semibold text-dark-gray">
									{bookingData.artist === "lulu" ? "Lulu" : 
									 bookingData.artist === "sarah" ? "Sarah Johnson" : 
									 bookingData.artist === "maya" ? "Maya Williams" : 
									 bookingData.artist.includes("Lulu") ? "Lulu" : bookingData.artist}
								</span>
							</div>
							<div className="flex justify-between pt-3 border-t border-yellow-200">
								<span className="text-gray-600">Price:</span>
								<span className="font-bold text-dark-gray">{formatPrice(bookingData.price)}</span>
							</div>
						</div>
					</div>

					{/* Your Information */}
					<div className="bg-yellow-50 rounded-xl p-6">
						<h2 className="text-xl font-bold text-dark-gray mb-4">Your Information</h2>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Name *
									</label>
									<input
										type="text"
										value={customerData.fullName}
										onChange={(e) => handleInputChange("fullName", e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent bg-white"
										placeholder="Enter your full name"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone *
									</label>
									<input
										type="tel"
										value={customerData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent bg-white"
										placeholder="+23481409749"
										required
									/>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email *
									</label>
									<input
										type="email"
										value={customerData.email}
										onChange={(e) => handleInputChange("email", e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent bg-white"
										placeholder="olukola@gmail.com"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Preferred Contact
									</label>
									<select
										value={customerData.preferredContact}
										onChange={(e) => handleInputChange("preferredContact", e.target.value)}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent bg-white"
									>
										<option value="whatsapp">WhatsApp</option>
										<option value="email">Email</option>
										<option value="phone">Phone</option>
									</select>
								</div>
							</div>
							<div className="pt-4 border-t border-yellow-200">
								<label className="flex items-start gap-3 cursor-pointer">
									<input
										type="checkbox"
										checked={agreeToTerms}
										onChange={(e) => setAgreeToTerms(e.target.checked)}
										className="mt-1 w-5 h-5 text-primary-gold focus:ring-primary-gold rounded"
									/>
									<span className="text-sm text-gray-700">
										I agree to the terms and conditions, cancellation policy, and understand that late arrivals may result in reduced service time.
									</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				{/* Navigation Buttons */}
				<div className="flex gap-4 mb-12">
					<Link
						href={`/book-session/payment?service=${encodeURIComponent(bookingData.service)}&artist=${encodeURIComponent(bookingData.artist)}&date=${encodeURIComponent(bookingData.date)}&time=${encodeURIComponent(bookingData.time)}&location=${encodeURIComponent(bookingData.location)}`}
						className="flex-1 bg-white border-2 border-primary-gold text-primary-gold hover:bg-yellow-50 font-semibold py-4 px-6 rounded-lg transition-colors text-center"
					>
						← Back
					</Link>
					<button
						onClick={handleConfirmBooking}
						className="flex-1 bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300"
					>
						Confirm Booking
					</button>
				</div>

				{/* Important Notes & Policies Section */}
				<div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
					<h2 className="text-2xl font-bold text-dark-gray mb-2 text-center">Important Notes & Policies</h2>
					<p className="text-gray-600 mb-8 text-center">Please review our policies to ensure a smooth experience</p>
					
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

				{/* Newsletter Signup Section */}
				<div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl shadow-lg p-8">
					<h2 className="text-2xl font-bold text-dark-gray mb-2 text-center">Glow in Your Inbox</h2>
					<p className="text-gray-600 mb-6 text-center">
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
						className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
					>
						<input
							type="email"
							placeholder="Your Email address"
							required
							className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent bg-white"
						/>
						<button
							type="submit"
							className="bg-primary-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap"
						>
							Subscribe & Stay Beautiful
						</button>
					</form>
					
					<p className="text-xs text-gray-500 mt-4 text-center">
						By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
					</p>
				</div>
			</div>
		</div>
	);
};

const ConfirmBookingPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-gray-50 p-8">Loading confirmation details...</div>}>
			<ConfirmBookingPageContent />
		</Suspense>
	);
};

export default ConfirmBookingPage;
