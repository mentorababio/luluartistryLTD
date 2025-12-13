"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminAuth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Allow access to login page without auth
		if (pathname === "/admin/login") {
			setIsLoading(false);
			return;
		}

		// Check authentication for all other admin routes
		if (!adminAuth.isAuthenticated()) {
			router.push("/admin/login");
			return;
		}

		setIsLoading(false);
	}, [pathname, router]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	// Don't show sidebar/header on login page
	if (pathname === "/admin/login") {
		return <>{children}</>;
	}

	return (
		<div className="min-h-screen bg-[#fffaf5]">
			<AdminSidebar />
			<div className="lg:pl-64">
				<AdminHeader />
				<main className="p-6">
					{children}
				</main>
			</div>
		</div>
	);
}

