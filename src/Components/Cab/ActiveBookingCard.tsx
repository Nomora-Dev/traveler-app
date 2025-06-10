import React from 'react';
import { Car, Calendar, MapPin, Clock } from 'lucide-react';

interface ActiveBookingCardProps {
    bookingObject: any;
}

const ActiveBookingCard: React.FC<ActiveBookingCardProps> = ({ bookingObject }) => {
    const { booking, booking_requests, assignment } = bookingObject;
    console.log(bookingObject);
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 max-w-md mx-auto mb-6">
            {/* Status and type */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={`${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} text-xs font-semibold px-3 py-1 rounded-full`}>{booking.booking_status === 'confirmed' ? 'Confirmed' : 'Pending'}</span>
                    <span className="text-xs text-gray-500">• {booking.service_type === 'city' ? 'City Transfer' : booking.service_type === 'terminal' ? 'Terminal Transfer' : booking.service_type === 'hourly' ? 'Hourly Rental' : 'Multi-day Rental'}</span>
                </div>
                <div className="text-xl font-bold text-heading-black">₹{booking_requests && (booking_requests[0].faredetails.total_fare || booking_requests[0].faredetails.calculated_final_price) || '1,200'}</div>
            </div>
            {/* Car type and date/time */}
            <div className="flex items-center gap-2 mb-2">
                <Car className="w-6 h-6 text-purple-400 bg-purple-100 rounded-full p-1" />
                <span className="font-semibold text-heading-black">{booking.car_category_name || 'Mini'}</span>
                <Calendar className="w-4 h-4 text-gray-400 ml-2" />
                <span className="text-xs text-gray-500">{booking.pickup_date || new Date().toLocaleDateString()} • {booking.pickup_time || new Date().toLocaleTimeString()}</span>
            </div>
            <hr className="my-2" />
            {/* Pickup & Drop */}
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Pickup</span>
                </div>
                <div className="font-semibold text-heading-black text-sm mb-2 ml-4">{booking.pickup_location}</div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-xs text-gray-500">Drop</span>
                </div>
                <div className="font-semibold text-heading-black text-sm ml-4">{booking.drop_location}</div>
            </div>
            {/* Status badges */}
            <div className="flex gap-2 mb-3">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {assignment ? 'Driver Assigned' : 'Driver Not Assigned'}
                </span>
                <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" /><path d="M12 17v.01" /></svg>
                    {booking.payment_status[0].toUpperCase() + booking.payment_status.slice(1)}
                </span>
            </div>
            {/* Button */}
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl transition">View Booking Details</button>
        </div>
    );
};

export default ActiveBookingCard; 