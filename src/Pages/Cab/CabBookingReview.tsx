import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car, Info, CheckCircle2 } from 'lucide-react';
import Navbar from '../../Components/Navbar';

const staticPricingCriteria = [
    'Tolls, parking, permits, and taxes are excluded; to be paid offline.',
    'Night driving (11 PM – 6 AM): ₹200 night fee + ₹100 driver allowance.',
    'Detours due to unforeseen events (e.g., roadblocks, traffic jams): ₹200/hour + ₹18/km.',
    'In case of drop to terminal, 15 minutes of waiting at pickup; ₹50 per additional 15 minutes.',
    'Change in pickup/drop location (town/village/city) may incur additional charges.'
];
const staticTerms = [
    {
        title: 'Pickup from Terminal',
        points: [
            'No cancellations or rescheduling allowed within 24 hours of pickup. Full fare will be charged.',
            'Free cancellation if done earlier than 24 hours.'
        ]
    },
    {
        title: 'Drop to Terminal',
        points: [
            'Free cancellation within 5 minutes of booking confirmation.',
            '₹100 cancellation fee applies after 5 minutes.'
        ]
    }
];

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

            <div className="px-4 py-6 max-w-md mx-auto">
                {/* Trip Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Trip Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-xs text-gray-500">Pickup Location</div>
                                <div className="font-medium text-sm">{bookingDetails.pickup_location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                            <div>
                                <div className="text-xs text-gray-500">Drop Location</div>
                                <div className="font-medium text-sm">{bookingDetails.drop_location}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-xs text-gray-500">Date & Time</div>
                                <div className="font-medium text-sm">{bookingDetails.pickup_date} {bookingDetails.pickup_time}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-xs text-gray-500">Passengers</div>
                                <div className="font-medium text-sm">{bookingDetails.pax_count} Passengers</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ride Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Ride Details</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Estimated Distance</span>
                            <span>{bookingDetails.estimated_distance} km</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Estimated Duration</span>
                            <span>{bookingDetails.estimated_duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Car Category</span>
                            <span>{bookingDetails.car_category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">AC</span>
                            <span>{bookingDetails.ac}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Car Seater</span>
                            <span>{bookingDetails.car_seater}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Operator</span>
                            <span>{bookingDetails.operator}</span>
                        </div>
                    </div>
                </div>

                {/* Fare Breakup */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Fare Breakup</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Base fare</span>
                            <span>{formatPrice(bookingDetails.base_fare)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxes & fees</span>
                            <span>{formatPrice(bookingDetails.taxes)}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold border-t pt-2 mt-2">
                            <span>Total fare</span>
                            <span>{formatPrice(bookingDetails.total_fare)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Payment Method</h2>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                        <span className="inline-block bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></span>
                        <div>
                            <div className="font-medium text-sm">Pay in Cash</div>
                            <div className="text-xs text-gray-500">Pay directly to driver</div>
                        </div>
                    </div>
                </div>

                {/* Pricing Criteria */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Pricing Criteria</h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        {(bookingDetails.pricing_criteria || staticPricingCriteria).map((item: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2"><Info className="w-4 h-4 mt-0.5 text-indigo-400" /> {item}</li>
                        ))}
                    </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-base font-semibold mb-4">Terms & Conditions</h2>
                    <div className="space-y-4">
                        {(bookingDetails.terms || staticTerms).map((section: any, idx: number) => (
                            <div key={idx}>
                                <div className="font-semibold text-sm mb-1">{section.title}</div>
                                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                    {section.points.map((point: string, i: number) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
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
            <Navbar />
        </div>
    );
};

export default CabBookingReview; 