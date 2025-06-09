import React, { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Star, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CabSearchResultsProps {
    searchResults: any; // Replace with proper type when available
    userInput: any;
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

const CabSearchResults: React.FC<CabSearchResultsProps> = ({ searchResults, userInput }) => {
    if (!searchResults) return null;

    const navigate = useNavigate();
    const { pickup_location, drop_location, actual_travel_info, available_options } = searchResults;

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [breakupIndex, setBreakupIndex] = useState<number | null>(null);

    // Filtering logic
    const filteredOptions = available_options.filter((option: any) => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'AC') return option.is_ac === 'true';
        return option.car_category_name === selectedFilter;
    });

    // Prepare booking details for review screen
    const getBookingDetails = () => {
        if (selectedIndex === null) return null;
        const option = filteredOptions[selectedIndex];
        return {
            pickup_location: pickup_location.formatted_address,
            drop_location: drop_location.formatted_address,
            pax_count: option.seating_capacity,
            estimated_distance: actual_travel_info.distance_km,
            estimated_duration: actual_travel_info.duration,
            car_category: option.car_category_name,
            car_category_id: option.car_category_id,
            ac: option.is_ac === 'true' ? 'AC' : 'Non AC',
            car_seater: option.seating_capacity + ' Seater',

            operator: option.supplier_name,
            final_price: option.calculated_final_price,
            payment_method: 'Pay in Cash',
            
            // Additional data needed for API call
            supplier_id: option.supplier_id,
            service_type: userInput.service_type,
            pickup_time_type: userInput.pickup_time_type,
            
            is_ac: option.is_ac === 'true',
            fareDetails: {
                base_fare: option.base_fare || Math.round(option.calculated_final_price - (option.taxes || 0)),
                taxes: option.taxes || 0,
                total_fare: option.calculated_final_price
            },
            pricingFramework: {
                supplier_id: option.supplier_id,
                car_category_id: option.car_category_id,
                is_ac: option.is_ac === 'true'
            }
        };
    };

    console.log(getBookingDetails());
    console.log(userInput);

    return (
        <div className="bg-white px-6 flex flex-col mb-12">
            {/* Filters and Route Summary */}
            <div className="max-w-2xl mx-auto w-full pt-4 pb-2 sticky top-0 bg-white z-20">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {FILTERS.map(f => (
                        <button
                            key={f.value}
                            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap font-medium transition-all ${selectedFilter === f.value ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setSelectedFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {/* Est. Distance & Time */}
                <div className="flex items-center gap-6 text-base font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span>{actual_travel_info.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{actual_travel_info.duration}</span>
                    </div>
                </div>
                {/* Pickup/Drop Card */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 mb-4 border border-gray-200">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <div>
                            <div className="text-xs text-gray-500">Pickup</div>
                            <div className="text-sm font-medium text-gray-900">{pickup_location.formatted_address || 'Pickup location not found'}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <div>
                            <div className="text-xs text-gray-500">Drop</div>
                            <div className="text-sm font-medium text-gray-900">{drop_location.formatted_address}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Options */}
            <div className="max-w-2xl mx-auto w-full flex-1 pb-4">
                {filteredOptions.length === 0 && (
                    <div className="text-center text-gray-400 py-12">No cabs found for this filter.</div>
                )}
                <div className="flex flex-col gap-4">
                    {filteredOptions.map((option: any, index: number) => {
                        const isSelected = selectedIndex === index;
                        return (
                            <div
                                key={index}
                                className={`relative border rounded-xl p-5 bg-white shadow-sm transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                                onClick={() => setSelectedIndex(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Select indicator */}
                                <div className="absolute left-4 top-4">
                                    <span className={`inline-block w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}`}></span>
                                </div>
                                <div className="ml-8">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-lg text-gray-900">{option.supplier_name}</span>
                                            <span className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <Star className="w-4 h-4" />
                                                {parseFloat(option.supplier_avg_rating).toFixed(1)}
                                                <span className="text-gray-400">({option.supplier_review_count})</span>
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-900">₹{Math.abs(parseFloat(option.calculated_final_price)).toFixed(0)}</span>
                                            <div className="text-xs text-gray-500">Incl. taxes</div>
                                            <button
                                                className="text-xs text-indigo-600 hover:underline mt-1 transition-colors"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setBreakupIndex(index);
                                                }}
                                            >
                                                View breakup
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2 mb-1">
                                        <span className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                            <Car className="w-4 h-4" /> {option.car_category_name}
                                        </span>
                                        {option.is_ac === 'true' && (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                AC
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            <Users className="w-4 h-4" /> {option.seating_capacity} Seats
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {option.car_model_names || 'Car model or similar'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Review Booking Button */}
            <div className="fixed bottom-14 left-0 w-full bg-white border-t border-gray-200 py-4 z-30 flex justify-center">
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-8 py-3 text-lg shadow-md transition"
                    disabled={selectedIndex === null}
                    onClick={() => {
                        const bookingDetails = getBookingDetails();
                        if (bookingDetails) {
                            navigate('/cab/review', {
                                state: {
                                    bookingDetails,
                                    type: userInput.service_type,
                                    userInput: userInput,
                                },
                            });
                        }
                    }}
                >
                    Review Booking
                </button>
            </div>

            {/* Price Breakup Modal */}
            {breakupIndex !== null && (
                <PriceBreakupModal
                    option={filteredOptions[breakupIndex]}
                    onClose={() => setBreakupIndex(null)}
                />
            )}
        </div>
    );
};

export default CabSearchResults; 