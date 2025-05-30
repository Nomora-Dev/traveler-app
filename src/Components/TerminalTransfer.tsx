import { Calendar, Clock, MapPin, Users, Building2, Plane } from 'lucide-react';
import React, { useState } from 'react';

const terminalTypes = [
    { label: 'Airport', icon: <Plane className="w-5 h-5 mr-2 text-icon-color" /> },
    { label: 'Railway', icon: <Building2 className="w-5 h-5 mr-2 text-icon-color" /> },
];

const pickupTerminals = ['Delhi Airport T3', 'New Delhi Railway Station'];
const dropLocations = ['Taj Palace Hotel', 'Connaught Place'];

const TerminalTransfer = () => {
    const [mode, setMode] = useState<'pickup' | 'drop'>('pickup');
    const [formData, setFormData] = useState({
        terminalType: 'Airport',
        pickupTimeType: 'Schedule',
        pickupDate: '',
        pickupTime: '',
        pickupLocation: '',
        dropLocation: '',
        guests: 2,
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white px-6 pt-6 pb-8 w-full max-w-md mx-auto font-sans">
            <h2 className="text-2xl font-semibold text-heading-black mb-7 text-center font-sans">Book a Cab</h2>
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
            {/* Terminal Type */}
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Terminal Type</label>
                <div className="relative w-full max-w-xs mx-auto">
                    <select
                        className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-4 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                        value={formData.terminalType}
                        onChange={e => handleChange('terminalType', e.target.value)}
                    >
                        {terminalTypes.map(t => (
                            <option key={t.label} value={t.label}>{t.label}</option>
                        ))}
                    </select>
                    <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                        {terminalTypes.find(t => t.label === formData.terminalType)?.icon}
                    </span>
                </div>
            </div>
            {/* Pickup Time */}
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Pickup Time</label>
                <div className="flex items-center gap-8 mb-3">
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.pickupTimeType === 'Now'} onChange={() => handleChange('pickupTimeType', 'Now')} className="accent-indigo-600" /> Now
                    </label>
                    <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
                        <input type="radio" checked={formData.pickupTimeType === 'Schedule'} onChange={() => handleChange('pickupTimeType', 'Schedule')} className="accent-indigo-600" /> Schedule
                    </label>
                </div>
                {formData.pickupTimeType === 'Schedule' && (
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.pickupDate}
                                onChange={e => handleChange('pickupDate', e.target.value)}
                            />
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="time"
                                className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans"
                                value={formData.pickupTime}
                                onChange={e => handleChange('pickupTime', e.target.value)}
                            />
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                        </div>
                    </div>
                )}
            </div>
            {/* Pickup/Drop Location */}
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">
                    {mode === 'pickup' ? 'Pickup Location (Terminal)' : 'Pickup Location'}
                </label>
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder={mode === 'pickup' ? 'Enter pickup location' : 'Enter pickup location'}
                        className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                        value={formData.pickupLocation}
                        onChange={e => handleChange('pickupLocation', e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                </div>
                {mode === 'pickup' && (
                    <div className="flex gap-3 flex-wrap">
                        {pickupTerminals.map(loc => (
                            <button
                                key={loc}
                                type="button"
                                className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                                onClick={() => handleChange('pickupLocation', loc)}
                            >
                                <Plane className="w-4 h-4 text-icon-color" /> {loc}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-7">
                <label className="block text-sm font-medium text-heading-black mb-2 font-sans">
                    {mode === 'pickup' ? 'Drop Location' : 'Drop Location (Terminal)'}
                </label>
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder={mode === 'pickup' ? 'Enter drop location' : 'Enter drop location (terminal)'}
                        className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
                        value={formData.dropLocation}
                        onChange={e => handleChange('dropLocation', e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
                </div>
                {mode === 'drop' && (
                    <div className="flex gap-3 flex-wrap">
                        {pickupTerminals.map(loc => (
                            <button
                                key={loc}
                                type="button"
                                className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                                onClick={() => handleChange('dropLocation', loc)}
                            >
                                <Plane className="w-4 h-4 text-icon-color" /> {loc}
                            </button>
                        ))}
                    </div>
                )}
                {mode === 'pickup' && (
                    <div className="flex gap-3 flex-wrap mt-2">
                        {dropLocations.map(loc => (
                            <button
                                key={loc}
                                type="button"
                                className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
                                onClick={() => handleChange('dropLocation', loc)}
                            >
                                <Building2 className="w-4 h-4 text-icon-color" /> {loc}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Number of Guests */}
            <div className="mb-10">
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
            {/* Search Button */}
            <button className="w-full py-4 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-lg font-semibold text-lg shadow-md hover:bg-hero-green transition font-sans">Search for Cab</button>
        </div>
    );
};

export default TerminalTransfer; 