import React, { useState } from 'react';
import { MapPin, Users, Clock, Star, Car, X } from 'lucide-react';
import type { HourlySearchResponse, HourlySupplier, HourlySupplierCategory } from '../../../types/types';
import { useNavigate } from 'react-router-dom';
import FareBreakupModal from '../FareBreakupModal';

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Sedan', value: 'Sedan' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Hatchback', value: 'Hatchback' },
];

interface HourlySearchResultsProps {
    searchResults: HourlySearchResponse['data'];
    userInput: any;
}

const HourlySearchResults: React.FC<HourlySearchResultsProps> = ({ searchResults, userInput }) => {
    const { suppliers, route_info } = searchResults;
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selected, setSelected] = useState<{ supplierId: number; categoryId: string } | null>(null);
    const [breakupIndex, setBreakupIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    // Flatten all categories for filtering
    const allOptions: { supplier: HourlySupplier; category: HourlySupplierCategory }[] = [];
    suppliers.forEach(supplier => {
        Object.values(supplier.categories).forEach(category => {
            allOptions.push({ supplier, category });
        });
    });

    const filteredOptions = allOptions.filter(({ category }) => {
        if (selectedFilter === 'all') return true;
        return category.name === selectedFilter;
    });

    // Prepare booking details for review screen
    const getBookingDetails = () => {
        if (!selected) return null;
        const { supplier, category } = filteredOptions.find(
            ({ supplier, category }) => supplier.id === selected.supplierId && String(category.id) === selected.categoryId
        ) || {};
        if (!supplier || !category) return null;
        const pricing = category.pricing;
        return {
            pickup_location: userInput?.pickup_location || route_info.pickup_location,
            drop_location: userInput?.drop_location || route_info.drop_location,
            pickup_date: userInput?.date || '',
            pickup_time: userInput?.time || '',
            pax_count: userInput?.pax_count || category.seating_capacity,
            estimated_distance: route_info.distance_km,
            estimated_duration: route_info.duration,
            car_category: category.name,
            car_category_id: category.id,
            ac: 'AC', // Hourly rentals typically include AC
            car_seater: category.seating_capacity + ' Seater',
            operator: supplier.name,
            base_fare: pricing.base_price,
            pricing: pricing,
            final_price: pricing.final_price,
            total_fare: pricing.final_price,
            payment_method: 'Pay in Cash',
            
            // Additional data needed for API call
            supplier_id: supplier.id,
            service_type: 'hourly',
            is_ac: true,
            fareDetails: {
                base_fare: pricing.base_price || 0,
                price_per_km: pricing.price_per_km || 0,
                included_kms: pricing.included_kms || 0,
                total_fare: pricing.final_price || 0
            },
            pricingFramework: {
                supplier_id: supplier.id,
                car_category_id: category.id,
                is_ac: true,
                rental_duration: userInput?.rental_duration || 0
            },
            userInput: userInput,
        };
    };

    console.log(userInput);
    console.log(getBookingDetails());

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
                        <span>{route_info.distance_km} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{route_info.duration}</span>
                    </div>
                </div>
                {/* Pickup/Drop Card */}
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2 mb-4 border border-gray-200">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <div>
                            <div className="text-xs text-gray-500">Pickup</div>
                            <div className="text-sm font-medium text-gray-900">{route_info.pickup_location}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <div>
                            <div className="text-xs text-gray-500">Drop</div>
                            <div className="text-sm font-medium text-gray-900">{route_info.drop_location}</div>
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
                    {filteredOptions.map(({ supplier, category }, idx) => {
                        const isSelected = selected && selected.supplierId === supplier.id && selected.categoryId === String(category.id);
                        const pricing = category.pricing;
                        return (
                            <div
                                key={supplier.id + '-' + category.id}
                                className={`relative border rounded-xl p-5 bg-white shadow-sm transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                                onClick={() => setSelected({ supplierId: supplier.id, categoryId: String(category.id) })}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Select indicator */}
                                <div className="absolute left-4 top-4">
                                    <span className={`inline-block w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}`}></span>
                                </div>
                                <div className="ml-8">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-lg text-gray-900">{supplier.name}</span>
                                            <span className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <Star className="w-4 h-4" />
                                                {parseFloat(supplier.avg_rating).toFixed(1)}
                                                <span className="text-gray-400">({supplier.review_count})</span>
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ₹{pricing.final_price !== null ? Math.round(pricing.final_price) : '--'}
                                            </span>
                                            <div className="text-xs text-gray-500">Incl. taxes</div>
                                            <button
                                                className="text-xs text-indigo-600 hover:underline mt-1 transition-colors"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setBreakupIndex(idx);
                                                }}
                                            >
                                                View breakup
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-2 mb-1">
                                        <span className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                            <Car className="w-4 h-4" /> {category.name}
                                        </span>
                                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            <Users className="w-4 h-4" /> {category.seating_capacity} Seats
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-500 mt-2">
                                        ₹ {pricing.price_per_km}/hr | {pricing.included_kms} kms included
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
                    disabled={!selected}
                    onClick={() => {
                        const bookingDetails = getBookingDetails();
                        if (bookingDetails) {
                            navigate('/cab/review', {
                                state: {
                                    bookingDetails,
                                    type: 'hourly',
                                    userInput: userInput,
                                },
                            });
                        }
                    }}
                >
                    Review Booking
                </button>
            </div>

            {/* Fare Breakup Modal */}
            {breakupIndex !== null && (
                <FareBreakupModal
                    carDetails={{
                        name: filteredOptions[breakupIndex].category.name,
                        category: filteredOptions[breakupIndex].category.name,
                        description: 'Comfortable car for your ride.',
                        seatingCapacity: filteredOptions[breakupIndex].category.seating_capacity,
                    }}
                    pricing={filteredOptions[breakupIndex].category.pricing}
                    userInput={userInput}
                    onClose={() => setBreakupIndex(null)}
                    type="hourly"
                    bookingDetails={getBookingDetails()}
                />
            )}
        </div>
    );
};

export default HourlySearchResults; 