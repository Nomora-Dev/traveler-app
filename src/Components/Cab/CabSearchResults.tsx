import React, { useState } from 'react';
import { MapPin, Users, Clock, Star, Car } from 'lucide-react';

interface CabSearchResultsProps {
    searchResults: any; // Replace with proper type when available
}

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Mini', value: 'Mini' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'AC', value: 'AC' },
];

const CabSearchResults: React.FC<CabSearchResultsProps> = ({ searchResults }) => {
    if (!searchResults) return null;

    const { pickup_location, drop_location, actual_travel_info, available_options } = searchResults;

    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Filtering logic
    const filteredOptions = available_options.filter((option: any) => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'AC') return option.is_ac === 'true';
        return option.car_category_name === selectedFilter;
    });

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
                            <div className="text-sm font-medium text-gray-900">{pickup_location.formatted_address}</div>
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
                                            <button className="text-xs text-indigo-600 hover:underline mt-1">View breakup</button>
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
                >
                    Review Booking
                </button>
            </div>
        </div>
    );
};

export default CabSearchResults; 