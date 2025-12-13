import BookingForm from "@/components/interactive/BookingForm";
import MapSection from "@/components/common/MapSection";

const BookingPage = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Book Your Session
            </h1>
            <p className="text-gray-600 text-lg">
              Schedule your appointment with Lulu&apos;s Artistry. 
              We&apos;ll create something beautiful together.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <BookingForm />
          </div>
        </div>
      </div>
      <MapSection />
    </>
  );
};

export default BookingPage;
