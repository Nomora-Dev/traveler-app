import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, Plus, X } from 'lucide-react';
import { getMultidayTransferBooking, getLocationSuggestions } from '../../../services/cab';
import type { MultidaySearchResponse, LocationSuggestion } from '../../../types/types';
import MultidaySearchResults from './MultidaySearchResults';
import CabSearchTab from '../CabSearchTab';
import { useNavigate } from 'react-router-dom';

const quickStops = ['Mysore Palace', 'Coorg Resort'];

interface MultidayFormData {
    service_type: string;
    tripType: string;
    startDate: string;
    startTime: string;
    pickup_location: string;
    stops: string[];
    drop_location: string;
    pax_count: number;
    endDate: string;
    endTime: string;
    newStop: string;
}

const MultidayRental = () => {
    const [formData, setFormData] = useState<MultidayFormData>({
        service_type: 'multiday',
        tripType: 'oneway',
        startDate: '',
        startTime: '',
        pickup_location: '',
        stops: [],
        drop_location: '',
        pax_count: 2,
        endDate: '',
        endTime: '',
        newStop: '',
    });

    const [searchResults, setSearchResults] = useState<MultidaySearchResponse['data'] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion['data']>([]);
    const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion['data']>([]);
    const navigate = useNavigate();
    const pickupRequestId = useRef(0);
    const dropRequestId = useRef(0);

    // Fetch location suggestions when pickup location changes
    useEffect(() => {
        pickupRequestId.current += 1;
        const currentId = pickupRequestId.current;
        const fetchPickupSuggestions = async () => {
            if (formData.pickup_location.length > 2) {
                const response = await getLocationSuggestions(formData.pickup_location);
                if (currentId !== pickupRequestId.current) return;
                if (response.success) {
                    setPickupSuggestions(response.data);
                }
            } else {
                setPickupSuggestions([]);
            }
        };
        const timeoutId = setTimeout(fetchPickupSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [formData.pickup_location]);

    // Fetch location suggestions when drop location changes
    useEffect(() => {
        dropRequestId.current += 1;
        const currentId = dropRequestId.current;
        const fetchDropSuggestions = async () => {
            if (formData.drop_location.length > 2) {
                const response = await getLocationSuggestions(formData.drop_location);
                if (currentId !== dropRequestId.current) return;
                if (response.success) {
                    setDropSuggestions(response.data);
                }
            } else {
                setDropSuggestions([]);
            }
        };
        const timeoutId = setTimeout(fetchDropSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [formData.drop_location]);

    const handleChange = (field: keyof MultidayFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddStop = () => {
        if (formData.newStop.trim()) {
            setFormData(prev => ({ ...prev, stops: [...prev.stops, prev.newStop], newStop: '' }));
        }
    };

    const handleRemoveStop = (idx: number) => {
        setFormData(prev => ({ ...prev, stops: prev.stops.filter((_, i) => i !== idx) }));
    };

    const handleSearch = async () => {
        // Validate required fields
        if (!formData.pickup_location || !formData.drop_location) {
            setError('Please enter pickup and drop locations');
            return;
        }
        if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
            setError('Please select start and end dates/times');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const params = {
                ...formData,
                start_date: `${formData.startDate}T${formData.startTime}`,
                end_date: `${formData.endDate}T${formData.endTime}`,
                is_round_trip: formData.tripType === 'round'
            };
            const response = await getMultidayTransferBooking(params);

            if (response.success) {
                navigate('/cab/search-results', {
                    state: {
                        searchResults: response.data,
                        type: 'multiday',
                        userInput: formData,
                        tripDetails: {
                            startDate: formData.startDate,
                            endDate: formData.endDate,
                            isRoundTrip: formData.tripType === 'round'
                        }
                    }
                });
            } else {
                setError('No cabs found.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to search for cabs');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePickupSuggestionClick = (suggestion: LocationSuggestion['data'][0]) => {
        handleChange('pickup_location', suggestion.description);
        setPickupSuggestions([]);
    };

    const handleDropSuggestionClick = (suggestion: LocationSuggestion['data'][0]) => {
        handleChange('drop_location', suggestion.description);
        setDropSuggestions([]);
    };

    // if (searchResults) {
    //     return (
    //         <MultidaySearchResults
    //             searchResults={searchResults}
    //             tripDetails={{
    //                 startDate: `${formData.startDate}T${formData.startTime}`,
    //                 endDate: `${formData.endDate}T${formData.endTime}`,
    //                 isRoundTrip: formData.tripType === 'round'
    //             }}
    //         />
    //     );
    // }

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Trip Type */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6 w-full max-w-xs mx-auto gap-2">
                <button
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150 font-sans ${formData.tripType === 'oneway' ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow' : 'text-gray-600'}`}
                    onClick={() => handleChange('tripType', 'oneway')}
                >
                    One Way
                </button>
                <button
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150 font-sans ${formData.tripType === 'round' ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow' : 'text-gray-600'}`}
                    onClick={() => handleChange('tripType', 'round')}
                >
                    Round Trip
                </button>
            </div>
            {/* Start Date & Time */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">When do you want to travel?</label>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="date"
                            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                            value={formData.startDate}
                            onChange={e => handleChange('startDate', e.target.value)}
                        />
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="time"
                            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                            value={formData.startTime}
                            onChange={e => handleChange('startTime', e.target.value)}
                        />
                        <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    </div>
                </div>
            </div>
            {/* Pickup Location */}
            <CabSearchTab
                value={formData.pickup_location}
                onChange={value => handleChange('pickup_location', value)}
                suggestions={pickupSuggestions}
                onSuggestionClick={handlePickupSuggestionClick}
                placeholder="Pickup location (e.g. The Leela Palace, Bengaluru)"
                quickOptions={quickStops}
                error={error && !formData.pickup_location ? 'Pickup location is required' : null}
            />
            {/* Stops */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.stops.map((stop, idx) => (
                        <span key={idx} className="flex items-center bg-hero-tertiary rounded-full px-3 py-1 text-xs text-heading-black border border-primary-stroke">
                            {stop}
                            <button type="button" className="ml-1" onClick={() => handleRemoveStop(idx)}><X className="w-4 h-4 text-text-gray" /></button>
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Add a stop"
                        className="flex-1 border border-primary-stroke rounded-lg py-2 pl-3 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                        value={formData.newStop}
                        onChange={e => handleChange('newStop', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddStop(); }}
                    />
                    <button type="button" className="p-2 bg-hero-peach text-white rounded-full" onClick={handleAddStop}><Plus className="w-4 h-4" /></button>
                </div>
            </div>
            {/* Drop Location */}
            <CabSearchTab
                value={formData.tripType === 'oneway' ? formData.drop_location : formData.pickup_location}
                onChange={value => handleChange('drop_location', value)}
                suggestions={dropSuggestions}
                onSuggestionClick={handleDropSuggestionClick}
                placeholder="Drop location"
                disabled={formData.tripType === 'round'}
                className={formData.tripType === 'round' ? 'opacity-50' : ''}
                error={error && !formData.drop_location ? 'Drop location is required' : null}
            />
            {/* Number of Guests */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Number of Guests</label>
                <div className="flex items-center gap-4 border border-primary-stroke rounded-lg px-4 py-3 w-fit bg-white font-sans">
                    <Users className="w-5 h-5 text-icon-color" />
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('pax_count', Math.max(1, formData.pax_count - 1))}
                    >-</button>
                    <span className="text-base font-medium w-8 text-center font-sans">{formData.pax_count}</span>
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('pax_count', formData.pax_count + 1)}
                    >+</button>
                </div>
            </div>
            {/* End Date & Time */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">End Date</label>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input
                            type="date"
                            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                            value={formData.endDate}
                            onChange={e => handleChange('endDate', e.target.value)}
                        />
                        <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="time"
                            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                            value={formData.endTime}
                            onChange={e => handleChange('endTime', e.target.value)}
                        />
                        <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    </div>
                </div>
            </div>
            {/* Search Button */}
            <button 
                className="w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition font-sans"
                onClick={handleSearch}
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Search for Cab'}
            </button>
            {error && (
                <div className="mt-4 text-red-500 text-sm text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default MultidayRental;
