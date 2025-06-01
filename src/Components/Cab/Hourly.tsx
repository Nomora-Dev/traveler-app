import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';

const hourOptions = [4, 6, 8, 12];
const guestOptions = [2, 4, 6];
const popularDestinations = ['Mall Road', 'City Center', 'Railway Station', 'Airport'];

interface HourlyFormData {
    hours: number;
    when: string;
    date: string;
    time: string;
    pickup: string;
    dropoff: string;
    sameDrop: boolean;
    stops: string[];
    guests: number;
}

const Hourly: React.FC = () => {
    const [formData, setFormData] = useState<HourlyFormData>({
        hours: 4,
        when: 'now',
        date: '',
        time: '',
        pickup: '',
        dropoff: '',
        sameDrop: false,
        stops: [],
        guests: 2,
    });

    const handleChange = (field: keyof HourlyFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddStop = () => {
        setFormData(prev => ({ ...prev, stops: [...prev.stops, ''] }));
    };

    const handleStopChange = (idx: number, value: string) => {
        setFormData(prev => {
            const stops = [...prev.stops];
            stops[idx] = value;
            return { ...prev, stops };
        });
    };

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* Number of Hours */}
            <div className="mb-8">
                <label className="text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Clock className="w-5 h-5 text-icon-color" /> Number of Hours
                </label>
                <div className="flex items-center gap-4 mb-4">
                    <button type="button" onClick={() => handleChange('hours', Math.max(4, formData.hours - 2))} className="w-9 h-9 rounded-full border border-primary-stroke bg-gray-100 text-lg font-bold text-text-gray hover:text-hero-peach flex items-center justify-center">-</button>
                    <span className="text-xl font-semibold w-8 text-center">{formData.hours}</span>
                    <button type="button" onClick={() => handleChange('hours', Math.min(12, formData.hours + 2))} className="w-9 h-9 rounded-full border border-primary-stroke bg-gray-100 text-lg font-bold text-text-gray hover:text-hero-peach flex items-center justify-center">+</button>
                </div>
                <div className="flex gap-2">
                    {hourOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('hours', opt)}
                            className={`px-3 py-2 rounded-full text-sm font-medium border ${formData.hours === opt ? 'bg-hero-peach text-white border-hero-peach' : 'bg-hero-tertiary text-heading-black border-primary-stroke'} transition`}
                        >
                            {opt} hours
                        </button>
                    ))}
                </div>
            </div>

            {/* When */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-icon-color" /> When
                </label>
                <div className="flex items-center gap-8 mb-3">
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.when === 'now'} onChange={() => handleChange('when', 'now')} className="accent-hero-green" /> Now
                    </label>
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.when === 'later'} onChange={() => handleChange('when', 'later')} className="accent-hero-green" /> Later
                    </label>
                </div>
                {formData.when === 'later' && (
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.date}
                                onChange={e => handleChange('date', e.target.value)}
                            />
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="time"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.time}
                                onChange={e => handleChange('time', e.target.value)}
                            />
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    </div>
                )}
            </div>

            {/* Locations */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-icon-color" /> Locations
                </label>
                <div className="mb-3">
                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder="Pickup Location"
                            value={formData.pickup}
                            onChange={e => handleChange('pickup', e.target.value)}
                            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                        />
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-text-gray mb-2 font-sans">
                        <input
                            type="checkbox"
                            checked={formData.sameDrop}
                            onChange={e => handleChange('sameDrop', e.target.checked)}
                            className="accent-hero-green"
                        />
                        Drop-off same as pickup
                    </label>
                    {!formData.sameDrop && (
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Enter drop location"
                                value={formData.dropoff}
                                onChange={e => handleChange('dropoff', e.target.value)}
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                            />
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    )}
                    {formData.stops.map((stop, idx) => (
                        <div className="relative mb-3" key={idx}>
                            <input
                                type="text"
                                placeholder={`Stop ${idx + 1}`}
                                value={stop}
                                onChange={e => handleStopChange(idx, e.target.value)}
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                            />
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddStop} className="flex items-center gap-1 text-hero-peach font-medium text-sm hover:underline mb-2"><Plus className="w-4 h-4" /> Add Stop</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {popularDestinations.map(dest => (
                        <button
                            key={dest}
                            type="button"
                            onClick={() => handleChange('dropoff', dest)}
                            className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                        >
                            <MapPin className="w-4 h-4 text-icon-color" /> {dest}
                        </button>
                    ))}
                </div>
            </div>

            {/* Number of Guests */}
            <div className="mb-10">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans flex items-center gap-2">
                    <Users className="w-5 h-5 text-icon-color" /> Number of Guests
                </label>
                <div className="flex items-center gap-4 border border-primary-stroke rounded-lg px-4 py-3 w-fit bg-white font-sans mb-3">
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('guests', Math.max(2, formData.guests - 2))}
                    >-</button>
                    <span className="text-base font-medium w-8 text-center font-sans">{formData.guests}</span>
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('guests', Math.min(6, formData.guests + 2))}
                    >+</button>
                </div>
                <div className="flex gap-2">
                    {guestOptions.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => handleChange('guests', opt)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${formData.guests === opt ? 'bg-hero-peach text-white border-hero-peach' : 'bg-hero-tertiary text-heading-black border-primary-stroke'} transition`}
                        >
                            {opt} guests
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Button */}
            <button className="w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition font-sans">Search for Cab</button>
        </div>
    );
};

export default Hourly;
