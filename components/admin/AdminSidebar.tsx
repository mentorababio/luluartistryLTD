"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
	LayoutDashboard, 
	ShoppingBag, 
	Calendar, 
	Package, 
	Users, 
	Settings,
	Palette,
	Menu,
	X
} from "lucide-react";
import { useState } from "react";

const menuItems = [
	{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/bookings", label: "Bookings", icon: Calendar },
	{ href: "/admin/clients", label: "Clients", icon: Users },
	{ href: "/admin/products", label: "Products", icon: ShoppingBag },
	{ href: "/admin/artists", label: "Artists", icon: Palette },
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			{/* Mobile menu button */}
			<button
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
			>
				{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{/* Sidebar */}
			<aside
				className={`
					fixed left-0 top-0 h-full w-64 bg-white z-40 border-r border-gray-200
					transform transition-transform duration-300 ease-in-out
					lg:translate-x-0
					${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
				`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="p-6 border-b border-gray-200">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-xl">L</span>
							</div>
							<h1 className="text-xl font-bold text-gray-900">Lulu Atistry</h1>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-1 overflow-y-auto">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
							
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`
										flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
										${isActive 
											? "bg-yellow-500 text-white font-semibold" 
											: "text-gray-700 hover:bg-gray-100"
										}
									`}
								>
									<Icon size={20} />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Footer */}
					<div className="p-4 border-t border-gray-200">
						<p className="text-xs text-gray-500 text-center">
							©2025 Lulu artistry by @Oladelearis
						</p>
					</div>
				</div>
			</aside>

			{/* Overlay for mobile */}
			{isMobileMenuOpen && (
				<div
					onClick={() => setIsMobileMenuOpen(false)}
					className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
				/>
			)}
		</>
	);
}

