import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			// Cloudinary - match any subdomain
			{ protocol: 'https', hostname: '**.cloudinary.com' },
			// Placeholder service
			{ protocol: 'https', hostname: 'placehold.co' },
			// Backend server
			{ protocol: 'https', hostname: 'luluartistry-backend.onrender.com' },
			// Catch all onrender subdomains
			{ protocol: 'https', hostname: '**.onrender.com' },
			// Production domain
			{ protocol: 'https', hostname: 'luluartistry.store' },
			{ protocol: 'https', hostname: 'www.luluartistry.store' },
		],
		// Image optimization settings
		minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for immutable images
	}
};

export default nextConfig;
