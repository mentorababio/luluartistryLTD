"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, User, DollarSign, X, Upload, Plus, ChevronDown } from "lucide-react";

interface Booking {
	id: string;
	clientName: string;
	service: string;
	artist: string;
	date: string;
	time: string;
	price: string;
	status: "Confirmed" | "Pending" | "Completed";
}

const bookingsData: Booking[] = [
	{
		id: "1",
		clientName: "Amara Johnson",
		service: "Microblading",
		artist: "Lulu",
		date: "10/15/2025",
		time: "10:00 AM",
		price: "₦45.0K",
		status: "Confirmed"
	},
	{
		id: "2",
		clientName: "Chidara Okafor",
		service: "Classic Lashes",
		artist: "Sarah",
		date: "10/15/2025",
		time: "11:30 AM",
		price: "₦25.0K",
		status: "Confirmed"
	},
	{
		id: "3",
		clientName: "Blessing Yemi",
		service: "Spa Facial",
		artist: "Grace",
		date: "10/15/2025",
		time: "2:00 PM",
		price: "₦15.0K",
		status: "Pending"
	},
	{
		id: "4",
		clientName: "Zainab Hassan",
		service: "Lip Blush Tattoo",
		artist: "Lulu",
		date: "10/16/2025",
		time: "9:00 AM",
		price: "₦55.0K",
		status: "Completed"
	},
	{
		id: "5",
		clientName: "Fatima Ali",
		service: "Volume Lashes",
		artist: "Sarah",
		date: "10/16/2025",
		time: "11:00 AM",
		price: "₦35.0K",
		status: "Confirmed"
	},
	{
		id: "6",
		clientName: "Chioma Nwosu",
		service: "Ombré Powder Brows",
		artist: "Lulu",
		date: "10/17/2025",
		time: "10:00 AM",
		price: "₦50.0K",
		status: "Pending"
	},
	{
		id: "7",
		clientName: "Amina Bello",
		service: "Spa Massage",
		artist: "Grace",
		date: "10/17/2025",
		time: "3:00 PM",
		price: "₦20.0K",
		status: "Confirmed"
	},
	{
		id: "8",
		clientName: "Kemi Adeyemi",
		service: "Tattoo Removal",
		artist: "Lulu",
		date: "10/18/2025",
		time: "1:00 PM",
		price: "₦60.0K",
		status: "Pending"
	},
	{
		id: "9",
		clientName: "Ngozi Okoro",
		service: "Hybrid Brows",
		artist: "Sarah",
		date: "10/18/2025",
		time: "2:30 PM",
		price: "₦48.0K",
		status: "Completed"
	},
	{
		id: "10",
		clientName: "Halima Usman",
		service: "Classic Lashes",
		artist: "Grace",
		date: "10/19/2025",
		time: "11:00 AM",
		price: "₦25.0K",
		status: "Confirmed"
	}
];

export default function BookingsPage() {
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [dateRange, setDateRange] = useState("mm/dd/yyyy");
	const [serviceFilter, setServiceFilter] = useState("All Service");
	const [artistFilter, setArtistFilter] = useState("All Artist");
	const [showServiceDropdown, setShowServiceDropdown] = useState(false);
	const [showArtistDropdown, setShowArtistDropdown] = useState(false);
	const serviceDropdownRef = useRef<HTMLDivElement>(null);
	const artistDropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
				setShowServiceDropdown(false);
			}
			if (artistDropdownRef.current && !artistDropdownRef.current.contains(event.target as Node)) {
				setShowArtistDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Confirmed":
				return "bg-green-500 text-white";
			case "Pending":
				return "bg-orange-500 text-white";
			case "Completed":
				return "bg-blue-500 text-white";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const handleViewDetails = (booking: Booking) => {
		setSelectedBooking(booking);
		setShowModal(true);
	};

	const services = ["All Services", "Brows", "Lashes", "Tattoo", "Spa"];
	const artists = ["All Artist", "Lulu", "Sarah", "Grace"];

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
				<p className="text-gray-600 mt-1">Manage all service in one place.</p>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center justify-between">
				<div className="flex gap-4">
					<button className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors">
						<Upload size={18} />
						Export Data
					</button>
					<button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
						<Plus size={18} />
						New Booking
					</button>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Date Range */}
					<div className="relative">
						<label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
						<div className="relative">
							<Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
							<input
								type="text"
								value={dateRange}
								onChange={(e) => setDateRange(e.target.value)}
								placeholder="mm/dd/yyyy"
								className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Service Type */}
					<div className="relative" ref={serviceDropdownRef}>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
						<div className="relative">
							<button
								onClick={() => {
									setShowServiceDropdown(!showServiceDropdown);
									setShowArtistDropdown(false);
								}}
								className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
							>
								<span>{serviceFilter}</span>
								<ChevronDown size={18} className="text-gray-400" />
							</button>
							{showServiceDropdown && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
									{services.map((service) => (
										<button
											key={service}
											onClick={() => {
												setServiceFilter(service);
												setShowServiceDropdown(false);
											}}
											className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
										>
											{service}
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Artist */}
					<div className="relative" ref={artistDropdownRef}>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Artist</label>
						<div className="relative">
							<button
								onClick={() => {
									setShowArtistDropdown(!showArtistDropdown);
									setShowServiceDropdown(false);
								}}
								className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
							>
								<span>{artistFilter}</span>
								<ChevronDown size={18} className="text-gray-400" />
							</button>
							{showArtistDropdown && (
								<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
									{artists.map((artist) => (
										<button
											key={artist}
											onClick={() => {
												setArtistFilter(artist);
												setShowArtistDropdown(false);
											}}
											className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
										>
											{artist}
										</button>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Appointments Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<h2 className="text-xl font-bold text-gray-900 mb-6">All Appointments ({bookingsData.length})</h2>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client Name</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Service</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Artist</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
								<th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
							</tr>
						</thead>
						<tbody>
							{bookingsData.map((booking) => (
								<tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
									<td className="py-4 px-4 text-sm text-gray-900">{booking.clientName}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{booking.service}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{booking.artist}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{booking.date}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{booking.time}</td>
									<td className="py-4 px-4 text-sm text-gray-900 font-semibold">{booking.price}</td>
									<td className="py-4 px-4">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
											{booking.status}
										</span>
									</td>
									<td className="py-4 px-4">
										<button
											onClick={() => handleViewDetails(booking)}
											className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
										>
											View Details
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Booking Details Modal */}
			{showModal && selectedBooking && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-50"
						onClick={() => setShowModal(false)}
					/>
					<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
							{/* Modal Header */}
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
								<button
									onClick={() => setShowModal(false)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X size={20} />
								</button>
							</div>

							{/* Booking ID */}
							<p className="text-sm text-gray-600 mb-6">Booking ID: #{selectedBooking.id}</p>

							{/* Details */}
							<div className="space-y-4 mb-6">
								<div className="flex items-center gap-3">
									<User className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Client</p>
										<p className="text-sm font-semibold text-gray-900">{selectedBooking.clientName}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Date</p>
										<p className="text-sm font-semibold text-gray-900">{selectedBooking.date}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Time</p>
										<p className="text-sm font-semibold text-gray-900">{selectedBooking.time}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<DollarSign className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Price</p>
										<p className="text-sm font-semibold text-gray-900">{selectedBooking.price}</p>
									</div>
								</div>
							</div>

							{/* Service */}
							<div className="mb-4">
								<p className="text-xs text-gray-500 mb-1">Service</p>
								<p className="text-sm font-semibold text-gray-900">{selectedBooking.service}</p>
							</div>

							{/* Artist */}
							<div className="mb-4">
								<p className="text-xs text-gray-500 mb-1">Artist</p>
								<p className="text-sm font-semibold text-gray-900">{selectedBooking.artist}</p>
							</div>

							{/* Status */}
							<div className="mb-6">
								<p className="text-xs text-gray-500 mb-2">Status</p>
								<span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
									{selectedBooking.status}
								</span>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3">
								<button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-colors">
									Reschedule
								</button>
								<button className="w-full border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 font-semibold py-3 rounded-lg transition-colors">
									Reassign
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

