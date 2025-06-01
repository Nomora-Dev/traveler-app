import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, X } from 'lucide-react';

const quickStops = ['Mysore Palace', 'Coorg Resort'];

interface MultidayFormData {
    tripType: string;
    startDate: string;
    startTime: string;
    pickupLocation: string;
    stops: string[];
    dropLocation: string;
    guests: number;
    endDate: string;
    endTime: string;
    newStop: string;
}

const MultidayRental = () => {
    const [formData, setFormData] = useState<MultidayFormData>({
        tripType: 'oneway',
        startDate: '',
        startTime: '',
        pickupLocation: '',
        stops: [],
        dropLocation: '',
        guests: 2,
        endDate: '',
        endTime: '',
        newStop: '',
    });

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

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            {/* <h2 className="text-2xl font-semibold text-heading-black mb-7 text-center font-sans">Book Outstation Cab</h2> */}
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
            <div className="mb-6">
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Pickup location (e.g. The Leela Palace, Bengaluru)"
                        className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                        value={formData.pickupLocation}
                        onChange={e => handleChange('pickupLocation', e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                </div>
            </div>
            {/* Stops */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.stops.map((stop, idx) => (
                        <span key={idx} className="flex items-center bg-hero-tertiary rounded-full px-3 py-1 text-xs text-heading-black border border-primary-stroke">
                            {stop}
                            <button type="button" className="ml-1" onClick={() => handleRemoveStop(idx)}><X className="w-4 h-4 text-text-gray" /></button>
                        </span>
                    ))}
                    {/* {quick4 */}
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
            <div className="mb-6 relative">
                <input
                    type="text"
                    placeholder="Drop location"
                    className={`w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray ${formData.tripType === 'oneway' ? '' : 'opacity-50 bg-gray-200'}`}
                    value={formData.tripType === 'oneway' ? formData.dropLocation : formData.pickupLocation}
                    onChange={e => handleChange('dropLocation', e.target.value)}
                />
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" style={{ top: '50%', transform: 'translateY(-50%)', left: '0.75rem', position: 'absolute' }} />
            </div>
            {/* Number of Guests */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Number of Guests</label>
                <div className="flex items-center gap-4 border border-primary-stroke rounded-lg px-4 py-3 w-fit bg-white font-sans">
                    <Users className="w-5 h-5 text-icon-color" />
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('guests', Math.max(1, formData.guests - 1))}
                    >-</button>
                    <span className="text-base font-medium w-8 text-center font-sans">{formData.guests}</span>
                    <button
                        type="button"
                        className="px-3 text-lg font-bold text-text-gray hover:text-hero-peach font-sans"
                        onClick={() => handleChange('guests', formData.guests + 1)}
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
            <button className="w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition font-sans">Search for Cab</button>
        </div>
    );
};

export default MultidayRental;
