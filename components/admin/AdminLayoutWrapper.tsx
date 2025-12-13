"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import Nav from "@/layouts/Nav";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function AdminLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	// Admin routes render their own chrome
	if (pathname?.startsWith("/admin")) {
		return <>{children}</>;
	}

	return (
		<div className="min-h-screen bg-[#fffaf5]">
			<div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
				<Header
					isMenuOpen={isMobileMenuOpen}
					onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
				/>
				<Nav
					isMobileOpen={isMobileMenuOpen}
					onCloseMobile={() => setIsMobileMenuOpen(false)}
				/>
			</div>
			<div className="pt-[180px] md:pt-[210px]">
				{children}
				<Footer />
				<WhatsAppButton />
			</div>
		</div>
	);
}

