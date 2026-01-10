"use client";

import { useState, useEffect } from "react";
import { Search, Download, ChevronDown, Eye, Check, X } from "lucide-react";

interface Order {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	items: number;
	totalAmount: number;
	paymentStatus: "Paid" | "Pending";
	date: string;
	status: "new" | "accepted" | "declined" | "history";
	declineReason?: string;
	declineNote?: string;
}

const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
	new: { bg: "bg-white", text: "text-gray-700", badge: "bg-gray-100 text-gray-900" },
	accepted: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-500 text-white" },
	declined: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-500 text-white" },
	history: { bg: "bg-yellow-50", text: "text-yellow-700", badge: "bg-yellow-500 text-white" },
};

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [activeTab, setActiveTab] = useState<"new" | "accepted" | "declined" | "history">("new");
	const [isLoading, setIsLoading] = useState(true);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [decliningOrderId, setDecliningOrderId] = useState<string | null>(null);
	const [declineReason, setDeclineReason] = useState<string>("Out of Stock");
	const [adminNote, setAdminNote] = useState<string>("");

	const declineReasons = [
		"Out of Stock",
		"Customer Request",
		"Fraud",
		"Invalid Address",
		"Other",
	];

	useEffect(() => {
		// Simulate fetching orders from API
		const mockOrders: Order[] = [
			{
				id: "1",
				orderNumber: "ORD-2024-001",
				customerName: "Alice Johnson",
				customerEmail: "alice@example.com",
				items: 2,
				totalAmount: 549.99,
				paymentStatus: "Paid",
				date: "Dec 24, 2024",
				status: "new",
			},
			{
				id: "2",
				orderNumber: "ORD-2024-002",
				customerName: "Bob Williams",
				customerEmail: "bob@example.com",
				items: 1,
				totalAmount: 199.99,
				paymentStatus: "Paid",
				date: "Dec 25, 2024",
				status: "new",
			},
			{
				id: "3",
				orderNumber: "ORD-2024-003",
				customerName: "Carol Davis",
				customerEmail: "carol@example.com",
				items: 3,
				totalAmount: 899.97,
				paymentStatus: "Pending",
				date: "Dec 25, 2024",
				status: "new",
			},
			{
				id: "4",
				orderNumber: "ORD-2024-004",
				customerName: "David Thompson",
				customerEmail: "david.t@example.com",
				items: 1,
				totalAmount: 349.99,
				paymentStatus: "Paid",
				date: "Dec 26, 2024",
				status: "accepted",
			},
			{
				id: "5",
				orderNumber: "ORD-2024-005",
				customerName: "Lisa Anderson",
				customerEmail: "lisa.anderson@example.com",
				items: 2,
				totalAmount: 1099.98,
				paymentStatus: "Paid",
				date: "Dec 26, 2024",
				status: "accepted",
			},
			{
				id: "6",
				orderNumber: "ORD-2024-006",
				customerName: "Mike Brown",
				customerEmail: "mike.brown@example.com",
				items: 1,
				totalAmount: 249.99,
				paymentStatus: "Pending",
				date: "Dec 24, 2024",
				status: "declined",
			},
			{
				id: "7",
				orderNumber: "ORD-2024-007",
				customerName: "Emma Wilson",
				customerEmail: "emma.wilson@example.com",
				items: 4,
				totalAmount: 1299.96,
				paymentStatus: "Paid",
				date: "Dec 20, 2024",
				status: "declined",
			},
			{
				id: "8",
				orderNumber: "ORD-2024-008",
				customerName: "John Smith",
				customerEmail: "john.smith@example.com",
				items: 2,
				totalAmount: 599.98,
				paymentStatus: "Paid",
				date: "Dec 15, 2024",
				status: "history",
			},
			{
				id: "9",
				orderNumber: "ORD-2024-009",
				customerName: "Sarah Lee",
				customerEmail: "sarah.lee@example.com",
				items: 1,
				totalAmount: 179.99,
				paymentStatus: "Paid",
				date: "Dec 10, 2024",
				status: "history",
			},
			{
				id: "10",
				orderNumber: "ORD-2024-010",
				customerName: "Tom Harris",
				customerEmail: "tom.harris@example.com",
				items: 5,
				totalAmount: 1499.95,
				paymentStatus: "Paid",
				date: "Dec 05, 2024",
				status: "history",
			},
		];

		setTimeout(() => {
			setOrders(mockOrders);
			setIsLoading(false);
		}, 500);
	}, []);

	// close menu when clicking outside
	useEffect(() => {
		function handleDocClick(e: MouseEvent) {
			const target = e.target as HTMLElement | null;
			if (!target) return;
			const isInsideMenu = target.closest('[data-order-menu]');
			if (!isInsideMenu) setOpenMenuId(null);
		}

		document.addEventListener('click', handleDocClick);
		return () => document.removeEventListener('click', handleDocClick);
	}, []);

	const tabCounts = {
		new: orders.filter((o) => o.status === "new").length,
		accepted: orders.filter((o) => o.status === "accepted").length,
		declined: orders.filter((o) => o.status === "declined").length,
		history: orders.filter((o) => o.status === "history").length,
	};

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesTab = order.status === activeTab;

		return matchesSearch && matchesTab;
	});

	const handleStatusChange = (id: string, newStatus: "new" | "accepted" | "declined" | "history") => {
		setOrders(
			orders.map((order) =>
				order.id === id ? { ...order, status: newStatus } : order
			)
		);
	};

	const openDeclineModal = (id: string) => {
		setDecliningOrderId(id);
		setDeclineReason("Out of Stock");
		setAdminNote("");
	};

	const closeDeclineModal = () => {
		setDecliningOrderId(null);
		setDeclineReason("Out of Stock");
		setAdminNote("");
	};

	const handleConfirmDecline = () => {
		if (!decliningOrderId) return;
		setOrders(
			orders.map((order) =>
				order.id === decliningOrderId
					? { ...order, status: "declined", declineReason, declineNote: adminNote }
					: order
			)
		);
		closeDeclineModal();
	};

	const handleExportData = () => {
		// Export filtered orders as CSV
		const csv = [
			["Order ID", "Customer", "Email", "Items", "Total", "Payment", "Date", "Status"],
			...filteredOrders.map((order) => [
				order.orderNumber,
				order.customerName,
				order.customerEmail,
				order.items,
				`₦${order.totalAmount}`,
				order.paymentStatus,
				order.date,
				order.status.charAt(0).toUpperCase() + order.status.slice(1),
			]),
		]
			.map((row) => row.join(","))
			.join("\n");

		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Orders</h1>
			</div>

			{/* Search and Filter Bar */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				<div className="flex gap-4 w-full sm:w-auto">
					{/* Search */}
					<div className="relative flex-1 sm:flex-none sm:w-64">
						<Search className="absolute left-3 top-3 text-gray-400" size={18} />
						<input
							type="text"
							placeholder="Search by Order ID / Customer"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
						/>
					</div>

					{/* Date Filter */}
					<input
						type="text"
						placeholder="mm/dd/yyyy"
						value={dateFilter}
						onChange={(e) => setDateFilter(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
					/>
				</div>

				{/* Export Button */}
				<button
					onClick={handleExportData}
					className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
				>
					<Download size={18} />
					Export Data
				</button>
			</div>

			{/* Status Tabs */}
			<div className="flex gap-3 flex-wrap">
				<button
					onClick={() => setActiveTab("new")}
					className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
						activeTab === "new"
							? "bg-yellow-500 text-gray-900 border border-gray-300"
							: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					New Order ({tabCounts.new})
				</button>

				<button
					onClick={() => setActiveTab("accepted")}
					className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
						activeTab === "accepted"
							? "bg-yellow-500 text-white"
							: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					Accepted ({tabCounts.accepted})
				</button>

				<button
					onClick={() => setActiveTab("declined")}
					className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
						activeTab === "declined"
							? "bg-yellow-500 text-white"
							: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					Declined ({tabCounts.declined})
				</button>

				<button
					onClick={() => setActiveTab("history")}
					className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
						activeTab === "history"
							? "bg-yellow-500 text-white"
							: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
					}`}
				>
					History ({tabCounts.history})
				</button>
			</div>

			{/* Table */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading orders...</p>
						</div>
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="flex items-center justify-center h-64">
						<p className="text-gray-500">No orders found</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 border-b border-gray-200">
								<tr>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Order ID
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Customer
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Items
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Total
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Payment
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Status
									</th>
									<th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredOrders.map((order) => (
									<tr key={order.id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											{order.orderNumber}
										</td>
										<td className="px-6 py-4 text-sm">
											<div>
												<p className="font-medium text-gray-900">
													{order.customerName}
												</p>
												<p className="text-gray-500 text-xs">
													{order.customerEmail}
												</p>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{order.items} Item{order.items !== 1 ? "s" : ""}
										</td>
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											₦{order.totalAmount.toLocaleString("en-NG", {
												minimumFractionDigits: 2,
											})}
										</td>
										<td className="px-6 py-4 text-sm">
											<span
												className={`inline-block px-3 py-1 rounded text-xs font-medium ${
													order.paymentStatus === "Paid"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}
											>
												{order.paymentStatus}
											</span>
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											{order.date}
										</td>
										<td className="px-6 py-4 text-sm">
											<span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
												statusColors[order.status].badge
											}`}>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											{order.status === "new" ? (
												<div className="flex items-center justify-end gap-2">
													<button
														onClick={() => handleStatusChange(order.id, "accepted")}
														className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors"
													>
														<Check size={14} />
														Accept
													</button>
													<button
														onClick={() => openDeclineModal(order.id)}
														className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
													>
														<X size={14} />
														Declined
													</button>
												</div>
											) : order.status === "history" ? (
												<div className="flex items-center justify-end gap-2">
													<button className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
														<Eye size={14} />
														Summary
													</button>
													<button className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
														<Download size={14} />
														Invoice
													</button>
												</div>
											) : (
												<div className="flex items-center justify-end gap-2">
													<button className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium">
														<Eye size={16} />
														Details
													</button>
													<div className="relative inline-block" data-order-menu>
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setOpenMenuId(openMenuId === order.id ? null : order.id);
															}}
															className="inline-flex items-center gap-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
														>
															<ChevronDown size={16} />
														</button>
														<div className={`${openMenuId === order.id ? 'block' : 'hidden'} absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10`}>
															<button
																onClick={() => {
																	handleStatusChange(order.id, "accepted");
																	setOpenMenuId(null);
																}}
																className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
															>
																Accepted
															</button>
															<button
																onClick={() => {
																	setOpenMenuId(null);
																	openDeclineModal(order.id);
																}}
																className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
															>
																Declined
															</button>
															<button
																onClick={() => {
																	handleStatusChange(order.id, "history");
																	setOpenMenuId(null);
																}}
																className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
															>
																History
															</button>
															<button
																onClick={() => {
																	handleStatusChange(order.id, "new");
																	setOpenMenuId(null);
																}}
																className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
															>
																Mark as New
															</button>
														</div>
													</div>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
			
			{/* Decline Modal */}
			{decliningOrderId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* backdrop */}
					<div className="absolute inset-0 bg-black opacity-40" onClick={closeDeclineModal} />
					{/* modal */}
					<div className="bg-white rounded-lg shadow-lg w-full max-w-md z-50 p-6 relative">
						<button
							aria-label="Close"
							className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
							onClick={closeDeclineModal}
						>
							×
						</button>
						<h3 className="text-lg font-semibold mb-2">Decline Order</h3>
						<p className="text-sm text-gray-600 mb-4">
							Order #{orders.find((o) => o.id === decliningOrderId)?.orderNumber} - Please select a reason for declining this order
						</p>
						<label className="block text-sm text-gray-700 mb-2">Declined Reason</label>
						<select value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} className="w-full mb-4 border border-gray-300 rounded px-3 py-2">
							{declineReasons.map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</select>
						<label className="block text-sm text-gray-700 mb-2">Admin Note (Optional)</label>
						<textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows={4} className="w-full mb-4 border border-gray-300 rounded px-3 py-2" placeholder="Add any additional details..." />
						<div className="flex justify-end gap-3">
							<button onClick={closeDeclineModal} className="px-4 py-2 border rounded text-sm">
								Cancel
							</button>
							<button onClick={handleConfirmDecline} className="px-4 py-2 bg-red-500 text-white rounded text-sm">
								Confirm Declined
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
