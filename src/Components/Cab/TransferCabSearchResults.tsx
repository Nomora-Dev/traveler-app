import React, { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Star, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransferCabSearchResultsProps {
    searchResults: any;
    mode?: 'pickup' | 'drop';
}

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Mini', value: 'Mini' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'AC', value: 'AC' },
];

const vehicleCategoryDescriptions: Record<string, { title: string, desc: string }> = {
    'Hatchback': {
        title: 'Hatchback Category',
        desc: 'Compact and economical cars, ideal for short city rides'
    },
    'Sedan': {
        title: 'Sedan Category',
        desc: 'Comfortable mid-size cars with ample luggage space'
    },
    'SUV': {
        title: 'SUV Category',
        desc: 'Spacious and powerful vehicles for rough terrain and long journeys'
    },
    'Prime SUV': {
        title: 'Prime SUV Category',
        desc: 'Luxury SUVs offering premium comfort and advanced features'
    }
};

const PriceBreakupModal = ({ option, onClose }: { option: any, onClose: () => void }) => {
    // Disable background scroll when modal is open
    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40 transition-opacity animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-t-xl mt-auto max-h-[90vh] h-[90vh] overflow-y-auto shadow-xl w-full max-w-md mx-auto relative animate-slideUp"
                onClick={e => e.stopPropagation()}
            >
                {/* Fixed Close Button */}
                <button
                    className="fixed top-[12vh] right-4 text-gray-400 hover:text-gray-600 text-2xl transition-transform hover:scale-125 z-10 bg-white/80 rounded-full p-1"
                    // style={{ right: 'max(1rem,calc(50vw - 200px))' }}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="px-6 pt-10 pb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Fare Details</h2>

                    <div className="border-t border-gray-200 my-4" />

                    {/* Car Details by Category */}
                    <div className="mb-5 gap-2 rounded-lg bg-gray-100 p-4">
                        <div className="text-xl  flex justify-between font-semibold text-gray-700 mb-2">
                            Car details
                            <Car className="w-4 h-4" color="blue" />
                        </div>
                        <div className="font-semibold text-gray-800 mb-1">
                            {option.car_category_name}
                        </div>
                        <div className="text-sm text-gray-700 mb-2">
                            {vehicleCategoryDescriptions[option.car_category_name]?.desc}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {option.vehicle_list.map((vehicle: any) => (
                                <span
                                    key={vehicle.model}
                                    className="text-xs bg-gray-100 border border-gray-300 rounded-full px-3 py-1 text-gray-700"
                                >
                                    {vehicle}
                                </span>
                            ))}
                        </div>
                        <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
                            <li>Free cancellation up to 1 hour before pickup</li>
                            <li>Spacious luggage compartment (3 large bags)</li>
                            <li>Well-maintained, clean vehicles</li>
                        </ul>
                    </div>

                    {/* Fare Breakdown */}
                    <div className="mb-4 rounded-lg bg-gray-100 p-4">
                        <div className="font-semibold mb-1 text-gray-800">Fare Breakup</div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Base fare</span>
                            <span>₹{option.base_fare || Math.round(option.calculated_final_price - (option.taxes || 0))}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Taxes</span>
                            <span>₹{option.taxes || 0}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base mt-2">
                            <span>Total fare</span>
                            <span>₹{option.calculated_final_price}</span>
                        </div>
                    </div>

                    {/* Pricing Criteria */}
                    <div className="text-xs rounded-lg bg-gray-100 p-4 mt-4">
                        <div className="text-lg font-semibold mb-1 text-gray-800">Pricing Criteria</div>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Tolls, parking, permits, and taxes are excluded; to be paid offline.</li>
                            <li>Night driving (11 PM – 6 AM): ₹200 night fee + ₹100 driver allowance.</li>
                            <li>Detours: ₹200/hour + ₹18/km for unforeseen events (roadblocks, jams).</li>
                            <li>Drop to terminal: 15 min waiting at pickup; ₹50 per additional 15 min.</li>
                            <li>Change in pickup/drop location may incur additional charges.</li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 my-4" />

                    <div className="flex justify-center mt-4">
                        <button className="bg-indigo-600 text-white w-full py-4 rounded-md font-medium">
                            Book now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransferCabSearchResults: React.FC<TransferCabSearchResultsProps> = ({ searchResults, mode }) => {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleSelect = (cab: any) => {
        navigate('/cab/review', {
            state: {
                bookingDetails: {
                    ...cab,
                    mode
                },
                type: mode ? 'terminal' : 'city'
            }
        });
    };

    return (
        <div className="px-4 py-6">
            {searchResults.map((cab: any, index: number) => (
                <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-4 mb-4 cursor-pointer hover:border-hero-peach transition"
                    onClick={() => handleSelect(cab)}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                            <Car className="w-6 h-6 text-hero-peach mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">{cab.vehicle_name}</h3>
                                <p className="text-sm text-gray-500">{cab.vehicle_type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-semibold text-lg">{formatPrice(cab.total_fare)}</div>
                            <div className="text-sm text-gray-500">Total Fare</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{cab.pax_count} seats</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{cab.estimated_time} mins</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TransferCabSearchResults; 