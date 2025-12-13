"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

const BookingSuccessPageContent = () => {
	const searchParams = useSearchParams();
	const [bookingData, setBookingData] = useState({
		service: "",
		artist: "",
		date: "",
		time: "",
		location: "",
		price: "",
		paymentMethod: "",
		fullName: "",
		email: "",
		phone: "",
		preferredContact: ""
	});

	useEffect(() => {
		const service = searchParams.get("service");
		const artist = searchParams.get("artist");
		const date = searchParams.get("date");
		const time = searchParams.get("time");
		const location = searchParams.get("location");
		const price = searchParams.get("price");
		const paymentMethod = searchParams.get("paymentMethod");
		const fullName = searchParams.get("fullName");
		const email = searchParams.get("email");
		const phone = searchParams.get("phone");
		const preferredContact = searchParams.get("preferredContact");

		if (service && artist && date && time && location && price && paymentMethod && fullName && email && phone) {
			setBookingData({
				service: service || "",
				artist: artist || "",
				date: date || "",
				time: time || "",
				location: location || "",
				price: price || "",
				paymentMethod: paymentMethod || "",
				fullName: fullName || "",
				email: email || "",
				phone: phone || "",
				preferredContact: preferredContact || ""
			});
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
			<div className="max-w-2xl w-full">
				{/* Success Icon */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="text-white" size={64} />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-3">
						Booking Confirmed!
					</h1>
					<p className="text-xl text-gray-600">
						Your appointment has been successfully booked.
					</p>
				</div>

				{/* What's Next Section */}
				<div className="bg-yellow-50 rounded-xl p-8 mb-8">
					<h2 className="text-2xl font-bold text-dark-gray mb-6">What&apos;s Next!</h2>
					<div className="space-y-4">
						<div>
							<p className="font-semibold text-dark-gray mb-1">Email Confirmation:</p>
							<p className="text-gray-600">Check your email for booking details.</p>
						</div>
						<div>
							<p className="font-semibold text-dark-gray mb-1">SMS Reminder:</p>
							<p className="text-gray-600">Get a reminder.</p>
						</div>
						<div>
							<p className="font-semibold text-dark-gray mb-1">Contact Us:</p>
							<p className="text-gray-600">Reach us if you need to reschedule.</p>
						</div>
					</div>
				</div>

				{/* Book Another Appointment Button */}
				<div className="text-center">
					<Link
						href="/book-session"
						className="inline-block bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
					>
						Book Another Appointment
					</Link>
				</div>
			</div>
		</div>
	);
};

const BookingSuccessPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">Preparing your confirmation...</div>}>
			<BookingSuccessPageContent />
		</Suspense>
	);
};

export default BookingSuccessPage;
