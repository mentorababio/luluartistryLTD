import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export const metadata: Metadata = {
	title: "Lulu Artistry",
	description: "Lulu Artistry",
	icons: {
		icon: "/lulu.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased`}>
				<AdminLayoutWrapper>
					{children}
				</AdminLayoutWrapper>
				<Toaster 
					position="top-right"
					toastOptions={{
						duration: 3000,
						style: {
							background: '#363636',
							color: '#fff',
						},
						success: {
							duration: 3000,
							iconTheme: {
								primary: '#10b981',
								secondary: '#fff',
							},
						},
						error: {
							duration: 3000,
							iconTheme: {
								primary: '#ef4444',
								secondary: '#fff',
							},
						},
					}}
				/>
			</body>
		</html>
	);
}
