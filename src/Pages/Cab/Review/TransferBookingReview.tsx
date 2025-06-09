import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Clock, Users, Car, Info, CheckCircle2 } from 'lucide-react';
import Navbar from '../../../Components/Navbar';
import { createBooking } from '../../../services/cab';
import { useState } from 'react';

const staticTransferPricingCriteria = [
    'Tolls, parking, permits, and taxes are excluded; to be paid offline.',
    'Night driving (11 PM – 6 AM): ₹200 night fee + ₹100 driver allowance.',
    'Detours due to unforeseen events (e.g., roadblocks, traffic jams): ₹200/hour + ₹18/km.',
    'In case of drop to terminal, 15 minutes of waiting at pickup; ₹50 per additional 15 minutes.',
    'Change in pickup/drop location (town/village/city) may incur additional charges.'
];

const cityTransferTerms = [
    'Free cancellation within 5 minutes of booking confirmation.',
    '₹100 cancellation fee applies after 5 minutes.',
];

const terminalTransferTerms = [
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

const TransferBookingReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, type, userInput } = location.state || {};
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);

    console.log(bookingDetails, type, userInput);
    
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

    const handleCreateBooking = async () => {
        setIsCreatingBooking(true);
        try {
            const bookingData = {
                service_type: bookingDetails.service_type,
                pickup_time_type: bookingDetails.pickup_time_type,
                pickup_location: bookingDetails.pickup_location,
                drop_location: bookingDetails.drop_location,
                car_category_id: bookingDetails.car_category_id,
                pax_count: bookingDetails.pax_count,
                is_ac: bookingDetails.is_ac,
                supplier_id: bookingDetails.supplier_id,
                userInput: {
                    ...userInput,
                    pickup_location: { formatted_address: bookingDetails.pickup_location },
                    drop_location: { formatted_address: bookingDetails.drop_location },
                    estimated_distance: bookingDetails.estimated_distance,
                    estimated_duration: bookingDetails.estimated_duration
                },
                fareDetails: bookingDetails.fareDetails,
                pricingFramework: bookingDetails.pricingFramework
            };

            console.log(bookingData);

            const response = await createBooking(bookingData);
            const bookingId = response.booking?.id;
            if (bookingId) {
                navigate(`/cab/booking/${bookingId}`);
            }
        } catch (error) {
            console.error('Failed to create booking:', error);
            // Handle error (show toast, etc.)
        } finally {
            setIsCreatingBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 mb-16">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center gap-4 border-b">
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold">Review Booking</h1>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
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
                                <div className="font-medium">{bookingDetails.pickup_date || new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' | ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                        {/* <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Time</div>
                                <div className="font-medium">{bookingDetails.pickup_time}</div>
                            </div>
                        </div> */}
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Passengers</div>
                                <div className="font-medium">{userInput?.pax_count}</div>
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
                            <span>{formatPrice(bookingDetails.final_price)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & fees</span>
                            <span>{formatPrice(bookingDetails.final_price * 0.05)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total fare</span>
                            <span>{formatPrice(bookingDetails.final_price * 1.05)}</span>
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

                {/* Pricing Criteria */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Pricing Criteria</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        {staticTransferPricingCriteria.map((term, index) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        {type === 'city' ? cityTransferTerms.map((term, index) => (
                            <li key={index}>{term}</li>
                        )) : terminalTransferTerms.map((section, index) => (
                            <div key={index} className="mb-2">
                                <div className="text-sm font-semibold">{section.title}</div>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 mt-1">
                                    {section.points.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                </div>

                {/* Confirm Booking Button */}
                <button
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                    disabled={isCreatingBooking}
                    onClick={handleCreateBooking}
                >
                    {isCreatingBooking ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
            </div>
            <Navbar />
        </div>
    );
};

export default TransferBookingReview; 