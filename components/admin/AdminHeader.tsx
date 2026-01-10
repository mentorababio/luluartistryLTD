"use client";

import { adminAuth } from "@/lib/auth";
import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
	const user = adminAuth.getCurrentUser();

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
			{/* Search Bar - Centered */}
			<div className="flex-1 max-w-md mx-auto">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
					<input
						type="text"
						placeholder="Search..."
						className="w-full pl-10 pr-4 py-2 bg-[#fffaf5] border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
					/>
				</div>
			</div>

			{/* Right side */}
			<div className="flex items-center gap-4">
				{/* Notifications */}
				<button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
					<Bell size={20} />
					<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
				</button>

				{/* User info */}
				<div className="flex items-center gap-3">
					<div className="text-right">
						<p className="text-sm font-semibold text-gray-900">Admin</p>
						<p className="text-xs text-gray-600">lulu Artistry</p>
					</div>
					<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
						{user?.name?.charAt(0).toUpperCase() || "A"}
					</div>
				</div>
			</div>
		</header>
	);
}

