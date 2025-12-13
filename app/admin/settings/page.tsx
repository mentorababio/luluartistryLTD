"use client";

import { useState } from "react";
import { Save, Bell, CreditCard, Mail, Truck, Shield, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
	const [settings, setSettings] = useState({
		// General Settings
		businessName: "Lulu Artistry",
		businessEmail: "info@luluartistry.com",
		businessPhone: "+234 123 456 7890",
		businessAddress: "123 Beauty Street, Lagos, Nigeria",
		
		// Payment Settings
		paystackPublicKey: "",
		paystackSecretKey: "",
		flutterwavePublicKey: "",
		flutterwaveSecretKey: "",
		
		// Bank Details
		bankName: "GTBank",
		accountNumber: "0123456789",
		accountName: "Lulu Artistry LTD",
		
		// Email Settings
		smtpHost: "",
		smtpPort: "",
		smtpUser: "",
		smtpPassword: "",
		
		// SMS Settings
		smsProvider: "",
		smsApiKey: "",
		
		// Shipping Settings
		standardShippingCost: "2000",
		expressShippingCost: "5000",
		freeShippingThreshold: "50000",
		
		// Tax Settings
		taxRate: "7.5",
		
		// Notification Settings
		emailNotifications: true,
		smsNotifications: false,
		orderNotifications: true,
		bookingNotifications: true,
	});

	const handleSave = (section: string) => {
		toast.success(`${section} settings saved successfully!`);
	};

	const handleInputChange = (field: string, value: any) => {
		setSettings(prev => ({ ...prev, [field]: value }));
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
				<p className="text-gray-600 mt-1">Manage your business settings and preferences</p>
			</div>

			{/* General Settings */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Globe className="text-yellow-600" size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">General Settings</h2>
					</div>
					<button
						onClick={() => handleSave("General")}
						className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
					>
						<Save size={18} />
						Save
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
						<input
							type="text"
							value={settings.businessName}
							onChange={(e) => handleInputChange("businessName", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Business Email</label>
						<input
							type="email"
							value={settings.businessEmail}
							onChange={(e) => handleInputChange("businessEmail", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Business Phone</label>
						<input
							type="tel"
							value={settings.businessPhone}
							onChange={(e) => handleInputChange("businessPhone", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Business Address</label>
						<input
							type="text"
							value={settings.businessAddress}
							onChange={(e) => handleInputChange("businessAddress", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Payment Settings */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<CreditCard className="text-yellow-600" size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
					</div>
					<button
						onClick={() => handleSave("Payment")}
						className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
					>
						<Save size={18} />
						Save
					</button>
				</div>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Paystack Public Key</label>
						<input
							type="text"
							value={settings.paystackPublicKey}
							onChange={(e) => handleInputChange("paystackPublicKey", e.target.value)}
							placeholder="pk_test_..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Paystack Secret Key</label>
						<input
							type="password"
							value={settings.paystackSecretKey}
							onChange={(e) => handleInputChange("paystackSecretKey", e.target.value)}
							placeholder="sk_test_..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Flutterwave Public Key</label>
						<input
							type="text"
							value={settings.flutterwavePublicKey}
							onChange={(e) => handleInputChange("flutterwavePublicKey", e.target.value)}
							placeholder="FLWPUBK_..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Flutterwave Secret Key</label>
						<input
							type="password"
							value={settings.flutterwaveSecretKey}
							onChange={(e) => handleInputChange("flutterwaveSecretKey", e.target.value)}
							placeholder="FLWSECK_..."
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Bank Details */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<CreditCard className="text-yellow-600" size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">Bank Account Details</h2>
					</div>
					<button
						onClick={() => handleSave("Bank")}
						className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
					>
						<Save size={18} />
						Save
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
						<input
							type="text"
							value={settings.bankName}
							onChange={(e) => handleInputChange("bankName", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
						<input
							type="text"
							value={settings.accountNumber}
							onChange={(e) => handleInputChange("accountNumber", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
						<input
							type="text"
							value={settings.accountName}
							onChange={(e) => handleInputChange("accountName", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Shipping Settings */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Truck className="text-yellow-600" size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">Shipping Settings</h2>
					</div>
					<button
						onClick={() => handleSave("Shipping")}
						className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
					>
						<Save size={18} />
						Save
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Standard Shipping (₦)</label>
						<input
							type="number"
							value={settings.standardShippingCost}
							onChange={(e) => handleInputChange("standardShippingCost", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Express Shipping (₦)</label>
						<input
							type="number"
							value={settings.expressShippingCost}
							onChange={(e) => handleInputChange("expressShippingCost", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Threshold (₦)</label>
						<input
							type="number"
							value={settings.freeShippingThreshold}
							onChange={(e) => handleInputChange("freeShippingThreshold", e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Notification Settings */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
							<Bell className="text-yellow-600" size={20} />
						</div>
						<h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
					</div>
					<button
						onClick={() => handleSave("Notifications")}
						className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
					>
						<Save size={18} />
						Save
					</button>
				</div>
				<div className="space-y-4">
					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={settings.emailNotifications}
							onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
							className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
						/>
						<span className="text-sm font-semibold text-gray-700">Email Notifications</span>
					</label>
					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={settings.smsNotifications}
							onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
							className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
						/>
						<span className="text-sm font-semibold text-gray-700">SMS Notifications</span>
					</label>
					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={settings.orderNotifications}
							onChange={(e) => handleInputChange("orderNotifications", e.target.checked)}
							className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
						/>
						<span className="text-sm font-semibold text-gray-700">Order Notifications</span>
					</label>
					<label className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={settings.bookingNotifications}
							onChange={(e) => handleInputChange("bookingNotifications", e.target.checked)}
							className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500"
						/>
						<span className="text-sm font-semibold text-gray-700">Booking Notifications</span>
					</label>
				</div>
			</div>
		</div>
	);
}

