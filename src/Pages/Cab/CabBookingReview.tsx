import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car, Info, CheckCircle2 } from 'lucide-react';
import Navbar from '../../Components/Navbar';
import FareBreakupModal from '../../Components/Cab/FareBreakupModal';

const staticTransferPricingCriteria = [
    'Tolls, parking, permits, and taxes are excluded; to be paid offline.',
    'Night driving (11 PM – 6 AM): ₹200 night fee + ₹100 driver allowance.',
    'Detours due to unforeseen events (e.g., roadblocks, traffic jams): ₹200/hour + ₹18/km.',
    'In case of drop to terminal, 15 minutes of waiting at pickup; ₹50 per additional 15 minutes.',
    'Change in pickup/drop location (town/village/city) may incur additional charges.'
];
const staticTransferTerms = [
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

const pricingInfo = {
    pricingCriteria: [
        'Additional charges like toll fees, parking charges, permits, and state taxes are payable separately.',
        'Base Fare: ₹249/hour with complimentary 30 km travel distance',
        'Additional hours charged at ₹500/hour, calculated in 30-minute blocks',
        'Additional distance beyond 30 km charged at ₹18/km',
        'Initial waiting time of 10 minutes is free, post which trip timer starts',
        '10-minute grace period at trip end, post which hourly charges apply',
        'Night charges of ₹200 applicable between 11 PM to 6 AM',
        'Additional driver allowance of ₹300 for night trips (11 PM to 6 AM)'
    ],
    termsAndConditions: [
        'Free cancellation within 5 (on-demand) minutes or 1 hour (scheduled rides) before pickup. ₹100 cancellation fee applies thereafter.',
        'Free rescheduling up to 1 hour prior. ₹100 fee thereafter.',
        'No refund for early trip completion. Unused time or kilometers are non-refundable.',
        'Service valid only within city/town limits. Intercity/town or terminal trips have different pricing.',
        'For trip extensions, partial hours are rounded up to the next half hour.',
        'In case of vehicle breakdown, we\'ll assist with rescheduling or refund for unused duration.'
    ]
};

const CabBookingReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, type, userInput } = location.state || {};

    if (!bookingDetails || !type) {
        navigate('/cab');
        return null;
    }

    console.log(bookingDetails);

    const paxCount = userInput?.pax_count || bookingDetails.pax_count;

    const pricing = bookingDetails.pricing;

    console.log(pricing);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-12">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b">
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">Review Booking</h1>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Trip Details */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Pickup</div>
                                <div className="font-medium">{bookingDetails.pickup_location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Drop</div>
                                <div className="font-medium">{bookingDetails.drop_location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Date</div>
                                <div className="font-medium">{bookingDetails.pickup_date}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Time</div>
                                <div className="font-medium">{bookingDetails.pickup_time}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Passengers</div>
                                <div className="font-medium">{bookingDetails.pax_count}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ride Details */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Ride Details</h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Car className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Car Category</div>
                                <div className="font-medium">{bookingDetails.car_category}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Seating Capacity</div>
                                <div className="font-medium">{bookingDetails.car_seater}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Operator</div>
                                <div className="font-medium">{bookingDetails.operator}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fare Breakup */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Fare Breakup</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Base fare</span>
                            <span>{formatPrice(pricing.base_price)}</span>
                        </div>
                        {pricing.driver_allowance && (
                            <div className="flex justify-between">
                                <span>Driver allowance</span>
                                <span>{formatPrice(pricing.driver_allowance)}</span>
                            </div>
                        )}
                        {pricing.tax && (
                            <div className="flex justify-between">
                                <span>Taxes & fees</span>
                                <span>{formatPrice(pricing.tax)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total fare</span>
                            <span>{formatPrice(pricing.final_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{bookingDetails.payment_method}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Pricing Criteria</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        {pricingInfo.pricingCriteria.map((term: any, index: number) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>
                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        {pricingInfo.termsAndConditions.map((term: any, index: number) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>

                {/* Confirm Booking Button */}
                <button
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-indigo-700 transition"
                    onClick={() => {
                        // Handle booking confirmation
                        navigate('/cab/confirmation', {
                            state: {
                                bookingDetails,
                                type,
                                userInput,
                            },
                        });
                    }}
                >
                    Confirm Booking
                </button>
            </div>
            <Navbar />
        </div>
    );
};

export default CabBookingReview; 