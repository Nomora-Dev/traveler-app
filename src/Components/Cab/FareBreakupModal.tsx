import React from 'react';
import { Car, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FareBreakupModalProps {
    carDetails: {
        name: string;
        category: string;
        vehicleList?: string[];
        description?: string;
        seatingCapacity?: number;
        ac?: boolean;
    };
    pricing: any;
    userInput?: any;
    onClose: () => void;
    durationInfo?: {
        numberOfDays?: number;
        numberOfNights?: number;
        isRoundTrip?: boolean;
    };
    distanceInfo?: any;
    pricingRules?: string[];
    type: 'hourly' | 'multiday' | 'city';
    bookingDetails: any;
}

const defaultVehicleList = [
    'Hyundai i10',
    'Maruti WagonR',
    'Tata Tiago',
    'Maruti Alto',
];

const defaultPricingRules = [
    'Tolls, parking, permits, and taxes are excluded; to be paid offline.',
    'Night driving (11 PM – 6 AM): ₹200 night fee + ₹100 driver allowance.',
    'Detours due to unforeseen events (e.g., roadblocks, traffic jams): ₹200/hour + ₹18/km.',
    'Change in pickup/drop location (town/village/city) may incur additional charges.'
];

const FareBreakupModal: React.FC<FareBreakupModalProps> = ({ carDetails, pricing, userInput, onClose, durationInfo, distanceInfo, pricingRules, type, bookingDetails }) => {
    const navigate = useNavigate();
    const taxes = Math.round(pricing.tax); // Example: 5% tax
    const numberOfDays = durationInfo?.numberOfDays || 1;
    const numberOfNights = durationInfo?.numberOfNights || 0;
    const isRoundTrip = durationInfo?.isRoundTrip;
    const formatPrice = (price: number) =>
        price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

    console.log(pricing);

    const handleBookNow = () => {
        navigate('/cab/review', {
            state: {
                bookingDetails,
                type,
                userInput,
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-t-xl mt-auto max-h-[90vh] overflow-y-auto shadow-xl w-full max-w-md mx-auto p-6 relative animate-fadeIn">
                <button 
                    className="fixed top-[12vh] right-4 text-gray-400 hover:text-gray-600 z-10" 
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>
                {/* Car Details */}
                <div className="mb-4 rounded-lg bg-gray-100 p-4">
                    <div className="text-lg font-semibold mb-2">Car Details</div>
                    <div className="flex items-center gap-2 mb-2">
                        <Car className="w-5 h-5 text-hero-peach" />
                        <span className="font-semibold text-md text-heading-black">{carDetails.category} Category</span>
                    </div>
                    <div className="text-sm text-text-gray mb-2">
                        {carDetails.description || 'Comfortable car for your ride.'}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {(carDetails.vehicleList || defaultVehicleList).map((v, i) => (
                            <span key={i} className="bg-hero-tertiary px-2 py-1 rounded text-xs">{v}</span>
                        ))}
                    </div>
                    <ul className="text-xs text-text-gray list-disc pl-5 space-y-1">
                        <li>Free cancellation up to 30 minutes before pickup</li>
                        <li>Comfortable seating for {carDetails.seatingCapacity || 4} passengers</li>
                        <li>{carDetails.ac ? 'AC available' : 'Non-AC'}</li>
                    </ul>
                </div>
                {/* Fare Breakup */}
                <div className="mb-4 rounded-lg bg-gray-100 p-4">
                    <div className="font-semibold mb-2">Fare Breakup</div>
                    <div className="text-sm space-y-1">
                        {userInput?.hours ? (
                            <>
                                <div className="flex justify-between">
                                    <span>Base fare ({formatPrice(pricing.base_price)})</span>
                                    <span>{formatPrice(pricing.base_price)}</span>
                                </div>
                                {/* <div className="flex justify-between">
                                    <span>Included kms</span>
                                    <span>{pricing.included_kms * userInput.hours} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price per km</span>
                                    <span>{pricing.price_per_km}/km</span>
                                </div> */}
                                <div className="flex justify-between">
                                    <span>Driver allowance ({formatPrice(pricing.driver_allowance)})</span>
                                    <span>{formatPrice(pricing.driver_allowance)}</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <span>Base fare ({formatPrice(pricing.base_price)} × {numberOfDays} days)</span>
                                    <span>{formatPrice(pricing.base_price * numberOfDays)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Driver allowance ({formatPrice(pricing.driver_allowance)} × {numberOfNights} nights)</span>
                                    <span>{formatPrice(pricing.driver_allowance * numberOfNights)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Night driving fee</span>
                                    <span>{formatPrice(pricing.night_driving_fee * numberOfNights)}</span>
                                </div>
                                {distanceInfo?.extra_hours > 0 && (
                                    <div className="flex justify-between">
                                        <span>Extra Hours</span>
                                        <span>{formatPrice(distanceInfo.extra_hours * pricing.price_per_hour)}</span>
                                    </div>
                                )}
                                {!isRoundTrip && (
                                    <div className="flex justify-between">
                                        <span>Dead Return Cost</span>
                                        <span>{formatPrice(pricing.dead_return_cost)}</span>
                                    </div>
                                )}
                            </>
                        )}
                        <div className="flex justify-between">
                            <span>Taxes & fees (5%)</span>
                            <span>{formatPrice(taxes)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                            <span>Total fare</span>
                            <span>{formatPrice((pricing.final_price || 0))}</span>
                        </div>
                    </div>
                </div>
                {/* Pricing Rules */}
                <div className="mb-4 rounded-lg bg-gray-100 p-4">
                    <div className="font-semibold mb-2">Pricing Rules</div>
                    <ul className="text-xs text-text-gray list-disc pl-5 space-y-1">
                        {(pricingRules || defaultPricingRules).map((rule, idx) => (
                            <li key={idx}>{rule}</li>
                        ))}
                    </ul>
                </div>
                <button 
                    className="w-full py-3 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-base shadow-md hover:bg-hero-green transition mt-2"
                    onClick={handleBookNow}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default FareBreakupModal; 