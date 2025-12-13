"use client";

import { Users } from "lucide-react";

export default function ClientsPage() {
	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center max-w-md">
				<div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<Users className="text-yellow-600" size={40} />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Clients Management</h2>
				<p className="text-gray-600">Client management features coming soon</p>
			</div>
		</div>
	);
}

