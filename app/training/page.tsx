"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, GraduationCap, Calendar, Check, MapPin, Phone, Mail, Clock } from "lucide-react";
import { lulu, lash, brows, nails, tatoo } from "@/assets";
import OmbrePowder from "@/assets/images/booking/OmbrePowderBrow.png";
import signaturecombo from "@/assets/images/booking/SinatureComboBrows.png";
import microshading from "@/assets/images/booking/Microshading.png";
import browlamination from "@/assets/images/booking/Brow lamination.png";
import browtouchup from "@/assets/images/booking/Brow Touch-up.png";
import classicset from "@/assets/images/booking/Classic set.png";
import hybridset from "@/assets/images/booking/Hybrid.png";
import volumeset from "@/assets/images/booking/Volume set.png";
import megavolumeset from "@/assets/images/booking/Mega Volume set.png";
import bottomlash from "@/assets/images/booking/BottonLashes.png";
import wispy from "@/assets/images/booking/Wispy.png";
import aleks from "@/assets/images/booking/Aleks set.png";
import dollyset from "@/assets/images/booking/Dolly set.png";
import flityeye from "@/assets/images/booking/Flirty fox eye.png";
import Eb from "@/assets/images/booking/EB.png";
import privatebrowtraining from "@/assets/images/booking/PrivateBrowTraining.png";
import groupbrowtraining from "@/assets/images/booking/GroupBrowTraining.png";
import privatelashtraining from "@/assets/images/booking/PrivateLashTraining.png";
import grouplashtraining from "@/assets/images/booking/GroupLashTraining.png";
import combotraining from "@/assets/images/booking/Private Combo.png";
import groupcombotraining from "@/assets/images/booking/GroupCombo.png";
import lamination from "@/assets/images/booking/PrivateBrowLamination.png";


const TrainingPage = () => {
	const router = useRouter();
	const [activeFilter, setActiveFilter] = useState("all");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		course: "",
		date: "",
		time: "",
		notes: ""
	});

	const trainingCourses = [
		{
			id: "Ombré Powder Brows",
			name: "Ombré Powder Brows",
			category: "brows",
			image: OmbrePowder,
			description: "Soft, powdered brow technique for a natural gradient effect.",
			price: 700000,
		},
		{
			id: "Signature Combo Brows",
			name: "Signature Combo Brows",
			category: "brows",
			image: signaturecombo,
			description: "Combination of microblading and shading for fuller, defined brows",
			price: 80000,
		},
		{
			id: "Microshading",
			name: "Microshading",
			category: "brows",
			image: microshading,
			description: "Precise dot technique creating soft, natural-looking brows",
			price: 70000,
		},
		{
			id: "Brow Lamination & Tint",
			name: "Brow Lamination",
			category: "brows",
			image: browlamination,
			description: "Lift, shape and tint your natural brows for a fuller look",
			price: 40000,
		},
		{
			id: "Brow Touch-up (All Types)",
			name: "Brow Touch-up",
			category: "brows",
			image: browtouchup,
			description: "Maintenance session for existing brow treatments",
			price: 60000,
		},
		{
			id: "Classic Set",
			name: "Classic Set",
			category: "lashes",
			image: classicset,
			description: "One-to-one lash extension for natural enhancement",
			price: 20000,
		},
		{
			id: "Hybrid Set",
			name: "Hybrid Set",
			category: "lashes",
			image: hybridset,
			description: "Mix of classic and volume techniques for textured look",
			price: 25000,
		},
		{
			id: "Volume Set",
			name: "Volume Set",
			category: "lashes",
			image: volumeset,
			description: "Volume lashes for a dramatic, full look.",
			price: 1200000,
		},
		{
			id: " MegaVolume Set",
			name: " Mega Volume Set",
			category: "lashes",
			image: megavolumeset,
			description: "Ultra-lightweight fans for maximum drama and fullness",
			price: 40000,
		},
		{
			id: " Bottom Lashes",
			name: " Bottom Lashes",
			category: "lashes",
			image: bottomlash,
			description: "Lower lash line enhancement for complete eye framing",
			price: 10000,
		},
		{
			id: " Wispy Add-On",
			name: " Wispy Set",
			category: "lashes",
			image: wispy,
			description: "Extra texture and movement for natural, wispy effect",
			price: 8000,
		},
		{
			id: " The Aleks Set",
			name: " Alek's Set",
			category: "Signature Collection",
			image: aleks,
			description: "Ultra-lightweight fans for maximum drama and fullness",
			price: 50000,
		},
		{
			id: " Dolly Set",
			name: " Dolly Set",
			category: "Signature Collection",
			image: dollyset,
			description: "Wide-Eye Doll Look - innocent yet glamorous",
			price: 66000,
		},
		{
			id: " Flirty Fox Eye",
			name: " Flirty Fox Eye",
			category: "Signature Collection",
			image: flityeye,
			description: "Winged Cat-Eye Glam - sultry and sophisticated",
			price: 40000,
		},
		{
			id: " The Eb Luxe Set",
			name: " The Eb Luxe Set",
			category: "Signature Collection",
			image: Eb,
			description: "Exclusive Lulu Design - unique premium styling",
			price: 40000,
		},
		{
			id: " Private Brow Training",
			name: " Private Brow Training",
			category: "Training Academy",
			image: privatebrowtraining,
			description: "Intensive 3-day one-on-one brow technique mastery",
			price: 400000,
		},
		{
			id: "Group Brow Training",
			name: " Group Brow Training",
			category: "Training Academy",
			image: groupbrowtraining,
			description: "Comprehensive 3-day group brow certification program",
			price: 300000,
		},
		{
			id: " Private Lash Training",
			name: " Private Lash Training",
			category: "Training Academy",
			image: privatelashtraining,
			description: "Exclusive 3-day individual lash extension training",
			price: 300000,
		},
		{
			id: " Group Lash Training",
			name: "Group Lash Training",
			category: "Training Academy",
			image: grouplashtraining,
			description: "Complete 3-day group lash extension certification",
			price: 200000,
		},
		{
			id: " Private Combo Lash + Brow Training",
			name: "Private Combo Lash + Brow Training",
			category: "Training Academy",
			image: combotraining,
			description: "Comprehensive 5-day individual mastery program",
			price: 650000,
		},
		{
			id: " Group Combo Lash + Brow Training",
			name: "Group Combo Lash + Brow Training",
			category: "Training Academy",
			image: groupcombotraining,
			description: "Complete 5-day group certification in both techniques",
			price: 450000,
		},
		{
			id: "Private Brow Lamination & Tint Training",
			name: "Private Combo Lash + Brow Training",
			category: "Training Academy",
			image: lamination,
			description: "Intensive 2-day individual lamination mastery",
			price: 150000,
		},
	];

	const categories = ["all", "brows", "lashes", "Signature Collection", "Training Academy"];
	
	const filteredCourses = activeFilter === "all" 
		? trainingCourses 
		: trainingCourses.filter(course => course.category === activeFilter);

	const formatPrice = (price: number) => {
		return `₦${price.toLocaleString('en-NG')}`;
	};

	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="bg-[#4a4a4a] text-white py-20">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">
						Professional Training - Lulu's Artistry
					</h1>
					<p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
					Premium Brows & Lashes Services • Expert Artists • Training Academy
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href="#appointment"
							className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg transition-colors"
						>
							Book Training
						</Link>
						<Link
							href="/book-session"
							className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold py-3 px-8 rounded-lg transition-colors"
						>
							View Services
						</Link>
					</div>
				</div>
			</section>

			{/* Our Training Programs Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Training Programs</h2>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Comprehensive training programs designed to help you master professional beauty techniques.
						</p>
					</div>

					{/* Filter Tabs */}
					<div className="flex flex-wrap justify-center gap-4 mb-12">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => setActiveFilter(category)}
								className={`px-6 py-2 rounded-full font-semibold transition-colors ${
									activeFilter === category
										? "bg-yellow-500 text-black"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								{category.charAt(0).toUpperCase() + category.slice(1)}
							</button>
						))}
					</div>

					{/* Training Cards Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{filteredCourses.map((course) => (
							<div
								key={course.id}
								className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
							>
								<div className="relative h-48">
									<Image
										src={course.image}
										alt={course.name}
										fill
										className="object-cover"
									/>
									<div className="absolute top-4 left-4">
										<span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
											{course.category.charAt(0).toUpperCase() + course.category.slice(1)}
										</span>
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
									<p className="text-gray-600 text-sm mb-4">{course.description}</p>
									<div className="flex items-center justify-between">
										<span className="text-2xl font-bold text-yellow-500">
											{formatPrice(course.price)}
										</span>
										<Link
											href={`/book-session/appointment?service=${course.id}&type=training`}
											className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
										>
											Book Now
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* About Training Section */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
								About Our Training Programs
							</h2>
							<p className="text-gray-600 leading-relaxed mb-4">
								Our professional training programs are designed to provide hands-on experience and comprehensive knowledge in various beauty techniques. Whether you're a beginner or looking to advance your skills, we have courses tailored to your needs.
							</p>
							<p className="text-gray-600 leading-relaxed mb-6">
								All our training programs include certification upon completion, comprehensive course materials, and ongoing support from our expert instructors.
							</p>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
									<p className="text-gray-700">Certified instructors with years of experience</p>
								</div>
								<div className="flex items-center gap-3">
									<Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
									<p className="text-gray-700">Hands-on practice with real clients</p>
								</div>
								<div className="flex items-center gap-3">
									<Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
									<p className="text-gray-700">Comprehensive course materials included</p>
								</div>
								<div className="flex items-center gap-3">
									<Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
									<p className="text-gray-700">Ongoing support after training</p>
								</div>
								<div className="flex items-center gap-3">
									<Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
									<p className="text-gray-700">Certification upon completion</p>
								</div>
							</div>
						</div>
						<div className="relative h-96 rounded-lg overflow-hidden">
							<Image
								src={lulu}
								alt="Training Programs"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Book Training Section */}
			<section id="appointment" className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Book Your Training</h2>
						<p className="text-gray-600">
							Fill out the form below to schedule your training session with us.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Training Form */}
						<div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
							<h3 className="text-2xl font-bold text-gray-800 mb-6">Training Details</h3>
							<form 
								onSubmit={(e) => {
									e.preventDefault();
									if (formData.course) {
										router.push(`/book-session/appointment?service=${encodeURIComponent(formData.course)}&type=training`);
									} else {
										// Scroll to top if no course selected
										window.scrollTo({ top: 0, behavior: 'smooth' });
									}
								}}
								className="space-y-6"
							>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => setFormData({ ...formData, name: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your full name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
									<input
										type="email"
										value={formData.email}
										onChange={(e) => setFormData({ ...formData, email: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your email"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
									<input
										type="tel"
										value={formData.phone}
										onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Enter your phone number"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Training Course</label>
									<select 
										value={formData.course}
										onChange={(e) => setFormData({ ...formData, course: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
									>
										<option value="">Select Training Course</option>
										{trainingCourses.map((course) => (
											<option key={course.id} value={course.id}>
												{course.name}
											</option>
										))}
									</select>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
										<input
											type="date"
											value={formData.date}
											onChange={(e) => setFormData({ ...formData, date: e.target.value })}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
										<input
											type="time"
											value={formData.time}
											onChange={(e) => setFormData({ ...formData, time: e.target.value })}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Other Notes</label>
									<textarea
										rows={4}
										value={formData.notes}
										onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
										placeholder="Any additional notes or questions..."
									/>
								</div>
								<button
									type="submit"
									className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-6 rounded-lg transition-colors"
								>
									Book Training
								</button>
							</form>
						</div>

						{/* Studio Information Card */}
						<div className="bg-yellow-500 rounded-xl p-8 text-black">
							<h3 className="text-2xl font-bold mb-6">Lulu's Beauty Studio</h3>
							<div className="space-y-4 mb-8">
								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
									<p className="text-sm">123 Beauty Lane, Suite 456, Lagos, Nigeria</p>
								</div>
								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 mt-1 flex-shrink-0" />
									<p className="text-sm">+234 801 234 5678</p>
								</div>
								<div className="flex items-start gap-3">
									<Mail className="w-5 h-5 mt-1 flex-shrink-0" />
									<p className="text-sm">info@luluartistry.ng</p>
								</div>
								<div className="flex items-start gap-3">
									<Clock className="w-5 h-5 mt-1 flex-shrink-0" />
									<p className="text-sm">Mon-Fri: 9 AM - 6 PM<br />Sat: 10 AM - 4 PM</p>
								</div>
							</div>
							<div className="border-t border-black/20 pt-6">
								<h4 className="font-bold mb-2">Training Policy</h4>
								<p className="text-sm opacity-90">
									All training programs require advance booking. A deposit is required to secure your spot. Course materials and certification are included in the price. Cancellations must be made at least 7 days in advance.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default TrainingPage;
