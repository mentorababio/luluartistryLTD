"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useProducts, Product } from "@/hooks/useProducts";

export default function WishlistPage() {
	const [favorites, setFavorites] = useState<string[]>([]);
	
	// Fetch all products from backend
	const { products, loading } = useProducts();

	// Filter products to show only favorited ones
	const wishlistProducts = products.filter(p => favorites.includes(p.id));

	useEffect(() => {
		// Load favorites from localStorage
		const savedFavorites = localStorage.getItem("wishlist");
		if (savedFavorites) {
			const favoriteIds = JSON.parse(savedFavorites);
			setFavorites(favoriteIds);
		}
	}, []);

	const removeFromWishlist = (productId: string) => {
		const updatedFavorites = favorites.filter(id => id !== productId);
		setFavorites(updatedFavorites);
		localStorage.setItem("wishlist", JSON.stringify(updatedFavorites));
		toast.success("Removed from wishlist");
	};

	const addToCart = (product: Product) => {
		const savedCart = localStorage.getItem("cart");
		const cartItems = savedCart ? JSON.parse(savedCart) : [];
		
		const existingItem = cartItems.find((item: any) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity = (existingItem.quantity || 1) + 1;
		} else {
			// Convert backend product format to cart format
			const mainImage = Array.isArray(product.images) && product.images.length > 0
				? (typeof product.images[0] === 'string' 
						? product.images[0] 
						: product.images[0]?.url || "/placeholder.png")
				: "/placeholder.png";
			
			cartItems.push({
				id: product.id,
				name: product.name,
				price: product.price,
				image: mainImage,
				quantity: 1,
				inStock: product.inStock,
			});
		}
		
		localStorage.setItem("cart", JSON.stringify(cartItems));
		toast.success(`${product.name} added to cart!`);
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				size={14}
				className={`${
					i < Math.floor(rating) 
						? 'text-yellow-400 fill-current' 
						: 'text-gray-300'
				}`}
			/>
		));
	};

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	return (
		<div className="min-h-screen bg-[#fffaf5]">
			{/* Header */}
			<div className="bg-primary-gray text-white py-12">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-primary-gold">
						My Wishlist
					</h1>
					<p className="text-gray-300 mt-2">Your loved products</p>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-6 py-16">
				{loading ? (
					<div className="text-center py-12">
						<div className="text-gray-400">Loading wishlist...</div>
					</div>
				) : wishlistProducts.length === 0 ? (
					<div className="text-center py-12">
						<Heart size={64} className="mx-auto text-gray-300 mb-4" />
						<h3 className="text-xl font-semibold text-gray-600 mb-2">
							Your wishlist is empty
						</h3>
						<p className="text-gray-500 mb-6">
							Start adding products you love to your wishlist!
						</p>
						<Link
							href="/shop"
							className="inline-block bg-primary-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
						>
							Continue Shopping
						</Link>
					</div>
				) : (
					<>
						<div className="mb-6">
							<p className="text-gray-600">
								You have {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
							</p>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{wishlistProducts.map((product) => {
								// Handle image format from backend
								const mainImage = Array.isArray(product.images) && product.images.length > 0
									? (typeof product.images[0] === 'string' 
											? product.images[0] 
											: product.images[0]?.url || "/placeholder.png")
									: "/placeholder.png";
								
								return (
									<div
										key={product.id}
										className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
									>
										{/* Image Container */}
										<div className="relative aspect-square" style={{ backgroundColor: '#F0D5BD' }}>
											<Link href={`/product/${product.id}`}>
												<Image
													src={mainImage}
													alt={product.name}
													fill
													className="object-cover"
												/>
											</Link>
										{/* Remove from Wishlist Button */}
										<button
											onClick={() => removeFromWishlist(product.id)}
											className="absolute top-2 right-2 rounded-full p-2 bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
											aria-label="Remove from wishlist"
										>
											<Trash2 size={16} />
										</button>
									</div>

									{/* Content */}
									<div className="p-4">
										<Link href={`/product/${product.id}`}>
											<h3 className="font-semibold text-sm mb-1 hover:text-primary-gold transition-colors">
												{product.name}
											</h3>
										</Link>
										<p className="font-bold mb-1 text-lg">{formatPrice(product.price)}</p>
										
											{/* Rating */}
											{product.averageRating !== undefined && product.averageRating > 0 && (
												<div className="flex items-center gap-1 mb-3">
													<div className="flex items-center">
														{renderStars(product.averageRating)}
													</div>
													<span className="text-xs text-gray-600 ml-1">{product.averageRating}</span>
												</div>
											)}
											
											{/* Add to Cart Button */}
											<button
												onClick={() => addToCart(product)}
												disabled={!product.inStock}
												className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition-colors text-sm ${
													product.inStock
														? 'bg-yellow-600 hover:bg-yellow-700 text-white'
														: 'bg-gray-300 text-gray-500 cursor-not-allowed'
												}`}
											>
												<ShoppingCart size={14} />
												{product.inStock ? 'Add to cart' : 'Out of Stock'}
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</div>
	);
}

