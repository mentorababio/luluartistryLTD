const Waitlist = () => {
	return (
		<div className='flex flex-col items-center justify-center text-center mx-auto max-w-3xl px-6 py-12 bg-gray-50 rounded-2xl shadow-sm'>
			<h2 className='text-2xl md:text-3xl font-bold mb-4 text-gray-900'>
				Glow in your Inbox
			</h2>
			<p className='text-gray-700 mb-6'>
				Be the first to hear about new arrivals, exclusive deals, and
				beauty tips made just for you.
			</p>

			{/* Input + Button */}
			<div className='flex w-full max-w-lg gap-3 mb-4'>
				<input
					type='email'
					placeholder='Enter email address'
					className='flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold'
				/>
				<button className='px-6 py-3 rounded-lg text-white bg-primary-gold hover:bg-yellow-600 transition'>
					Subscribe & Stay Beautiful
				</button>
			</div>

			{/* Disclaimer */}
			<p className='text-xs text-gray-500 max-w-md leading-relaxed'>
				By subscribing, you agree to our{" "}
				<span className='underline cursor-pointer'>
					Privacy Policy
				</span>{" "}
				and consent to receive updates from our company.
			</p>
		</div>
	);
};
export default Waitlist;
