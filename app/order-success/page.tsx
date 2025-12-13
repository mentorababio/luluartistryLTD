"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Mail, Package, RotateCcw } from "lucide-react";

export default function OrderSuccessPage() {
	const [orderData, setOrderData] = useState<any>(null);

	useEffect(() => {
		const savedOrder = localStorage.getItem("currentOrder");
		if (savedOrder) {
			setOrderData(JSON.parse(savedOrder));
		}
	}, []);

	if (!orderData) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
				<div className="text-center">
					<p className="text-gray-600">Loading order details...</p>
					<Link href="/shop" className="text-primary-gold hover:underline mt-4 inline-block">
						Continue Shopping
					</Link>
				</div>
			</div>
		);
	}

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	const orderId = `LA-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
	const orderDate = new Date().toLocaleDateString('en-US', { 
		month: 'long', 
		day: 'numeric', 
		year: 'numeric' 
	});

	const deliveryDate = (() => {
		const today = new Date();
		const days = orderData.deliveryMethod === "standard" ? 4 : orderData.deliveryMethod === "express" ? 2 : 0;
		const delivery = new Date(today);
		delivery.setDate(today.getDate() + days);
		return delivery.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	})();

	const shippingMethod = orderData.deliveryMethod === "standard" 
		? "Standard shipping (3-5 business days)"
		: orderData.deliveryMethod === "express"
		? "Express shipping (1-2 business days)"
		: "Store Pickup";

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
				{/* Success Icon and Message */}
				<div className="text-center mb-12">
					<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="text-white" size={64} />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-3">
						Order Confirmed!
					</h1>
					<p className="text-xl text-gray-600">
						Thank you for your purchase. Your beauty essentials are on their way!
					</p>
				</div>

				{/* Order Details Card */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
					{/* Order ID and Date */}
					<div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
						<div>
							<h2 className="text-2xl font-bold text-dark-gray mb-2">Order #{orderId}</h2>
							<p className="text-gray-600">Placed on {orderDate}</p>
						</div>
						<div className="text-right">
							<p className="text-2xl font-bold text-primary-gold">{formatPrice(orderData.total)}</p>
							<p className="text-sm text-gray-600">Total Amount</p>
						</div>
					</div>

					{/* Items Ordered */}
					<div className="mb-8">
						<h3 className="text-lg font-semibold text-dark-gray mb-4">Items Ordered</h3>
						<div className="space-y-4">
							{orderData.items.map((item: any) => (
								<div key={item.id} className="flex gap-4">
									<div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg">
										<Image
											src={item.image}
											alt={item.name}
											fill
											className="object-cover rounded-lg"
										/>
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-dark-gray mb-1">{item.name}</h4>
										<p className="text-sm text-gray-600 mb-2">
											{item.description || "Premium quality beauty product"}
										</p>
										<div className="flex justify-between items-center">
											<p className="font-bold text-primary-gold">{formatPrice(item.price)}</p>
											<p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Delivery Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
						<div>
							<h3 className="font-semibold text-dark-gray mb-3">Shipping Address</h3>
							<p className="text-gray-600">
								{orderData.fullName}<br />
								{orderData.streetAddress}<br />
								{orderData.city}, {orderData.state}<br />
								{orderData.zipCode ? `${orderData.zipCode}, ` : ""}Nigeria
							</p>
						</div>
						<div>
							<h3 className="font-semibold text-dark-gray mb-3">Shipping Details</h3>
							<p className="text-gray-600">
								Shipping address<br />
								{deliveryDate}<br />
								{shippingMethod}
							</p>
						</div>
					</div>
				</div>

				{/* Account Creation Prompt */}
				<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 relative">
					<button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
						×
					</button>
					<h3 className="font-semibold text-dark-gray mb-2">
						Want to save your order history and get exclusive beauty drops?
					</h3>
					<p className="text-gray-600 text-sm mb-4">
						Create an account with new-look to unlock seamless rewards, track orders, and get early access to new collections.
					</p>
					<div className="flex gap-4">
						<Link
							href="/login"
							className="bg-primary-gold hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors"
						>
							Create Account
						</Link>
						<button className="border-2 border-primary-gold text-primary-gold hover:bg-yellow-50 font-semibold py-2 px-6 rounded-lg transition-colors">
							Maybe later
						</button>
					</div>
				</div>

				{/* What's Next Section */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-bold text-dark-gray mb-8 text-center">What&apos;s Next?</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Mail className="text-primary-gold" size={32} />
							</div>
							<h3 className="font-semibold text-dark-gray mb-2">Order Confirmation</h3>
							<p className="text-sm text-gray-600">
								You&apos;ll receive an email confirmation with your order details shortly.
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<Package className="text-primary-gold" size={32} />
							</div>
							<h3 className="font-semibold text-dark-gray mb-2">Shipping Updates</h3>
							<p className="text-sm text-gray-600">
								We&apos;ll send you tracking information once your order ships.
							</p>
						</div>
						<div className="text-center">
							<div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
								<RotateCcw className="text-primary-gold" size={32} />
							</div>
							<h3 className="font-semibold text-dark-gray mb-2">Return Policy</h3>
							<p className="text-sm text-gray-600">
								<Link href="/returns" className="text-primary-gold hover:underline">
									View our hassle-free return policy
								</Link> for a seamless experience.
							</p>
						</div>
					</div>
				</div>

				{/* Continue Shopping Button */}
				<div className="text-center">
					<Link
						href="/shop"
						className="inline-block bg-primary-gold hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}

