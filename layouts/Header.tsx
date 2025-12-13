"use client";

import { cart, login, logo, search, wishlist } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search as SearchIcon, Menu, X } from "lucide-react";

interface HeaderProps {
	onToggleMenu?: () => void;
	isMenuOpen?: boolean;
}

const Header = ({ onToggleMenu, isMenuOpen }: HeaderProps) => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [cartCount, setCartCount] = useState(0);
	const [wishlistCount, setWishlistCount] = useState(0);

	useEffect(() => {
		// Load cart count
		const updateCartCount = () => {
			const savedCart = localStorage.getItem("cart");
			if (savedCart) {
				const cartItems = JSON.parse(savedCart);
				const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
				setCartCount(totalItems);
			} else {
				setCartCount(0);
			}
		};

		// Load wishlist count
		const updateWishlistCount = () => {
			const savedWishlist = localStorage.getItem("wishlist");
			if (savedWishlist) {
				const wishlistItems = JSON.parse(savedWishlist);
				setWishlistCount(wishlistItems.length);
			} else {
				setWishlistCount(0);
			}
		};

		// Initial load
		updateCartCount();
		updateWishlistCount();

		// Listen for storage changes (when items are added/removed in other tabs)
		const handleStorageChange = () => {
			updateCartCount();
			updateWishlistCount();
		};

		window.addEventListener("storage", handleStorageChange);

		// Also update on focus (when user switches back to tab)
		const handleFocus = () => {
			updateCartCount();
			updateWishlistCount();
		};

		window.addEventListener("focus", handleFocus);

		// Poll for changes (in case localStorage is updated in same tab)
		const interval = setInterval(() => {
			updateCartCount();
			updateWishlistCount();
		}, 500);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("focus", handleFocus);
			clearInterval(interval);
		};
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
			setSearchQuery("");
			setShowMobileSearch(false);
		}
	};

	const handleLogoClick = () => {
		router.push("/");
	};

	return (
		<div className='relative flex items-center justify-between p-4 border-b border-gray-300 md:px-10 bg-white'>
			{/* Logo */}
			<Image
				src={logo}
				alt='logo'
				width={120}
				height={40}
				className='object-cover cursor-pointer w-[90px] sm:w-[110px] md:w-[120px]'
				onClick={handleLogoClick}
			/>

			{/* Desktop Search */}
			<form onSubmit={handleSearch} className='hidden sm:flex border border-gray-400 rounded-2xl px-3 py-2 items-center gap-2 flex-1 mx-4 max-w-xs md:max-w-md lg:max-w-lg'>
				<Image
					src={search}
					alt='search'
					width={20}
					height={20}
					className='object-cover'
				/>
				<input
					type='text'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='outline-none border-none w-full text-sm'
					placeholder='Search products...'
				/>
			</form>

			{/* Icons */}
			<div className='flex items-center gap-3 sm:gap-4'>
				{/* Mobile Menu Toggle */}
				{onToggleMenu && (
					<button
						onClick={onToggleMenu}
						className='sm:hidden p-2 rounded-full border border-gray-200'
						aria-label='Toggle menu'
					>
						{isMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
					</button>
				)}
				{/* Mobile Search Icon */}
				<button
					onClick={() => setShowMobileSearch(!showMobileSearch)}
					className='sm:hidden'
					aria-label='Search'
				>
					<SearchIcon className='w-5 h-5' />
				</button>

				{/* Wishlist */}
				<Link href='/wishlist' className='cursor-pointer relative'>
					<Image
						src={wishlist}
						alt='wishlist'
						className='w-5 h-5 sm:w-6 sm:h-6'
					/>
					{wishlistCount > 0 && (
						<span className='absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
							{wishlistCount > 99 ? '99+' : wishlistCount}
						</span>
					)}
				</Link>

				{/* Cart */}
				<Link href='/cart' className='cursor-pointer relative'>
					<Image
						src={cart}
						alt='cart'
						className='w-5 h-5 sm:w-6 sm:h-6'
					/>
					{cartCount > 0 && (
						<span className='absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
							{cartCount > 99 ? '99+' : cartCount}
						</span>
					)}
				</Link>

				{/* Login */}
				<Link href='/login' className='cursor-pointer'>
					<Image
						src={login}
						alt='login'
						className='w-5 h-5 sm:w-6 sm:h-6'
					/>
				</Link>
			</div>

			{/* Mobile Search Bar */}
			{showMobileSearch && (
				<div className='absolute top-full left-0 right-0 bg-white border-b border-gray-300 p-4 sm:hidden z-50'>
					<form onSubmit={handleSearch} className='flex border border-gray-400 rounded-2xl px-3 py-2 items-center gap-2'>
						<Image
							src={search}
							alt='search'
							width={20}
							height={20}
							className='object-cover'
						/>
						<input
							type='text'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='outline-none border-none w-full text-sm'
							placeholder='Search products...'
							autoFocus
						/>
						<button
							type='button'
							onClick={() => {
								setShowMobileSearch(false);
								setSearchQuery("");
							}}
							className='text-gray-500'
						>
							✕
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Header;
