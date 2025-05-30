import React, { useState } from 'react';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';

const quickPickup = ['Hotel Sunrise, Manali', 'Mall Road', 'Old Bus Stand'];
const quickDrop = ['Shimla', 'Kullu', 'Dharamshala'];
const popularDestinations = [
  { name: 'Shimla', link: '#' },
  { name: 'Kullu', link: '#' },
  { name: 'Dharamshala', link: '#' },
];

const CityTransfer = () => {
  const [formData, setFormData] = useState({
    pickupTimeType: 'Now',
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
      <h2 className="text-2xl font-semibold text-heading-black mb-7 text-center font-sans">Book a City Transfer</h2>
      {/* Pickup Time */}
      <div className="mb-7">
        <div className="flex items-center gap-8 mb-3">
          <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
            <input type="radio" checked={formData.pickupTimeType === 'Now'} onChange={() => handleChange('pickupTimeType', 'Now')} className="accent-hero-green" /> Now
          </label>
          <label className="flex items-center gap-1 text-text-gray text-sm font-sans">
            <input type="radio" checked={formData.pickupTimeType === 'Schedule'} onChange={() => handleChange('pickupTimeType', 'Schedule')} className="accent-hero-green" /> Schedule
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
      {/* Pickup Location */}
      <div className="mb-7">
        <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Pickup Location</label>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Enter pickup location"
            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
            value={formData.pickupLocation}
            onChange={e => handleChange('pickupLocation', e.target.value)}
          />
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-icon-color" />
        </div>
        <div className="flex gap-3 flex-wrap">
          {quickPickup.map(loc => (
            <button
              key={loc}
              type="button"
              className="flex items-center gap-1 px-4 py-2 bg-hero-tertiary rounded-full text-xs text-heading-black border border-primary-stroke hover:bg-hero-peach/20 font-sans"
              onClick={() => handleChange('pickupLocation', loc)}
            >
              <MapPin className="w-4 h-4 text-icon-color" /> {loc}
            </button>
          ))}
        </div>
      </div>
      {/* Drop Location */}
      <div className="mb-7">
        <label className="block text-sm font-medium text-heading-black mb-2 font-sans">Drop Location</label>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Where to?"
            className="w-full border border-primary-stroke rounded-lg py-3 pl-10 pr-2 text-heading-black focus:outline-none focus:ring-2 focus:ring-hero-peach bg-white font-sans placeholder:text-text-gray"
            value={formData.dropLocation}
            onChange={e => handleChange('dropLocation', e.target.value)}
          />
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-hero-peach" />
        </div>
        <div className="text-xs text-text-gray mb-2 font-sans">Popular destinations: {popularDestinations.map((d, i) => <a key={d.name} href={d.link} className="text-indigo-600 hover:underline mx-1 font-sans">{d.name}{i < popularDestinations.length - 1 ? ',' : ''}</a>)}</div>
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

export default CityTransfer; 