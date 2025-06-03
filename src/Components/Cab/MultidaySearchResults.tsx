import React, { useState } from 'react';
import { Car, Star, Phone, Clock, MapPin, ChevronRight } from 'lucide-react';
import type { MultidaySearchResponse } from '../../types/types';

const FILTERS = ['All', 'Sedan', 'SUV', 'Hatchback'];

interface MultidaySearchResultsProps {
    searchResults: MultidaySearchResponse['data'];
    tripDetails: {
        startDate: string;
        endDate: string;
        isRoundTrip: boolean;
    };
}

const MultidaySearchResults: React.FC<MultidaySearchResultsProps> = ({ searchResults, tripDetails }) => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedOption, setSelectedOption] = useState<{
        supplierId: number;
        categoryId: string;
    } | null>(null);

    // Calculate trip duration
    const startDate = new Date(tripDetails.startDate);
    const endDate = new Date(tripDetails.endDate);
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const numberOfNights = numberOfDays - 1;

    // Flatten supplier categories for filtering
    const allCategories = searchResults.suppliers.flatMap(supplier =>
        Object.entries(supplier.categories).map(([categoryId, category]) => ({
            supplier,
            categoryId,
            category
        }))
    );

    // Filter categories based on selected filter
    const filteredCategories = selectedFilter === 'All'
        ? allCategories
        : allCategories.filter(({ category }) => 
            category.name.toLowerCase().includes(selectedFilter.toLowerCase())
        );

    const handleOptionSelect = (supplierId: number, categoryId: string) => {
        setSelectedOption({ supplierId, categoryId });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDuration = (hours: number) => {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return `${wholeHours}h ${minutes}m`;
    };

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                            selectedFilter === filter
                                ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow'
                                : 'bg-gray-100 text-gray-600'
                        }`}
                        onClick={() => setSelectedFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Trip Duration */}
            <div className="bg-hero-tertiary rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-icon-color" />
                        <span className="text-heading-black font-medium">Trip Duration</span>
                    </div>
                    <span className="text-text-gray">{numberOfDays} Days, {numberOfNights} Nights</span>
                </div>
            </div>

            {/* Pickup & Drop */}
            <div className="mb-6">
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-hero-peach" />
                        <div className="w-0.5 h-12 bg-primary-stroke" />
                        <div className="w-3 h-3 rounded-full bg-hero-green" />
                    </div>
                    <div className="flex-1">
                        <div className="text-sm text-heading-black font-medium mb-1">
                            {searchResults.route_info.pickup_location}
                        </div>
                        <div className="text-sm text-text-gray mb-4">
                            {searchResults.route_info.distance_km.toFixed(1)} km • {searchResults.route_info.duration}
                        </div>
                        <div className="text-sm text-heading-black font-medium">
                            {searchResults.route_info.drop_location}
                        </div>
                    </div>
                </div>
            </div>

            {/* Available Options */}
            <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                    <div className="text-center text-text-gray py-8">
                        No cabs found for the selected filter
                    </div>
                ) : (
                    filteredCategories.map(({ supplier, categoryId, category }) => (
                        <div
                            key={`${supplier.id}-${categoryId}`}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                selectedOption?.supplierId === supplier.id && selectedOption?.categoryId === categoryId
                                    ? 'border-hero-peach shadow-md'
                                    : 'border-primary-stroke hover:border-hero-peach'
                            }`}
                            onClick={() => handleOptionSelect(supplier.id, categoryId)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-heading-black">{category.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-text-gray">
                                        <Car className="w-4 h-4" />
                                        <span>{category.seating_capacity} Seater</span>
                                        {supplier.avg_rating && (
                                            <>
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>{supplier.avg_rating} ({supplier.review_count})</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-semibold text-heading-black">
                                        {formatPrice(category.pricing.final_price)}
                                    </div>
                                    <div className="text-sm text-text-gray">Total Price</div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="text-sm text-text-gray space-y-1 mb-3">
                                <div className="flex justify-between">
                                    <span>Base Rate ({numberOfDays} days)</span>
                                    <span>{formatPrice(category.pricing.base_price * numberOfDays)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Driver Allowance ({numberOfNights} nights)</span>
                                    <span>{formatPrice(category.pricing.driver_allowance * numberOfNights)}</span>
                                </div>
                                {category.pricing.night_driving_fee > 0 && (
                                    <div className="flex justify-between">
                                        <span>Night Driving Fee</span>
                                        <span>{formatPrice(category.pricing.night_driving_fee * numberOfNights)}</span>
                                    </div>
                                )}
                                {category.distance_info.extra_kms > 0 && (
                                    <div className="flex justify-between">
                                        <span>Extra KMs ({category.distance_info.extra_kms} km)</span>
                                        <span>{formatPrice(category.distance_info.extra_kms * category.pricing.price_per_km)}</span>
                                    </div>
                                )}
                                {category.distance_info.extra_hours > 0 && (
                                    <div className="flex justify-between">
                                        <span>Extra Hours ({formatDuration(category.distance_info.extra_hours)})</span>
                                        <span>{formatPrice(category.distance_info.extra_hours * category.pricing.price_per_hour)}</span>
                                    </div>
                                )}
                                {!tripDetails.isRoundTrip && (
                                    <div className="flex justify-between">
                                        <span>Dead Return Cost</span>
                                        <span>{formatPrice(category.pricing.dead_return_cost)}</span>
                                    </div>
                                )}
                            </div>

                            {supplier.phone_number && (
                                <div className="flex items-center gap-2 text-sm text-text-gray">
                                    <Phone className="w-4 h-4" />
                                    <span>{supplier.phone_number}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Review Booking Button */}
            {selectedOption && (
                <button
                    className="w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition mt-6 flex items-center justify-center gap-2"
                    onClick={() => {
                        // Handle booking review
                    }}
                >
                    Review Booking
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default MultidaySearchResults; 