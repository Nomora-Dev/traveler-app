import React, { useState } from 'react';
import { Car, Star, Clock, MapPin, ChevronRight, X, Users, Calendar } from 'lucide-react';
import type { MultidaySearchResponse } from '../../types/types';

const FILTERS = ['All', 'Sedan', 'SUV', 'Hatchback'];

const PRICING_RULES = [
    '₹3000/day includes private car with driver (6 AM - 11 PM), 150 km travel and 12 hours service',
    'Additional charges: ₹18/km beyond included kms, ₹200/hr beyond included hours',
    'Trip extending beyond 6 AM next day triggers a new day charge',
    'Night driving fee (11 PM - 6 AM): ₹500 per night',
    'Additional driver allowance of ₹300 applies for trips beyond 12 AM',
    'Outstation permits and state taxes will be charged extra if applicable',
];

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
    const [breakupModal, setBreakupModal] = useState<{
        supplier: any;
        category: any;
    } | null>(null);

    // Calculate trip duration
    const startDate = new Date(tripDetails.startDate);
    const endDate = new Date(tripDetails.endDate);
    const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const numberOfNights = numberOfDays - 1;
    const totalIncludedKms = numberOfDays * (searchResults.suppliers[0]?.categories[Object.keys(searchResults.suppliers[0]?.categories)[0]]?.pricing.included_kms || 0);

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

    // Modal for fare breakup
    const FareBreakupModal = ({ category, onClose }: any) => {
        const pricing = category.pricing;
        const distance = category.distance_info;
        const taxes = Math.round(pricing.final_price * 0.05); // Example: 5% tax
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 relative animate-fadeIn">
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                    {/* Car Details */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Car className="w-5 h-5 text-hero-peach" />
                            <span className="font-semibold text-lg text-heading-black">{category.name} Category</span>
                        </div>
                        <div className="text-sm text-text-gray mb-2">
                            Compact cars perfect for city/outstation travel with essential comfort
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-hero-tertiary px-2 py-1 rounded text-xs">Hyundai i10</span>
                            <span className="bg-hero-tertiary px-2 py-1 rounded text-xs">Maruti WagonR</span>
                            <span className="bg-hero-tertiary px-2 py-1 rounded text-xs">Tata Tiago</span>
                            <span className="bg-hero-tertiary px-2 py-1 rounded text-xs">Maruti Alto</span>
                        </div>
                        <ul className="text-xs text-text-gray list-disc pl-5 space-y-1">
                            <li>Free cancellation up to 30 minutes before pickup</li>
                            <li>Compact luggage space (2 medium bags)</li>
                            <li>Fuel-efficient vehicles</li>
                        </ul>
                    </div>
                    {/* Fare Breakup */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Fare Breakup</div>
                        <div className="text-sm space-y-1">
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
                            {distance.extra_kms > 0 && (
                                <div className="flex justify-between">
                                    <span>Extra KMs ({distance.extra_kms} km)</span>
                                    <span>{formatPrice(distance.extra_kms * pricing.price_per_km)}</span>
                                </div>
                            )}
                            {distance.extra_hours > 0 && (
                                <div className="flex justify-between">
                                    <span>Extra Hours ({formatDuration(distance.extra_hours)})</span>
                                    <span>{formatPrice(distance.extra_hours * pricing.price_per_hour)}</span>
                                </div>
                            )}
                            {!tripDetails.isRoundTrip && (
                                <div className="flex justify-between">
                                    <span>Dead Return Cost</span>
                                    <span>{formatPrice(pricing.dead_return_cost)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Taxes & fees (5%)</span>
                                <span>{formatPrice(taxes)}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                                <span>Total fare</span>
                                <span>{formatPrice(pricing.final_price + taxes)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Pricing Rules */}
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Pricing Rules</div>
                        <ul className="text-xs text-text-gray list-disc pl-5 space-y-1">
                            {PRICING_RULES.map((rule, idx) => (
                                <li key={`rule-${idx}`}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-base shadow-md hover:bg-hero-green transition mt-2">
                        Book Now
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white px-2 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Header Summary */}
            <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-white border border-primary-stroke rounded-xl flex flex-col items-center py-3">
                    <div className="flex items-center gap-1 text-hero-peach font-semibold text-base"><MapPin className="w-4 h-4" />{totalIncludedKms} km</div>
                    <div className="text-xs text-text-gray mt-1">Included</div>
                </div>
                <div className="flex-1 bg-white border border-primary-stroke rounded-xl flex flex-col items-center py-3">
                    <div className="flex items-center gap-1 text-hero-peach font-semibold text-base"><Calendar className="w-4 h-4" />{numberOfDays} Days</div>
                    <div className="text-xs text-text-gray mt-1">Included</div>
                </div>
                <div className="flex-1 bg-white border border-primary-stroke rounded-xl flex flex-col items-center py-3">
                    <div className="flex items-center gap-1 text-hero-peach font-semibold text-base"><Clock className="w-4 h-4" />{numberOfNights} Nights</div>
                    <div className="text-xs text-text-gray mt-1">Included</div>
                </div>
            </div>
            {/* Pickup/Drop Card */}
            <div className="bg-white border border-primary-stroke rounded-xl shadow-sm p-4 mb-6">
                <div className="mb-2">
                    <div className="text-xs text-text-gray mb-1">Pickup Location</div>
                    <div className="font-semibold text-heading-black text-sm">{searchResults.route_info.pickup_location}</div>
                </div>
                <div className="flex items-center gap-2 mb-1 text-xs text-text-gray">
                    <Calendar className="w-4 h-4" />
                    <span>Pickup Date & Time</span>
                    <span className="font-semibold text-heading-black ml-2">{startDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}, {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-gray">
                    <Calendar className="w-4 h-4" />
                    <span>End Date & Time</span>
                    <span className="font-semibold text-heading-black ml-2">{endDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}, {endDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {FILTERS.map(filter => (
                    <button
                        key={filter}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${selectedFilter === filter
                                ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                        onClick={() => setSelectedFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Available Options */}
            <div className="space-y-4">
                {filteredCategories.length === 0 ? (
                    <div className="text-center text-text-gray py-8">
                        No cabs found for the selected filter
                    </div>
                ) : (
                    filteredCategories.map(({ supplier, categoryId, category }) => {
                        const isSelected = selectedOption?.supplierId === supplier.id && selectedOption?.categoryId === categoryId;
                        return (
                            <div
                                key={`${supplier.id}-${categoryId}`}
                                className={`relative border rounded-xl p-4 flex flex-col gap-3 transition-all ${isSelected
                                        ? 'border-hero-peach bg-hero-peach/10 shadow-md'
                                        : 'border-primary-stroke bg-white hover:border-hero-peach'
                                    }`}
                                onClick={() => handleOptionSelect(supplier.id, categoryId)}
                                style={{ cursor: 'pointer' }}
                            >
                                {/* Radio/Select Indicator */}
                                <div className="absolute left-4 top-4">
                                    <span
                                        className={`inline-block w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-hero-peach border-hero-peach' : 'border-primary-stroke bg-white'
                                            }`}
                                    ></span>
                                </div>

                                {/* Supplier Details Row */}
                                <div className="flex justify-between items-start">
                                    <div className="pl-8 flex-1">
                                        {/* Name and Rating */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-base text-heading-black">{supplier.name}</span>
                                            {supplier.avg_rating && (
                                                <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium">
                                                    <Star className="w-4 h-4" />
                                                    {supplier.avg_rating}
                                                    <span className="text-gray-400">({supplier.review_count})</span>
                                                </span>
                                            )}
                                        </div>

                                        {/* Tags: Type, AC, Seats */}
                                        <div className="flex flex-wrap gap-2 mb-1">
                                            <span className="flex items-center gap-1 px-2 py-1 bg-hero-tertiary text-heading-black rounded-full text-xs font-medium">
                                                <Car className="w-4 h-4" /> {category.name}
                                            </span>
                                            <span className="flex items-center gap-1 px-2 py-1 bg-hero-tertiary text-heading-black rounded-full text-xs font-medium">
                                                AC
                                            </span>
                                            <span className="flex items-center gap-1 px-2 py-1 bg-hero-tertiary text-heading-black rounded-full text-xs font-medium">
                                                <Users className="w-4 h-4" /> {category.seating_capacity} Seats
                                            </span>
                                        </div>

                                        {/* Vehicle types */}
                                        <div className="text-xs text-text-gray mb-1">
                                            {category.vehicle_list.join(', ') || 'Hyundai i10, Maruti WagonR,' + 'or similar'}
                                        </div>

                                        {/* Price per day and kms */}
                                        <div className="text-xs text-hero-peach font-semibold">
                                            ₹{category.pricing.base_price}/Day, {category.pricing.included_kms}/kms/Day
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="text-right min-w-[110px]">
                                        <div className="text-xl font-bold text-heading-black">{formatPrice(category.pricing.final_price)}</div>
                                        <div className="text-xs text-text-gray">Incl. taxes</div>
                                        <button
                                            className="text-xs text-hero-peach underline mt-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBreakupModal({ supplier, category });
                                            }}
                                        >
                                            View breakup
                                        </button>
                                    </div>
                                </div>
                            </div>

                        );
                    })
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

            {/* Fare Breakup Modal */}
            {breakupModal && (
                <FareBreakupModal
                    supplier={breakupModal.supplier}
                    category={breakupModal.category}
                    onClose={() => setBreakupModal(null)}
                />
            )}
        </div>
    );
};

export default MultidaySearchResults; 