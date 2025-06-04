import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { LocationSuggestion, TerminalTransferBooking } from '../../types/types';
import { getLocationSuggestions, getTerminalTransferBooking, getTerminalSuggestions } from '../../services/cab';
import CabSearchResults from './TransferCabSearchResults';

// const terminalTypes = [
//     { label: 'Airport', icon: <Plane className="w-5 h-5 mr-2 text-icon-color" /> },
//     { label: 'Railway', icon: <Building2 className="w-5 h-5 mr-2 text-icon-color" /> },
// ];


const TerminalTransfer = () => {
    const [mode, setMode] = useState<'pickup' | 'drop'>('pickup');
    const [formData, setFormData] = useState<TerminalTransferBooking>({
        terminal_type: 'Airport',
        terminal_name: '',
        district_location_query: '',
        pax_count: 2,
        is_ac_preference: false,
        pickup_time_type: 'now',
        pickup_date: null,
        pickup_time: null,
    });

    const [searchResults, setSearchResults] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion['data']>([]);
    const [terminalSuggestions, setTerminalSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showTerminalSuggestions, setShowTerminalSuggestions] = useState(false);
    const locationRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const latestRequestId = useRef(0);

    // Reset form when mode changes
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            terminal_name: '',
            district_location_query: '',
        }));
        setError(null);
        setSearchError(null);
    }, [mode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
            if (terminalRef.current && !terminalRef.current.contains(event.target as Node)) {
                setShowTerminalSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLocationChange = async (location: string) => {
        if (!location) {
            setLocationSuggestions([]);
            setError(null);
            return;
        }

        latestRequestId.current += 1;
        const currentId = latestRequestId.current;

        setTimeout(async () => {
            if (currentId !== latestRequestId.current) return;

            try {
                const suggestions = await getLocationSuggestions(location);
                if (currentId !== latestRequestId.current) return;

                if (!suggestions.success) {
                    if (suggestions.data.length === 0) {
                        setError('No locations found. Please try a different search term.');
                        setLocationSuggestions([]);
                        setShowSuggestions(false);
                        return;
                    }

                    setError(suggestions.message || 'Failed to fetch location suggestions');
                    setLocationSuggestions([]);
                    setShowSuggestions(false);
                    return;
                }

                setError(null);
                setLocationSuggestions(suggestions.data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setError('Failed to fetch location suggestions. Please try again.');
                setLocationSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
    };

    const handleTerminalSearch = async (query: string) => {
        if (!query) {
            setTerminalSuggestions([]);
            return;
        }

        try {
            const response = await getTerminalSuggestions(query);
            if (response.success) {
                setTerminalSuggestions(response.data);
                setShowTerminalSuggestions(true);
            } else {
                setTerminalSuggestions([]);
                setShowTerminalSuggestions(false);
            }
        } catch (error) {
            console.error('Error fetching terminal suggestions:', error);
            setTerminalSuggestions([]);
            setShowTerminalSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: LocationSuggestion['data'][0]) => {
        setFormData(prev => ({ ...prev, district_location_query: suggestion.description }));
        setShowSuggestions(false);
    };

    const handleTerminalSuggestionClick = (suggestion: any) => {
        setFormData(prev => ({ ...prev, terminal_name: suggestion.terminal_name }));
        setShowTerminalSuggestions(false);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        if (field === 'district_location_query') {
            handleLocationChange(value);
        } else if (field === 'terminal_name') {
            handleTerminalSearch(value);
        }
    };

    const handleSearch = async () => {
        if (!formData.terminal_name || !formData.district_location_query) {
            setSearchError('Please select both pickup and drop locations');
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const response = await getTerminalTransferBooking({
                ...formData,
                mode
            });
            setSearchResults(response);
        } catch (error) {
            console.error('Error fetching transfer booking:', error);
            setSearchError('Failed to fetch cab options. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    if (searchResults) {
        return <CabSearchResults searchResults={searchResults} />;
    }

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Segmented Control */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8 w-full max-w-xs mx-auto gap-2">
                <button
                    className={`flex-1 py-2 p-1 rounded-xl text-sm font-medium transition-all duration-150 font-sans ${mode === 'pickup' ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow' : 'text-gray-600'}`}
                    onClick={() => setMode('pickup')}
                >
                    Pickup from Terminal
                </button>
                <button
                    className={`flex-1 py-2 p-1 rounded-xl text-sm font-medium transition-all duration-150 font-sans ${mode === 'drop' ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow' : 'text-gray-600'}`}
                    onClick={() => setMode('drop')}
                >
                    Drop to Terminal
                </button>
            </div>

            {/* Pickup Time */}
            <div className="mb-7">
                <div className="flex items-center gap-8 mb-3">
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input 
                            type="radio" 
                            checked={formData.pickup_time_type === 'now'} 
                            onChange={() => handleChange('pickup_time_type', 'now')} 
                            className="accent-hero-green" 
                        /> Now
                    </label>
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input 
                            type="radio" 
                            checked={formData.pickup_time_type === 'schedule'} 
                            onChange={() => handleChange('pickup_time_type', 'schedule')} 
                            className="accent-hero-green" 
                        /> Schedule
                    </label>
                </div>
                {formData.pickup_time_type === 'schedule' && (
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.pickup_date || ''}
                                onChange={e => handleChange('pickup_date', e.target.value)}
                            />
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="time"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.pickup_time || ''}
                                onChange={e => handleChange('pickup_time', e.target.value)}
                            />
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    </div>
                )}
            </div>

            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            {/* Terminal Location Input */}
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">
                    {mode === 'pickup' ? 'Pickup Location (Terminal)' : 'Drop Location (Terminal)'}
                </label>
                <div className="relative mb-3" ref={terminalRef}>
                    <input
                        type="text"
                        placeholder={mode === 'pickup' ? 'Enter terminal location' : 'Enter terminal location'}
                        className={`w-full border ${error ? 'border-red-500' : 'border-primary-stroke'} rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray`}
                        value={formData.terminal_name}
                        onChange={e => handleChange('terminal_name', e.target.value)}
                        onFocus={() => setShowTerminalSuggestions(true)}
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    {showTerminalSuggestions && terminalSuggestions.length > 0 && (
                        <div className="absolute w-full mt-1 bg-white border border-primary-stroke rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {terminalSuggestions.map(suggestion => (
                                <div
                                    key={suggestion.terminal_name}
                                    className="px-4 py-2 hover:bg-hero-peach/20 cursor-pointer text-sm"
                                    onClick={() => handleTerminalSuggestionClick(suggestion)}
                                >
                                    {suggestion.terminal_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Non-Terminal Location Input */}
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">
                    {mode === 'pickup' ? 'Drop Location' : 'Pickup Location'}
                </label>
                <div className="relative mb-3" ref={locationRef}>
                    <input
                        type="text"
                        placeholder={mode === 'pickup' ? 'Enter drop location' : 'Enter pickup location'}
                        className={`w-full border ${error ? 'border-red-500' : 'border-primary-stroke'} rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray`}
                        value={formData.district_location_query}
                        onChange={e => handleChange('district_location_query', e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    {showSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute w-full mt-1 bg-white border border-primary-stroke rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                            {locationSuggestions.map(suggestion => (
                                <div
                                    key={suggestion.place_id}
                                    className="px-4 py-2 hover:bg-hero-peach/20 cursor-pointer text-sm"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Number of Guests */}
            <div className="mb-10">
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

            {searchError && (
                <div className="text-red-500 text-sm mb-4">{searchError}</div>
            )}

            {/* Search Button */}
            <button 
                onClick={handleSearch} 
                disabled={isSearching}
                className={`w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md transition font-sans ${
                    isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:bg-hero-green'
                }`}
            >
                {isSearching ? 'Searching...' : 'Search for Cab'}
            </button>
        </div>
    );
};

export default TerminalTransfer; 