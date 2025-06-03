import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { LocationSuggestion } from '../../types/types';

interface CabSearchTabProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: LocationSuggestion['data'];
    onSuggestionClick: (suggestion: LocationSuggestion['data'][0]) => void;
    placeholder?: string;
    error?: string | null;
    quickOptions?: string[];
    className?: string;
    disabled?: boolean;
}

const CabSearchTab: React.FC<CabSearchTabProps> = ({
    value,
    onChange,
    suggestions,
    onSuggestionClick,
    placeholder = 'Enter location',
    error,
    quickOptions = [],
    className = '',
    disabled = false,
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative mb-6 ${className}`} ref={wrapperRef}>
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className={`w-full border ${error ? 'border-red-500' : 'border-primary-stroke'} rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray ${disabled ? 'opacity-50 bg-gray-100' : ''}`}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => !disabled && setShowSuggestions(true)}
                autoComplete="off"
                disabled={disabled}
            />
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute w-full mt-1 bg-white border border-primary-stroke rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestions.map(suggestion => (
                        <div
                            key={suggestion.place_id}
                            className="px-4 py-2 hover:bg-hero-peach/20 cursor-pointer text-sm"
                            onClick={() => {
                                onSuggestionClick(suggestion);
                                setShowSuggestions(false);
                            }}
                        >
                            {suggestion.description}
                        </div>
                    ))}
                </div>
            )}
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
            {quickOptions.length > 0 && !disabled && (
                <div className="flex gap-2 flex-wrap mt-2">
                    {quickOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            className="flex items-center gap-1 px-3 py-1 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                            onClick={() => onChange(opt)}
                        >
                            <MapPin className="w-4 h-4 text-icon-color" /> {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CabSearchTab; 