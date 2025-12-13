"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { lulu } from "@/assets";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import toast from "react-hot-toast";

const AppointmentPageContent = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [formData, setFormData] = useState({
		service: "",
		artist: "",
		date: "",
		time: "",
		location: ""
	});

	const [availableTimes, setAvailableTimes] = useState<string[]>([]);

	useEffect(() => {
		const service = searchParams.get("service");
		const type = searchParams.get("type");
		
		if (service) {
			setFormData(prev => ({ ...prev, service: decodeURIComponent(service) }));
		}
	}, [searchParams]);

	const artists = [
		{ id: "lulu", name: "Lulu" },
		{ id: "sarah", name: "Sarah Johnson" },
		{ id: "maya", name: "Maya Williams" }
	];

	const locations = [
		{ id: "studio", name: "Lulu's Academy" },
		{ id: "home", name: "Home Visit" },
		{ id: "mobile", name: "Mobile Service" }
	];

	const timeSlots = [
		"9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
		"1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
	];

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		
		// If date is selected, show available times
		if (field === "date") {
			setAvailableTimes(timeSlots);
		}
	};

	const handleNext = () => {
		// Validate form
		if (!formData.artist || !formData.date || !formData.time || !formData.location) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Navigate to payment page with form data
		const params = new URLSearchParams({
			service: formData.service,
			artist: formData.artist,
			date: formData.date,
			time: formData.time,
			location: formData.location
		});
		
		router.push(`/book-session/payment?${params.toString()}`);
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
					<div className="flex items-center gap-4 mb-4">
						<Link 
							href="/book-session"
							className="flex items-center gap-2 text-primary-gold hover:text-yellow-500"
						>
							<ArrowLeft size={20} />
							<span>Back</span>
						</Link>
					</div>
					<h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-2">
						Book a Session - Lulu's Academy
					</h1>
					<p className="text-lg text-gray-600">
						Book Your Appointment.
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					{/* Booking Form */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold text-dark-gray mb-6">Appointment Details</h2>
							
							<div className="space-y-6">
								{/* Service */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Service
									</label>
									<div className="relative">
										<input
											type="text"
											value={formData.service}
											readOnly
											className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
										/>
									</div>
								</div>

								{/* Artist */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Artist *
									</label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
										<select
											value={formData.artist}
											onChange={(e) => handleInputChange("artist", e.target.value)}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										>
											<option value="">Select an artist</option>
											{artists.map((artist) => (
												<option key={artist.id} value={artist.id}>
													{artist.name}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Date */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Date *
									</label>
									<div className="relative">
										<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
										<input
											type="date"
											value={formData.date}
											onChange={(e) => handleInputChange("date", e.target.value)}
											min={new Date().toISOString().split('T')[0]}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										/>
									</div>
								</div>

								{/* Time */}
								{formData.date && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Time *
										</label>
										<div className="grid grid-cols-3 gap-3">
											{availableTimes.map((time) => (
												<button
													key={time}
													onClick={() => handleInputChange("time", time)}
													className={`p-3 border rounded-lg text-center transition-all duration-300 ${
														formData.time === time
															? 'border-primary-gold bg-primary-gold text-black font-semibold'
															: 'border-gray-300 hover:border-primary-gold hover:bg-primary-gold/10'
													}`}
												>
													{time}
												</button>
											))}
										</div>
									</div>
								)}

								{/* Location */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Location *
									</label>
									<div className="relative">
										<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
										<select
											value={formData.location}
											onChange={(e) => handleInputChange("location", e.target.value)}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										>
											<option value="">Select location</option>
											{locations.map((location) => (
												<option key={location.id} value={location.id}>
													{location.name}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>

							{/* Next Button */}
							<div className="mt-8">
								<button
									onClick={handleNext}
									className="w-full bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
								>
									Next
								</button>
							</div>
						</div>
					</div>

					{/* About Lulu Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-gray-50 rounded-2xl p-6 sticky top-8">
							<h3 className="text-xl font-bold text-dark-gray mb-4">
								About Lulu - Beauty & Skills
							</h3>
							<div className="relative h-48 w-full overflow-hidden rounded-lg mb-4">
								<Image
									src={lulu}	
									alt="About Lulu"
									fill
									className="object-cover"
								/>
							</div>
							<p className="text-gray-600 text-sm leading-relaxed">
								With over 5 years of experience in the beauty industry, Lulu has mastered the art of lash extensions and beauty enhancement. Her passion for perfection ensures you'll leave feeling confident and beautiful.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const AppointmentPage = () => {
	return (
		<Suspense fallback={<div className="min-h-screen bg-white p-8">Loading booking details...</div>}>
			<AppointmentPageContent />
		</Suspense>
	);
};

export default AppointmentPage;
