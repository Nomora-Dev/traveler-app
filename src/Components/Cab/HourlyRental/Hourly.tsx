import React, { useState, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import CabSearchTab from '../CabSearchTab';
import { getLocationSuggestions, getHourlyTransferBooking } from '../../../services/cab';
import type { LocationSuggestion } from '../../../types/types';
import { useNavigate } from 'react-router-dom';

const hourOptions = [4, 6, 8, 12];
const guestOptions = [2, 4, 6];
const popularDestinations = ['Mall Road', 'City Center', 'Railway Station', 'Airport'];

interface HourlyFormData {
    hours: number;
    pickup_time_type: string;
    date: string | null;
    time: string | null;
    pickup_location: string;
    drop_location: string;
    sameDrop: boolean;
    stops: string[];
    pax_count: number;
    service_type: string;
}

const Hourly: React.FC = () => {
    const [formData, setFormData] = useState<HourlyFormData>({
        hours: 4,
        pickup_time_type: 'now',
        date: '',
        time: '',
        pickup_location: '',
        drop_location: '',
        sameDrop: false,
        stops: [],
        pax_count: 2,
        service_type: 'hourly',
    });

    const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion['data']>([]);
    const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion['data']>([]);
    const [pickupError, setPickupError] = useState<string | null>(null);
    const [dropError, setDropError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const navigate = useNavigate();

    const pickupRequestId = useRef(0);
    const dropRequestId = useRef(0);

    const handlePickupChange = (value: string) => {
        setFormData(prev => ({ ...prev, pickup_location: value }));
        setPickupError(null);
        if (!value) {
            setPickupSuggestions([]);
            return;
        }
        pickupRequestId.current += 1;
        const currentId = pickupRequestId.current;
        setTimeout(async () => {
            if (currentId !== pickupRequestId.current) return;
            const res = await getLocationSuggestions(value);
            if (currentId !== pickupRequestId.current) return;
            if (!res.success) {
                setPickupError(res.message || 'No locations found');
                setPickupSuggestions([]);
            } else {
                setPickupSuggestions(res.data);
            }
        }, 300);
    };

    const handleDropChange = (value: string) => {
        setFormData(prev => ({ ...prev, drop_location: value }));
        setDropError(null);
        if (!value) {
            setDropSuggestions([]);
            return;
        }
        dropRequestId.current += 1;
        const currentId = dropRequestId.current;
        setTimeout(async () => {
            if (currentId !== dropRequestId.current) return;
            const res = await getLocationSuggestions(value);
            if (currentId !== dropRequestId.current) return;
            if (!res.success) {
                setDropError(res.message || 'No locations found');
                setDropSuggestions([]);
            } else {
                setDropSuggestions(res.data);
            }
        }, 300);
    };

    const handlePickupSuggestion = (suggestion: LocationSuggestion['data'][0]) => {
        setFormData(prev => ({ ...prev, pickup_location: suggestion.description }));
        setPickupSuggestions([]);
    };
    const handleDropSuggestion = (suggestion: LocationSuggestion['data'][0]) => {
        setFormData(prev => ({ ...prev, drop_location: suggestion.description }));
        setDropSuggestions([]);
    };

    const handleSearch = async () => {
        setSearchError(null);
        if (!formData.pickup_location || !formData.drop_location) {
            setSearchError('Please select both pickup and drop locations');
            return;
        }
        setIsSearching(true);
        try {
            const params = {
                ...formData,
            };
            const response = await getHourlyTransferBooking(params);
            if (response.success) {
                navigate('/cab/search-results', {
                    state: {
                        searchResults: response.data,
                        type: 'hourly',
                        userInput: formData,
                    }
                });
            } else {
                setSearchError('No cabs found.');
            }
        } catch (error) {
            setSearchError('Failed to fetch cab options. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // if (searchResults) {
    //     return <HourlySearchResults searchResults={searchResults} />;
    // }

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Number of Hours */}
            <div className="mb-8">
                <label className="text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Clock className="w-5 h-5 text-icon-color" /> Number of Hours
                </label>
                <div className="flex items-center gap-4 mb-4">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, hours: Math.max(4, prev.hours - 2) }))} className="w-9 h-9 rounded-full border border-primary-stroke bg-gray-100 text-lg font-bold text-text-gray hover:text-hero-peach flex items-center justify-center">-</button>
                    <span className="text-xl font-semibold w-8 text-center">{formData.hours}</span>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, hours: Math.min(12, prev.hours + 2) }))} className="w-9 h-9 rounded-full border border-primary-stroke bg-gray-100 text-lg font-bold text-text-gray hover:text-hero-peach flex items-center justify-center">+</button>
                </div>
                <div className="flex gap-2">
                    {hourOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, hours: opt }))}
                            className={`px-3 py-2 rounded-full text-sm font-medium border ${formData.hours === opt ? 'bg-hero-peach text-white border-hero-peach' : 'bg-hero-tertiary text-heading-black border-primary-stroke'} transition`}
                        >
                            {opt} hours
                        </button>
                    ))}
                </div>
            </div>

            {/* When */}
            <div className="mb-8">
                <label className="text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-icon-color" /> When
                </label>
                <div className="flex items-center gap-8 mb-3">
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.pickup_time_type === 'now'} onChange={() => setFormData(prev => ({ ...prev, pickup_time_type: 'now' }))} className="accent-hero-green" /> Now
                    </label>
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.pickup_time_type === 'schedule'} onChange={() => setFormData(prev => ({ ...prev, pickup_time_type: 'schedule' }))} className="accent-hero-green" /> Schedule
                    </label>
                </div>
                {formData.pickup_time_type === 'schedule' && (
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.date || ''}
                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            />
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="time"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.time || ''}
                                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                            />
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    </div>
                )}
            </div>

            {/* Locations */}
            <div className="mb-8">
                <label className="text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-icon-color" /> Locations
                </label>
                <div className="mb-3">
                    <CabSearchTab
                        value={formData.pickup_location}
                        onChange={handlePickupChange}
                        suggestions={pickupSuggestions}
                        onSuggestionClick={handlePickupSuggestion}
                        placeholder="Pickup Location"
                        error={pickupError}
                        quickOptions={popularDestinations}
                    />
                    <label className="flex items-center gap-2 text-xs text-text-gray mb-6 font-sans">
                        <input
                            type="checkbox"
                            checked={formData.sameDrop}
                            onChange={e => setFormData(prev => ({ ...prev, sameDrop: e.target.checked, drop_location: e.target.checked ? prev.pickup_location : prev.drop_location }))}
                            className="accent-hero-green"
                        />
                        Drop-off same as pickup
                    </label>
                    {!formData.sameDrop && (
                        <CabSearchTab
                            value={formData.drop_location}
                            onChange={handleDropChange}
                            suggestions={dropSuggestions}
                            onSuggestionClick={handleDropSuggestion}
                            placeholder="Enter drop location"
                            error={dropError}
                            quickOptions={popularDestinations}
                        />
                    )}
                    {formData.stops.map((stop, idx) => (
                        <div className="relative mb-3" key={idx}>
                            <input
                                type="text"
                                placeholder={`Stop ${idx + 1}`}
                                value={stop}
                                onChange={e => setFormData(prev => {
                                    const stops = [...prev.stops];
                                    stops[idx] = e.target.value;
                                    return { ...prev, stops };
                                })}
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                            />
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    ))}
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, stops: [...prev.stops, ''] }))} className="flex items-center gap-1 text-hero-peach font-medium text-sm hover:underline mb-2"><Plus className="w-4 h-4" /> Add Stop</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {popularDestinations.map(dest => (
                        <button
                            key={dest}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, dropoff: dest }))}
                            className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                        >
                            <MapPin className="w-4 h-4 text-icon-color" /> {dest}
                        </button>
                    ))}
                </div>
            </div>

            {/* Number of Guests */}
            <div className="mb-10">
                <label className="text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Users className="w-5 h-5 text-icon-color" /> Number of Guests
                </label>
                <div className="flex items-center gap-4 border border-primary-stroke rounded-lg px-4 py-3 w-fit bg-white font-sans mb-3">
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => setFormData(prev => ({ ...prev, pax_count: Math.max(2, prev.pax_count - 2) }))}
                    >-</button>
                    <span className="text-base font-medium w-8 text-center font-sans">{formData.pax_count}</span>
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => setFormData(prev => ({ ...prev, pax_count: Math.min(6, prev.pax_count + 2) }))}
                    >+</button>
                </div>
                <div className="flex gap-2">
                    {guestOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, pax_count: opt }))}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${formData.pax_count === opt ? 'bg-hero-peach text-white border-hero-peach' : 'bg-hero-tertiary text-heading-black border-primary-stroke'} transition`}
                        >
                            {opt} guests
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Button */}
            {searchError && (
                <div className="text-red-500 text-sm mb-4">{searchError}</div>
            )}
            <button
                onClick={handleSearch}
                disabled={isSearching}
                className={`w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition font-sans ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isSearching ? 'Searching...' : 'Search for Cab'}
            </button>
        </div>
    );
};

export default Hourly;
