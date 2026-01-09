"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, ShoppingBag, Home, Plus, X, Clock, User, DollarSign, AlertCircle } from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import toast from "react-hot-toast";

interface Appointment {
	id: string;
	clientName: string;
	service: string;
	artist: string;
	date: string;
	time: string;
	price: string;
	status: "Confirmed" | "Pending" | "Completed";
}

const bookingsTrendData = [
	{ month: "Jan", bookings: 2 },
	{ month: "Feb", bookings: 3 },
	{ month: "Mar", bookings: 4 },
	{ month: "Apr", bookings: 3 },
	{ month: "May", bookings: 5 },
	{ month: "Jun", bookings: 4 },
	{ month: "Jul", bookings: 5 },
	{ month: "Aug", bookings: 8 },
	{ month: "Sep", bookings: 12 },
	{ month: "Oct", bookings: 14 },
	{ month: "Nov", bookings: 16 },
	{ month: "Dec", bookings: 16 }
];

const salesData = [
	{ name: "Lashes", value: 35, color: "#FF6B35" },
	{ name: "Tattos", value: 34, color: "#F7B801" },
	{ name: "Spa", value: 20, color: "#4A90E2" },
	{ name: "Brows", value: 11, color: "#50C878" }
];

export default function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);

	useEffect(() => {
		const fetchBookings = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					toast.error('Authentication required. Please login to admin dashboard.');
					setLoading(false);
					return;
				}

				const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
				const response = await fetch(`${baseUrl}/bookings`, {
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});

				if (response.status === 401) {
					toast.error('Session expired. Please login again.');
					setLoading(false);
					return;
				}

				if (response.status === 403) {
					toast.error('Admin access required.');
					setLoading(false);
					return;
				}

				if (!response.ok) {
					throw new Error('Failed to fetch bookings');
				}

				const data = await response.json();
				const bookings = data.data || [];

				// Transform API response to Appointment format
				const transformedAppointments = bookings.map((booking: any) => ({
					id: booking._id,
					clientName: booking.clientName,
					service: booking.service || 'Booking',
					artist: booking.artist || 'TBA',
					date: new Date(booking.date).toLocaleDateString('en-GB'),
					time: new Date(booking.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
					price: `₦${(booking.price || 0).toLocaleString()}`,
					status: booking.status === 'confirmed' ? 'Confirmed' : 
							booking.status === 'pending' ? 'Pending' : 'Completed'
				}));

				setAppointmentsData(transformedAppointments);
				setError(null);
			} catch (err) {
				console.error('Error fetching bookings:', err);
				setError('Failed to load bookings');
				// Fall back to empty data
				setAppointmentsData([]);
			} finally {
				setLoading(false);
			}
		};

		fetchBookings();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "Confirmed":
				return "bg-green-100 text-green-800";
			case "Pending":
				return "bg-orange-100 text-orange-800";
			case "Completed":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleViewAppointment = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setShowModal(true);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
					<AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
					<div>
						<h3 className="font-semibold text-red-900">Error Loading Data</h3>
						<p className="text-sm text-red-700">{error}</p>
					</div>
				</div>
			)}
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Product Sales */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Calendar className="text-yellow-600" size={24} />
						</div>
					</div>
					<h3 className="text-3xl font-bold text-gray-900 mb-1">120+</h3>
					<p className="text-sm text-gray-600 mb-1">Product Sales</p>
					<p className="text-xs text-green-600 font-semibold">+15% from last month</p>
				</div>

				{/* Total Bookings */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Calendar className="text-yellow-600" size={24} />
						</div>
					</div>
					<h3 className="text-3xl font-bold text-gray-900 mb-1">245</h3>
					<p className="text-sm text-gray-600 mb-1">Total Bookings</p>
					<p className="text-xs text-green-600 font-semibold">+12% from last month</p>
				</div>

				{/* Total Revenue */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Home className="text-yellow-600" size={24} />
						</div>
					</div>
					<h3 className="text-3xl font-bold text-gray-900 mb-1">₦1200.0K</h3>
					<p className="text-sm text-gray-600 mb-1">Total Revenue</p>
					<p className="text-xs text-green-600 font-semibold">+8% from last month</p>
				</div>

				{/* New Clients */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Users className="text-yellow-600" size={24} />
						</div>
					</div>
					<h3 className="text-3xl font-bold text-gray-900 mb-1">42</h3>
					<p className="text-sm text-gray-600 mb-1">New Clients</p>
					<p className="text-xs text-green-600 font-semibold">+24 this week</p>
				</div>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Bookings Trend */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-6">Bookings Trend</h2>
					<ResponsiveContainer width="100%" height={300}>
						<AreaChart data={bookingsTrendData}>
							<defs>
								<linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
									<stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
							<XAxis dataKey="month" stroke="#666" />
							<YAxis stroke="#666" />
							<Tooltip />
							<Area 
								type="monotone" 
								dataKey="bookings" 
								stroke="#4A90E2" 
								fillOpacity={1} 
								fill="url(#colorBookings)" 
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{/* Product & Service Sales */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-xl font-bold text-gray-900 mb-6">Product & Service Sales</h2>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={salesData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, value }) => `${name}: ${value}%`}
								outerRadius={100}
								fill="#8884d8"
								dataKey="value"
							>
								{salesData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Latest Appointments */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-bold text-gray-900">Latest Appointments ({appointmentsData.length})</h2>
				</div>
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
							</tr>
						</thead>
						<tbody>
							{appointmentsData.map((appointment) => (
								<tr 
									key={appointment.id} 
									onClick={() => handleViewAppointment(appointment)}
									className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
								>
									<td className="py-4 px-4 text-sm text-gray-900">{appointment.clientName}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{appointment.service}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{appointment.artist}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{appointment.date}</td>
									<td className="py-4 px-4 text-sm text-gray-600">{appointment.time}</td>
									<td className="py-4 px-4 text-sm text-gray-900 font-semibold">{appointment.price}</td>
									<td className="py-4 px-4">
										<span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
											{appointment.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex gap-4">
				<button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
					<Plus size={20} />
					Add Service
				</button>
				<button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
					<ShoppingBag size={20} />
					Add Product
				</button>
			</div>

			{/* Appointment Details Modal */}
			{showModal && selectedAppointment && (
				<>
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-50"
						onClick={() => setShowModal(false)}
					/>
					<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
						<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
							{/* Modal Header */}
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
								<button
									onClick={() => setShowModal(false)}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<X size={20} />
								</button>
							</div>

							{/* Appointment ID */}
							<p className="text-sm text-gray-600 mb-6">Appointment ID: #{selectedAppointment.id}</p>

							{/* Details */}
							<div className="space-y-4 mb-6">
								<div className="flex items-center gap-3">
									<User className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Client</p>
										<p className="text-sm font-semibold text-gray-900">{selectedAppointment.clientName}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Date</p>
										<p className="text-sm font-semibold text-gray-900">{selectedAppointment.date}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Clock className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Time</p>
										<p className="text-sm font-semibold text-gray-900">{selectedAppointment.time}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<DollarSign className="text-gray-400" size={20} />
									<div>
										<p className="text-xs text-gray-500">Price</p>
										<p className="text-sm font-semibold text-gray-900">{selectedAppointment.price}</p>
									</div>
								</div>
							</div>

							{/* Service */}
							<div className="mb-4">
								<p className="text-xs text-gray-500 mb-1">Service</p>
								<p className="text-sm font-semibold text-gray-900">{selectedAppointment.service}</p>
							</div>

							{/* Artist */}
							<div className="mb-4">
								<p className="text-xs text-gray-500 mb-1">Artist</p>
								<p className="text-sm font-semibold text-gray-900">{selectedAppointment.artist}</p>
							</div>

							{/* Status */}
							<div className="mb-6">
								<p className="text-xs text-gray-500 mb-2">Status</p>
								<span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedAppointment.status)}`}>
									{selectedAppointment.status}
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
