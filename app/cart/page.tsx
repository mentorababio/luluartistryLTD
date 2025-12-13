"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			const items = JSON.parse(savedCart);
			setCartItems(items);
			const qty: { [key: string]: number } = {};
			items.forEach((item: any) => {
				qty[item.id] = item.quantity || 1;
			});
			setQuantities(qty);
		}
	}, []);

	const updateQuantity = (productId: string, change: number) => {
		const newQty = Math.max(1, (quantities[productId] || 1) + change);
		setQuantities({ ...quantities, [productId]: newQty });
		
		const updatedCart = cartItems.map(item =>
			item.id === productId ? { ...item, quantity: newQty } : item
		);
		setCartItems(updatedCart);
		localStorage.setItem("cart", JSON.stringify(updatedCart));
	};

	const removeItem = (productId: string) => {
		const updatedCart = cartItems.filter(item => item.id !== productId);
		setCartItems(updatedCart);
		localStorage.setItem("cart", JSON.stringify(updatedCart));
		const newQuantities = { ...quantities };
		delete newQuantities[productId];
		setQuantities(newQuantities);
	};

	const calculateSubtotal = () => {
		return cartItems.reduce((total, item) => {
			return total + (item.price * (quantities[item.id] || 1));
		}, 0);
	};

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	return (
		<div className="min-h-screen bg-[#fffaf5]">
			<div className="bg-primary-gray text-white py-12">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary-gold">
						Shopping Cart
					</h1>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-16">
				{cartItems.length === 0 ? (
					<div className="text-center py-12">
						<ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
						<h3 className="text-xl font-semibold text-gray-600 mb-2">
							Your cart is empty
						</h3>
						<p className="text-gray-500 mb-6">
							Start adding products to your cart!
						</p>
						<Link
							href="/shop"
							className="inline-block bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2">
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-xl font-bold mb-6">Cart Items</h2>
								<div className="space-y-4">
									{cartItems.map((item) => (
										<div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
											<div className="relative w-24 h-24 flex-shrink-0"  style={{ backgroundColor: '#F0D5BD' }}>  
												<Image
													src={item.image}
													alt={item.name}
													fill
													className="object-cover rounded-lg"
												/>
											</div>
											<div className="flex-1">
												<Link href={`/product/${item.id}`}>
													<h3 className="font-semibold hover:text-primary-gold transition-colors">
														{item.name}
													</h3>
												</Link>
												<p className="text-primary-gold font-bold mt-1">
													{formatPrice(item.price)}
												</p>
												<div className="flex items-center gap-4 mt-4">
													<div className="flex items-center gap-2 border border-gray-300 rounded-lg">
														<button
															onClick={() => updateQuantity(item.id, -1)}
															className="p-2 hover:bg-gray-100 transition-colors"
														>
															<Minus size={16} />
														</button>
														<span className="px-4 py-2 min-w-[3rem] text-center">
															{quantities[item.id] || 1}
														</span>
														<button
															onClick={() => updateQuantity(item.id, 1)}
															className="p-2 hover:bg-gray-100 transition-colors"
														>
															<Plus size={16} />
														</button>
													</div>
													<button
														onClick={() => removeItem(item.id)}
														className="text-yellow-500 hover:text-yellow-700 transition-colors"
													>
														<Trash2 size={18} />
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="lg:col-span-1">
							<div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
								<h2 className="text-xl font-bold mb-6">Order Summary</h2>
								<div className="space-y-4 mb-6">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal</span>
										<span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Shipping</span>
										<span className="font-semibold">Calculated at checkout</span>
									</div>
									<div className="border-t border-gray-200 pt-4 flex justify-between">
										<span className="text-lg font-bold">Total</span>
										<span className="text-lg font-bold text-primary-gold">
											{formatPrice(calculateSubtotal())}
										</span>
									</div>
								</div>
								<Link
									href="/checkout"
									className="block w-full bg-primary-gold text-white text-center py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
								>
									Proceed to Checkout
								</Link>
								<Link
									href="/shop"
									className="block w-full text-center py-3 mt-4 text-gray-600 hover:text-primary-gold transition-colors"
								>
									Continue Shopping
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

