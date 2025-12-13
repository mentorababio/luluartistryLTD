"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Truck, CreditCard, CheckCircle, Shield, Copy, ChevronRight, Plus, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api/client";

export default function CheckoutPage() {
	const router = useRouter();
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [currentStep, setCurrentStep] = useState(2); // 1: Delivery Info, 2: Payment, 3: Review (Payment is current step)
	
	const [customerData, setCustomerData] = useState({
		fullName: "",
		email: "",
		phone: "",
		streetAddress: "",
		city: "",
		state: "",
		zipCode: ""
	});

	const [deliveryMethod, setDeliveryMethod] = useState("standard");
	const [paymentMethod, setPaymentMethod] = useState("card");
	const [rememberInfo, setRememberInfo] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	const [promoCode, setPromoCode] = useState("");

	const [paymentData, setPaymentData] = useState({
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardholderName: ""
	});

	const [isProcessing, setIsProcessing] = useState(false);

	const [bankDetails, setBankDetails] = useState({
		bankName: "Lulu Artistry LTD - GTBank",
		accountNumber: "0123456789",
		accountName: "Lulu Artistry",
		selectedBank: ""
	});

	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			const items = JSON.parse(savedCart);
			setCartItems(items);
		} else {
			// Redirect to cart if empty
			router.push("/cart");
		}
	}, [router]);

	const calculateSubtotal = () => {
		return cartItems.reduce((total, item) => {
			return total + (item.price * (item.quantity || 1));
		}, 0);
	};

	const getShippingCost = () => {
		switch (deliveryMethod) {
			case "standard":
				return 1200;
			case "express":
				return 2500;
			case "pickup":
				return 0;
			default:
				return 1200;
		}
	};

	const calculateTotal = () => {
		return calculateSubtotal() + getShippingCost();
	};

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	const getDeliveryDate = () => {
		const today = new Date();
		const days = deliveryMethod === "standard" ? 3 : deliveryMethod === "express" ? 1 : 0;
		const deliveryDate = new Date(today);
		deliveryDate.setDate(today.getDate() + days);
		return deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`${label} copied to clipboard!`);
	};

	const handleProceed = async () => {
		if (!customerData.fullName || !customerData.email || !customerData.phone || !customerData.streetAddress || !customerData.city || !customerData.state) {
			toast.error("Please fill in all required customer details");
			return;
		}

		if (paymentMethod === "card") {
			if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
				toast.error("Please fill in all payment details");
				return;
			}
		}

		if (!agreeToTerms) {
			toast.error("Please agree to the terms & conditions");
			return;
		}

		setIsProcessing(true);

		try {
			// Parse customer name into first and last name
			const nameParts = customerData.fullName.trim().split(' ');
			const firstName = nameParts[0] || '';
			const lastName = nameParts.slice(1).join(' ') || '';

			// Prepare order data for API
			const orderPayload = {
				items: cartItems.map(item => ({
					product: item.id,
					quantity: item.quantity || 1,
					price: item.price,
					variant: item.variant
				})),
				customerInfo: {
					firstName,
					lastName,
					email: customerData.email,
					phone: customerData.phone
				},
				shippingAddress: {
					street: customerData.streetAddress,
					city: customerData.city,
					state: customerData.state,
					landmark: ''
				},
				deliveryZone: {
					zone: customerData.state,
					cost: getShippingCost()
				},
				paymentMethod: paymentMethod === 'card' ? 'paystack' : 'bank_transfer',
				notes: ''
			};

			// Create order via API
			const response = await apiClient.post<any>('/orders', orderPayload);

			if (!response.data) {
				throw new Error('Failed to create order');
			}

			// Save order for reference
			localStorage.setItem("currentOrder", JSON.stringify(response.data));
			localStorage.removeItem("cart");

			toast.success('Order created successfully!');

			// Redirect to Paystack payment or success
			if (paymentMethod === 'card') {
				// If Paystack is implemented, redirect to payment
				// For now, redirect to success
				router.push("/order-success");
			} else {
				router.push("/order-success");
			}
		} catch (error: any) {
			console.error('Order creation failed:', error);
			toast.error(error?.message || 'Failed to create order. Please try again.');
		} finally {
			setIsProcessing(false);
		}
	};

	const addToCart = (product: any) => {
		const savedCart = localStorage.getItem("cart");
		const cartItems = savedCart ? JSON.parse(savedCart) : [];
		
		const existingItem = cartItems.find((item: any) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity = (existingItem.quantity || 1) + 1;
		} else {
			cartItems.push({ ...product, quantity: 1 });
		}
		
		localStorage.setItem("cart", JSON.stringify(cartItems));
		toast.success(`${product.name} added to cart!`);
		setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
	};

	if (cartItems.length === 0) {
		return null; // Will redirect
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
				{/* Progress Indicator */}
				<div className="mb-12">
					<div className="flex items-center justify-center">
						{/* Step 1: Delivery Info */}
						<div className="flex items-center">
							<div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
								currentStep >= 1 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"
							}`}>
								1
							</div>
							<span className={`ml-3 font-medium ${currentStep >= 1 ? "text-primary-gold" : "text-gray-600"}`}>
								Delivery Info
							</span>
						</div>
						
						<div className={`h-1 w-32 mx-4 ${currentStep >= 2 ? "bg-primary-gold" : "bg-gray-300"}`}></div>
						
						{/* Step 2: Payment */}
						<div className="flex items-center">
							<div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
								currentStep >= 2 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"
							}`}>
								2
							</div>
							<span className={`ml-3 font-medium ${currentStep >= 2 ? "text-primary-gold" : "text-gray-600"}`}>
								Payment
							</span>
						</div>
						
						<div className={`h-1 w-32 mx-4 ${currentStep >= 3 ? "bg-primary-gold" : "bg-gray-300"}`}></div>
						
						{/* Step 3: Review & confirm */}
						<div className="flex items-center">
							<div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
								currentStep >= 3 ? "bg-primary-gold text-white" : "bg-gray-300 text-gray-600"
							}`}>
								3
							</div>
							<span className={`ml-3 font-medium ${currentStep >= 3 ? "text-primary-gold" : "text-gray-600"}`}>
								Review & confirm
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Customer Details */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-center gap-3 mb-6">
								<User className="text-primary-gold" size={24} />
								<h2 className="text-xl font-bold text-dark-gray">Customer Details</h2>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
									<input
										type="text"
										value={customerData.fullName}
										onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
										placeholder="Enter your name"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
									<input
										type="email"
										value={customerData.email}
										onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
										placeholder="Enter email"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
									<input
										type="tel"
										value={customerData.phone}
										onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
										placeholder="Enter phone number"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
									<input
										type="text"
										value={customerData.streetAddress}
										onChange={(e) => setCustomerData({ ...customerData, streetAddress: e.target.value })}
										placeholder="Enter street address"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
									<input
										type="text"
										value={customerData.city}
										onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
										placeholder="Enter city"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
									<input
										type="text"
										value={customerData.state}
										onChange={(e) => setCustomerData({ ...customerData, state: e.target.value })}
										placeholder="Enter state"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Zip/Postcode (Optional)</label>
									<input
										type="text"
										value={customerData.zipCode}
										onChange={(e) => setCustomerData({ ...customerData, zipCode: e.target.value })}
										placeholder="Enter zip/postcode"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									/>
								</div>
							</div>
						</div>

						{/* Delivery Method */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-center gap-3 mb-6">
								<Truck className="text-primary-gold" size={24} />
								<h2 className="text-xl font-bold text-dark-gray">Delivery Method</h2>
							</div>
							<div className="space-y-4">
								{/* Standard Delivery */}
								<label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
									deliveryMethod === "standard" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"
								}`}>
									<input
										type="radio"
										name="delivery"
										value="standard"
										checked={deliveryMethod === "standard"}
										onChange={(e) => setDeliveryMethod(e.target.value)}
										className="w-5 h-5 text-primary-gold focus:ring-primary-gold"
									/>
									<div className="ml-4 flex-1">
										<div className="flex justify-between items-start">
											<div>
												<p className="font-semibold text-dark-gray">Standard delivery</p>
												<p className="text-sm text-gray-600">2-3 Days</p>
												<p className="text-sm text-gray-600">By {getDeliveryDate()}</p>
											</div>
											<p className="font-semibold text-dark-gray">{formatPrice(1200)}</p>
										</div>
									</div>
								</label>

								{/* Express Delivery */}
								<label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
									deliveryMethod === "express" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"
								}`}>
									<input
										type="radio"
										name="delivery"
										value="express"
										checked={deliveryMethod === "express"}
										onChange={(e) => setDeliveryMethod(e.target.value)}
										className="w-5 h-5 text-primary-gold focus:ring-primary-gold"
									/>
									<div className="ml-4 flex-1">
										<div className="flex justify-between items-start">
											<div>
												<p className="font-semibold text-dark-gray">Express Delivery</p>
												<p className="text-sm text-gray-600">Next Day</p>
												<p className="text-sm text-gray-600">By {getDeliveryDate()}</p>
											</div>
											<p className="font-semibold text-dark-gray">{formatPrice(2500)}</p>
										</div>
									</div>
								</label>

								{/* Pickup */}
								<label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
									deliveryMethod === "pickup" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"
								}`}>
									<input
										type="radio"
										name="delivery"
										value="pickup"
										checked={deliveryMethod === "pickup"}
										onChange={(e) => setDeliveryMethod(e.target.value)}
										className="w-5 h-5 text-primary-gold focus:ring-primary-gold"
									/>
									<div className="ml-4 flex-1">
										<div className="flex justify-between items-start">
											<div>
												<p className="font-semibold text-dark-gray">Pickup</p>
												<p className="text-sm text-gray-600">Available now</p>
											</div>
											<p className="font-semibold text-dark-gray">Free</p>
										</div>
									</div>
								</label>
							</div>
						</div>

						{/* Payment Method */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex items-center gap-3 mb-6">
								<CreditCard className="text-primary-gold" size={24} />
								<h2 className="text-xl font-bold text-dark-gray">Payment Method</h2>
							</div>
							<div className="space-y-4">
								{/* Paystack/Flutterwave Card */}
								<label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
									paymentMethod === "card" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"
								}`}>
									<input
										type="radio"
										name="payment"
										value="card"
										checked={paymentMethod === "card"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="w-5 h-5 text-primary-gold focus:ring-primary-gold mt-1"
									/>
									<div className="ml-4 flex-1">
										<div>
											<p className="font-semibold text-dark-gray">Paystack/Flutterwave (Debit/Credit Card)</p>
											<p className="text-sm text-gray-600">Debit/Credit Card</p>
										</div>
										{paymentMethod === "card" && (
											<div className="mt-4 space-y-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
													<input
														type="text"
														value={paymentData.cardNumber}
														onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
														placeholder="0000 0000 0000 0000"
														maxLength={19}
														className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
													/>
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
														<input
															type="text"
															value={paymentData.expiryDate}
															onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
															placeholder="MM/YY"
															maxLength={5}
															className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
														/>
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
														<input
															type="text"
															value={paymentData.cvv}
															onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
															placeholder="000"
															maxLength={4}
															className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
														/>
													</div>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
													<input
														type="text"
														value={paymentData.cardholderName}
														onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
														placeholder="Enter name as it appears on card"
														className="w-full px-4 py-3 border-2 border-primary-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
													/>
												</div>
											</div>
										)}
									</div>
								</label>

								{/* Bank Transfer */}
								<label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
									paymentMethod === "transfer" ? "border-primary-gold bg-yellow-50" : "border-gray-200 hover:border-gray-300"
								}`}>
									<input
										type="radio"
										name="payment"
										value="transfer"
										checked={paymentMethod === "transfer"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="w-5 h-5 text-primary-gold focus:ring-primary-gold mt-1"
									/>
									<div className="ml-4 flex-1">
										<div>
											<p className="font-semibold text-dark-gray">Bank Transfer</p>
											<p className="text-sm text-gray-600">Direct bank transfer</p>
										</div>
										{paymentMethod === "transfer" && (
											<div className="mt-4 space-y-4">
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<div>
														<p className="text-xs text-gray-600">Bank Name</p>
														<p className="font-semibold">{bankDetails.bankName}</p>
													</div>
													<button
														onClick={() => copyToClipboard(bankDetails.bankName, "Bank name")}
														className="p-2 hover:bg-gray-200 rounded"
													>
														<Copy size={16} />
													</button>
												</div>
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<div>
														<p className="text-xs text-gray-600">Account Number</p>
														<p className="font-semibold">{bankDetails.accountNumber}</p>
													</div>
													<button
														onClick={() => copyToClipboard(bankDetails.accountNumber, "Account number")}
														className="p-2 hover:bg-gray-200 rounded"
													>
														<Copy size={16} />
													</button>
												</div>
												<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<div>
														<p className="text-xs text-gray-600">Account Name</p>
														<p className="font-semibold">{bankDetails.accountName}</p>
													</div>
													<button
														onClick={() => copyToClipboard(bankDetails.accountName, "Account name")}
														className="p-2 hover:bg-gray-200 rounded"
													>
														<Copy size={16} />
													</button>
												</div>
												<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-2 border-primary-gold">
													<div>
														<p className="text-xs text-gray-600">Amount to Transfer</p>
														<p className="font-bold text-primary-gold text-lg">{formatPrice(calculateTotal())}</p>
													</div>
													<button
														onClick={() => copyToClipboard(formatPrice(calculateTotal()), "Amount")}
														className="p-2 hover:bg-yellow-100 rounded"
													>
														<Copy size={16} />
													</button>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-2">Select your bank</label>
													<select
														value={bankDetails.selectedBank}
														onChange={(e) => setBankDetails({ ...bankDetails, selectedBank: e.target.value })}
														className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
													>
														<option value="">Select your bank</option>
														<option value="gtb">GTBank</option>
														<option value="access">Access Bank</option>
														<option value="uba">UBA</option>
														<option value="zenith">Zenith Bank</option>
														<option value="firstbank">First Bank</option>
													</select>
												</div>
											</div>
										)}
									</div>
								</label>
							</div>
						</div>

						{/* Proceed Button */}
						<div>
							<button
								onClick={handleProceed}
								disabled={isProcessing}
								className={`w-full font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
									isProcessing
										? 'bg-gray-400 text-gray-600 cursor-not-allowed'
										: 'bg-primary-gold hover:bg-yellow-500 text-black'
								}`}
							>
								{isProcessing && <Loader className="w-4 h-4 animate-spin" />}
								{isProcessing ? 'Processing...' : 'Proceed'}
							</button>
							<label className="flex items-center gap-2 mt-4 text-sm text-gray-600">
								<input
									type="checkbox"
									checked={agreeToTerms}
									onChange={(e) => setAgreeToTerms(e.target.checked)}
									className="w-4 h-4 text-primary-gold focus:ring-primary-gold rounded"
								/>
								<span>
									I agree to the{" "}
									<Link href="/terms" className="underline text-primary-gold">terms & conditions</Link>
									{" "}and{" "}
									<Link href="/privacy" className="underline text-primary-gold">privacy policy</Link>
								</span>
							</label>
						</div>
					</div>

					{/* Right Column - Order Summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
							<h2 className="text-xl font-bold text-dark-gray mb-6">Order Summary</h2>
							
							{/* Cart Items */}
							<div className="space-y-4 mb-6">
								{cartItems.map((item) => (
									<div key={item.id} className="flex gap-3">
										<div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
											<Image
												src={item.image}
												alt={item.name}
												fill
												className="object-cover rounded"
											/>
										</div>
										<div className="flex-1">
											<p className="font-semibold text-sm text-dark-gray">{item.name}</p>
											<p className="text-xs text-gray-600">qty {item.quantity || 1}</p>
											<p className="font-bold text-primary-gold">{formatPrice(item.price)}</p>
										</div>
									</div>
								))}
							</div>

							{/* Promo Code */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">Promo code/optional</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value)}
										placeholder="Enter promo code"
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									/>
									<button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors">
										Apply
									</button>
								</div>
							</div>

							{/* Price Breakdown */}
							<div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
								<div className="flex justify-between">
									<span className="text-gray-600">Subtotal:</span>
									<span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Shipping:</span>
									<span className="font-semibold">{formatPrice(getShippingCost())}</span>
								</div>
								<div className="flex justify-between pt-3 border-t border-gray-200">
									<span className="font-bold text-lg">Total:</span>
									<span className="font-bold text-lg text-primary-gold">{formatPrice(calculateTotal())}</span>
								</div>
							</div>

							{/* Remember Info Checkbox */}
							<label className="flex items-center gap-2 mb-6 text-sm text-gray-600">
								<input
									type="checkbox"
									checked={rememberInfo}
									onChange={(e) => setRememberInfo(e.target.checked)}
									className="w-4 h-4 text-primary-gold focus:ring-primary-gold rounded"
								/>
								<span>Remember all information for faster payments</span>
							</label>
						</div>
					</div>
				</div>

				{/* Security Indicators */}
				<div className="flex flex-wrap items-center justify-center gap-6 mt-12 pb-8">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<CheckCircle className="text-green-500" size={16} />
						<Shield className="text-green-500" size={16} />
						<span>SSL Secure</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<CheckCircle className="text-green-500" size={16} />
						<span>Verify by Paystack</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Shield className="text-green-500" size={16} />
						<span>Privacy Protection</span>
					</div>
				</div>
			</div>
		</div>
	);
}

