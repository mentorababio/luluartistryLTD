const MapSection = () => {
	// To get the correct embed URL for your exact location:
	// 1. Go to https://www.google.com/maps and search for "Unogwu plaza, Marian road, Calabar"
	// 2. Click the "Share" button
	// 3. Select "Embed a map"
	// 4. Copy the iframe src URL and replace the mapEmbedUrl below
	// For now, using a basic embed - replace with your actual embed URL from Google Maps
	const mapEmbedUrl = `https://www.google.com/maps?q=4.9750875,8.3406566&z=15&output=embed`;

	return (
		<div className='bg-white py-12'>
			<div className='max-w-6xl mx-auto px-6'>
				<h2 className='text-2xl md:text-3xl font-bold mb-6 text-dark-gray text-center'>
					Visit Us
				</h2>
				<p className='text-gray-700 mb-8 text-center'>
					Unogwu plaza, Marian road, opposite Trans-Calabar (TCC), Cross River
				</p>
				<div className='rounded-lg overflow-hidden h-96 shadow-lg'>
					<iframe
						src={mapEmbedUrl}
						width="100%"
						height="100%"
						style={{ border: 0 }}
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="w-full h-full"
						title="Lulu Artistry Location Map"
					/>
				</div>
			</div>
		</div>
	);
};

export default MapSection;
