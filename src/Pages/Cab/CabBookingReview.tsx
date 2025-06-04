import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car } from 'lucide-react';

const CabBookingReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, type } = location.state || {};

    if (!bookingDetails || !type) {
        navigate('/cab');
        return null;
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="flex items-center px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold ml-2">Review Booking</h1>
                </div>
            </div>

            <div className="px-4 py-6">
                {/* Trip Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Pickup</div>
                                <div className="font-medium">{bookingDetails.pickup_location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Drop</div>
                                <div className="font-medium">{bookingDetails.drop_location}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Date</div>
                                <div className="font-medium">{bookingDetails.pickup_date}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Time</div>
                                <div className="font-medium">{bookingDetails.pickup_time}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Passengers</div>
                                <div className="font-medium">{bookingDetails.pax_count} people</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Vehicle */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Selected Vehicle</h2>
                    <div className="flex items-center gap-3">
                        <Car className="w-5 h-5 text-indigo-500" />
                        <div>
                            <div className="font-medium">{bookingDetails.vehicle_name}</div>
                            <div className="text-sm text-gray-500">{bookingDetails.vehicle_type}</div>
                        </div>
                    </div>
                </div>

                {/* Fare Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Fare Details</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Fare</span>
                            <span>{formatPrice(bookingDetails.base_fare)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Taxes & Fees</span>
                            <span>{formatPrice(bookingDetails.taxes)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-semibold">
                                <span>Total Fare</span>
                                <span>{formatPrice(bookingDetails.total_fare)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={() => {
                        // Handle booking confirmation
                        navigate('/cab/confirmation', { state: { bookingDetails, type } });
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-8 py-3 text-lg shadow-md transition"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default CabBookingReview; 