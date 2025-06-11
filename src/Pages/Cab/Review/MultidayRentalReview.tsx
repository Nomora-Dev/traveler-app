import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Car, Info, CheckCircle2 } from 'lucide-react';
import Navbar from '../../../Components/Navbar';
import { createBooking } from '../../../services/cab';
import { useState } from 'react';

const multidayPricingCriteria = [
    'Additional charges like toll fees, parking charges, permits, and state taxes are payable separately.',
    'Base fare includes driver and fuel charges for the entire duration.',
    'Driver allowance is charged per night for overnight stays.',
    'Night driving fee applies for trips between 11 PM to 6 AM.',
    'Extra hours beyond the daily limit are charged at ₹500/hour.',
    'Dead return cost applies for one-way trips.',
    'Service valid for both intercity and intracity travel.',
    'For trip extensions, additional days are charged at the same rate.'
];

const multidayTerms = [
    'Free cancellation up to 24 hours before pickup.',
    'No refund for cancellations within 24 hours of pickup.',
    'No refund for early trip completion. Unused days are non-refundable.',
    'Driver accommodation and food expenses are to be borne by the customer.',
    'For trip extensions, additional days must be confirmed at least 24 hours in advance.',
    'In case of vehicle breakdown, we\'ll assist with rescheduling or refund for unused duration.'
];

const MultidayRentalReview = ({ bookingDetails, userInput }: { bookingDetails: any, userInput: any }) => {
    const navigate = useNavigate();
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);

    console.log(bookingDetails, userInput);

    if (!bookingDetails) {
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
        <div className="min-h-screen bg-gray-50 mb-12">
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
                                <div className="text-sm text-gray-500">Start Date</div>
                                <div className="font-medium">{userInput.startDate}, {userInput.startTime}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">End Date</div>
                                <div className="font-medium">{userInput.endDate}, {userInput.endTime}</div>
                            </div>
                        </div>
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
                            <span>Base fare ({bookingDetails.numberOfDays} days)</span>
                            <span>{formatPrice(bookingDetails.pricing.base_price * bookingDetails.numberOfDays)}</span>
                        </div>
                        {bookingDetails.pricing.driver_allowance && (
                            <div className="flex justify-between">
                                <span>Driver allowance ({bookingDetails.numberOfNights} nights)</span>
                                <span>{formatPrice(bookingDetails.pricing.driver_allowance * bookingDetails.numberOfNights)}</span>
                            </div>
                        )}
                        {bookingDetails.pricing.night_driving_fee && (
                            <div className="flex justify-between">
                                <span>Night driving fee</span>
                                <span>{formatPrice(bookingDetails.pricing.night_driving_fee * bookingDetails.numberOfNights)}</span>
                            </div>
                        )}
                        {bookingDetails.pricing.dead_return_cost && (
                            <div className="flex justify-between">
                                <span>Dead return cost</span>
                                <span>{formatPrice(bookingDetails.pricing.dead_return_cost)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Taxes & fees</span>
                            <span>{formatPrice(bookingDetails.pricing.taxes)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total fare</span>
                            <span>{formatPrice(bookingDetails.pricing.final_price)}</span>
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
                        {multidayPricingCriteria.map((term, index) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-white rounded-xl p-4 mb-4">
                    <h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        {multidayTerms.map((term, index) => (
                            <li key={index}>{term}</li>
                        ))}
                    </ul>
                </div>

                {/* Confirm Booking Button */}
                <button
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
                    onClick={handleCreateBooking}
                    disabled={isCreatingBooking}
                >
                    {isCreatingBooking ? 'Creating Booking...' : 'Confirm Booking'}
                </button>
            </div>
            <Navbar />
        </div>
    );
};

export default MultidayRentalReview; 