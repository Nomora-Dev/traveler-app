import { useEffect, useState, useRef } from 'react';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import type { LocationSuggestion, TransferBooking } from '../../types/types';
import { getLocationSuggestions, getTransferBooking } from '../../services/cab';
import CabSearchResults from './TransferCabSearchResults';
import { useNavigate } from 'react-router-dom';

const quickPickup = ['Hotel Sunrise, Manali', 'Mall Road', 'Old Bus Stand'];
const quickDrop = ['Shimla', 'Kullu', 'Dharamshala'];

const CityTransfer = () => {
  const [formData, setFormData] = useState<TransferBooking>({
    service_type: 'city',
    pickup_location_query: '',
    drop_location_query: '',
    pax_count: 2,
    is_ac_preference: false,
    pickup_time_type: 'now',
    pickup_date: null,
    pickup_time: null,
  });

  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  console.log(formData);

  const latestRequestId = useRef(0);

  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion['data']>([]);
  const [dropSuggestions, setDropSuggestions] = useState<LocationSuggestion['data']>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropSuggestions, setShowDropSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickupRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
        setShowPickupSuggestions(false);
      }
      if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
        setShowDropSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationChange = (location: string, type: 'pickup' | 'drop') => {
    if (!location) {
      if (type === 'pickup') setPickupSuggestions([]);
      else setDropSuggestions([]);
      setError(null);
      return;
    }

    latestRequestId.current += 1;
    const currentId = latestRequestId.current;

    setTimeout(async () => {
      // Only proceed if this is the latest call
      if (currentId !== latestRequestId.current) return;

      try {
        const suggestions = await getLocationSuggestions(location);
        if (currentId !== latestRequestId.current) return; // Check again after async

        if (!suggestions.success) {
          if (suggestions.data.length === 0) {
            setError('No locations found. Please try a different search term.');
            if (type === 'pickup') {
              setPickupSuggestions([]);
              setShowPickupSuggestions(false);
            } else {
              setDropSuggestions([]);
              setShowDropSuggestions(false);
            }
            return;
          }

          setError(suggestions.message || 'Failed to fetch location suggestions');
          if (type === 'pickup') {
            setPickupSuggestions([]);
            setShowPickupSuggestions(false);
          } else {
            setDropSuggestions([]);
            setShowDropSuggestions(false);
          }
          return;
        }

        setError(null);
        if (type === 'pickup') {
          setPickupSuggestions(suggestions.data);
          setShowPickupSuggestions(true);
        } else {
          setDropSuggestions(suggestions.data);
          setShowDropSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Failed to fetch location suggestions. Please try again.');
        if (type === 'pickup') {
          setPickupSuggestions([]);
          setShowPickupSuggestions(false);
        } else {
          setDropSuggestions([]);
          setShowDropSuggestions(false);
        }
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion['data'][0], type: 'pickup' | 'drop') => {
    if (type === 'pickup') {
      setFormData(prev => ({ ...prev, pickup_location_query: suggestion.description }));
      setShowPickupSuggestions(false);
    } else {
      setFormData(prev => ({ ...prev, drop_location_query: suggestion.description }));
      setShowDropSuggestions(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'pickup_location_query') {
      handleLocationChange(value, 'pickup');
    } else if (field === 'drop_location_query') {
      handleLocationChange(value, 'drop');
    }
  };

  const handleSearch = async () => {
    if (!formData.pickup_location_query || !formData.drop_location_query) {
      setSearchError('Please select both pickup and drop locations');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await getTransferBooking(formData);
      navigate('/cab/search-results', { 
        state: { 
          searchResults: response,
          type: 'city'
        }
      });
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
      {/* Pickup Time */}
      <div className="mb-7">
        <div className="flex items-center gap-8 mb-3">
          <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
            <input type="radio" checked={formData.pickup_time_type === 'now'} onChange={() => handleChange('pickup_time_type', 'now')} className="accent-hero-green" /> Now
          </label>
          <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
            <input type="radio" checked={formData.pickup_time_type === 'schedule'} onChange={() => handleChange('pickup_time_type', 'schedule')} className="accent-hero-green" /> Schedule
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
      {/* Pickup Location */}
      <div className="mb-7">
        <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Pickup Location</label>
        <div className="relative mb-3" ref={pickupRef}>
          <input
            type="text"
            placeholder="Enter pickup location"
            className={`w-full border ${error ? 'border-red-500' : 'border-primary-stroke'} rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray`}
            value={formData.pickup_location_query}
            onChange={e => handleChange('pickup_location_query', e.target.value)}
            onFocus={() => setShowPickupSuggestions(true)}
          />
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
          {showPickupSuggestions && pickupSuggestions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border border-primary-stroke rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {pickupSuggestions.map(suggestion => (
                <div
                  key={suggestion.place_id}
                  className="px-4 py-2 hover:bg-hero-peach/20 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion, 'pickup')}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          {quickPickup.map(loc => (
            <button
              key={loc}
              type="button"
              className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
              onClick={() => handleChange('pickup_location_query', loc)}
            >
              <MapPin className="w-4 h-4 text-icon-color" /> {loc}
            </button>
          ))}
        </div>
      </div>
      {/* Drop Location */}
      <div className="mb-7">
        <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Drop Location</label>
        <div className="relative mb-3" ref={dropRef}>
          <input
            type="text"
            placeholder="Where to?"
            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
            value={formData.drop_location_query}
            onChange={e => handleChange('drop_location_query', e.target.value)}
            onFocus={() => setShowDropSuggestions(true)}
          />
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-hero-peach" />
          {showDropSuggestions && dropSuggestions.length > 0 && (
            <div className="absolute w-full mt-1 bg-white border border-primary-stroke rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {dropSuggestions.map(suggestion => (
                <div
                  key={suggestion.place_id}
                  className="px-4 py-2 hover:bg-hero-peach/20 cursor-pointer text-sm"
                  onClick={() => handleSuggestionClick(suggestion, 'drop')}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div className="text-xs text-text-gray mb-2 font-sans">Popular destinations: {popularDestinations.map((d, i) => <a key={d.name} href={d.link} className="text-indigo-600 hover:underline mx-1 font-sans">{d.name}{i < popularDestinations.length - 1 ? ',' : ''}</a>)}</div> */}
        <div className="flex gap-3 flex-wrap">
          {quickDrop.map(loc => (
            <button
              key={loc}
              type="button"
              className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
              onClick={() => handleChange('dropLocation', loc)}
            >
              <MapPin className="w-4 h-4 text-icon-color" /> {loc}
            </button>
          ))}
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

export default CityTransfer; 