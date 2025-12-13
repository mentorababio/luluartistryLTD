"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});

	const router = useRouter();

	const apiBaseRaw = process.env.NEXT_PUBLIC_API_BASE_URL || '';
	const apiBase = apiBaseRaw ? apiBaseRaw.replace(/\/$/, '') : '';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.email || !formData.password) {
			toast.error('Please provide email and password');
			return;
		}

		if (isLogin) {
			try {
				const url = apiBase ? `${apiBase}/auth/login` : '/api/auth/login';
				const res = await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: formData.email, password: formData.password }),
				});

				const data = await res.json();
				if (!res.ok) {
					toast.error(data?.message || 'Login failed');
					return;
				}

				// Save token and navigate
				if (data?.data?.token) {
					localStorage.setItem('token', data.data.token);
				}
				toast.success('Login successful');
				router.push('/');
			} catch (err) {
				toast.error('Network error during login');
			}
			return;
		}

		// Registration
		if (formData.password !== formData.confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		try {
			const url = apiBase ? `${apiBase}/auth/register` : '/api/auth/register';
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: formData.name?.split(' ')[0] || '',
					lastName: formData.name?.split(' ').slice(1).join(' ') || '',
					email: formData.email,
					phone: formData.phone,
					password: formData.password,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				toast.error(data?.message || 'Registration failed');
				return;
			}

			// Store token if returned
			if (data?.data?.token) {
				localStorage.setItem('token', data.data.token);
			}

			toast.success('Account created');
			router.push('/');
		} catch (err) {
			toast.error('Network error during registration');
		}
	};

	return (
		<div className="min-h-screen bg-[#fffaf5] flex items-center justify-center py-16 px-6">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-xl shadow-lg p-8">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-800 mb-2">
							{isLogin ? "Welcome Back" : "Create Account"}
						</h1>
						<p className="text-gray-600">
							{isLogin ? "Sign in to your account" : "Sign up to get started"}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{!isLogin && (
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Full Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required={!isLogin}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your full name"
								/>
							</div>
						)}

						{!isLogin && (
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Phone Number
								</label>
								<input
									type="tel"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									required={!isLogin}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your phone number"
								/>
							</div>
						)}

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									required
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your email"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
								<input
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									required
									className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{!isLogin && (
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Confirm Password
								</label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
									<input
										type={showPassword ? "text" : "password"}
										value={formData.confirmPassword}
										onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
										required={!isLogin}
										className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent"
										placeholder="Confirm your password"
									/>
								</div>
							</div>
						)}

						{isLogin && (
							<div className="flex items-center justify-between">
								<label className="flex items-center">
									<input type="checkbox" className="mr-2" />
									<span className="text-sm text-gray-600">Remember me</span>
								</label>
								<Link href="/forgot-password" className="text-sm text-primary-gold hover:underline">
									Forgot password?
								</Link>
							</div>
						)}

						<button
							type="submit"
							className="w-full bg-primary-gold text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
						>
							{isLogin ? "Sign In" : "Create Account"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-600">
							{isLogin ? "Don't have an account? " : "Already have an account? "}
							<button
								onClick={() => {
									setIsLogin(!isLogin);
								setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
								}}
								className="text-primary-gold font-semibold hover:underline"
							>
								{isLogin ? "Sign Up" : "Sign In"}
							</button>
						</p>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<p className="text-center text-sm text-gray-600 mb-4">Or continue with</p>
						<div className="flex gap-4">
							<button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
								<span className="text-sm font-semibold">Google</span>
							</button>
							<button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
								<span className="text-sm font-semibold">Facebook</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

