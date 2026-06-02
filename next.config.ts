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
			{ protocol: 'https', hostname: 'res.cloudinary.com' },
			{ protocol: 'https', hostname: 'placehold.co' },
			{ protocol: 'https', hostname: 'luluartistry-backend.onrender.com' }
		],
		qualities: [75, 90],
	}
};

export default nextConfig;
