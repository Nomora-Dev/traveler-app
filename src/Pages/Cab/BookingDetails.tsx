import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Star, Car, Phone, ArrowLeft, Bell, LocateIcon } from 'lucide-react';
import { getBookingDetails } from '../../services/cab';

const BookingDetails: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!bookingId) {
                setError('Booking ID not found');
                setLoading(false);
                return;
            }

            try {
                const response = await getBookingDetails(bookingId);
                setBookingData(response);
            } catch (err) {
                console.error('Error fetching booking details:', err);
                setError('Failed to fetch booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (error || !bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Booking not found'}</p>
                    <button 
                        onClick={() => navigate('/cab')}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { booking, booking_requests, assignment } = bookingData;
    const userInput = booking.userinput || {};
    const acceptedRequest = booking_requests?.find((req: any) => req.status === 'accepted' || req.status === 'confirmed');

    // Status steps for booking progress
    const statusSteps = [
        { label: 'Requested', key: 'requested' },
        { label: 'Pending', key: 'pending' },
        { label: 'Driver Onway', key: 'onway' },
    ];

    // Determine current status index
    let currentStatusIndex = 0;
    if (booking.booking_status === 'awaiting_supplier_confirmation') {
        currentStatusIndex = 1;
    } else if (booking.booking_status === 'confirmed') {
        currentStatusIndex = 2;
    }

    // Service type display name
    const getServiceDisplayName = (serviceType: string) => {
        switch (serviceType) {
            case 'city_transfer': return 'Intercity Transfer';
            case 'terminal_transfer': return 'Terminal Transfer';
            case 'hourly_rental': return 'Hourly Rental';
            case 'multiday_rental': return 'Multiday Rental';
            default: return 'Transfer';
        }
    };

    // Get timing type (assuming from userInput)
    const timingType = userInput.timing || 'now';

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="p-4 border-b">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/cab')}
                        className="text-gray-600"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-semibold">Booking Details</h1>
                    <div className="ml-auto">
                        <button className="text-gray-600">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Status Card */}
                <div className="rounded-xl bg-indigo-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {booking.booking_status === 'confirmed' ? 'Booking Confirmed' : 'Pending Operator Confirmation'}
                        </div>
                        <span className={`text-xs ${timingType === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-200 text-blue-800'} font-semibold px-2 py-1 rounded-xl`}>
                            {timingType === 'now' ? 'On-demand' : 'Scheduled'}
                        </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                        Estimated confirmation time <span className="font-medium text-gray-900">5-10 mins</span>
                    </div>
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-4 relative">
                        {statusSteps.map((step, idx) => {
                            const isCompleted = idx < currentStatusIndex;
                            const isCurrent = idx === currentStatusIndex;
                            const circleClass = isCompleted
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : isCurrent
                                    ? 'bg-indigo-500 border-indigo-500 text-white'
                                    : 'bg-gray-200 border-gray-300 text-gray-400';
                            return (
                                <React.Fragment key={step.key}>
                                    <div className="flex flex-col items-center flex-1 relative">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${circleClass} z-20`}>
                                            {isCompleted ? (
                                                <span className="text-lg">✓</span>
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-current block"></span>
                                            )}
                                        </div>
                                        <span className={`text-xs mt-1 ${isCompleted || isCurrent ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {idx < statusSteps.length - 1 && (
                                            <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isCompleted ? 'bg-indigo-500' : 'bg-gray-200'} z-10`} />
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                    
                    <p className="text-xs flex gap-2 items-start text-gray-500 mt-4">
                        <Bell className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        We'll notify you via SMS & WhatsApp once an operator confirms your scheduled booking
                    </p>
                </div>

                {/* Service Type and Route */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{getServiceDisplayName(booking.service_type)}</span>
                        <span className={`text-xs ${timingType === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-200 text-blue-800'} font-semibold px-2 py-1 rounded-xl`}>
                            {timingType === 'now' ? 'On-demand' : 'Scheduled'}
                        </span>
                    </div>
                    <div className="text-base font-semibold text-gray-800 mb-1">
                        {booking.pickup_location} to {booking.drop_location?.split(',')[0] || 'Drop Location'}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {booking.car_category_name || 'SUV'} • {booking.pax_count} Seater • {booking.is_ac ? 'AC' : 'Non-AC'}
                    </div>
                </div>

                {/* Trip Details */}
                <div className="rounded-xl border p-4">
                    <h3 className="text-sm font-semibold mb-3 text-gray-800">Trip Details</h3>
                    
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-gray-500">Pickup Location</div>
                                <div className="font-medium text-gray-800 text-sm">{booking.pickup_location}</div>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <LocateIcon className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="text-xs text-gray-500">Drop Location</div>
                                <div className="font-medium text-gray-800 text-sm">{booking.drop_location}</div>
                            </div>
                        </div>

                        {userInput.estimated_duration && (
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Estimated Trip Duration</div>
                                    <div className="font-medium text-gray-800 text-sm">{userInput.estimated_duration}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* WhatsApp Updates */}
                <div className="rounded-xl border p-4 bg-green-50">
                    <div className="flex items-center gap-2 text-sm text-green-900 mb-2">
                        <Phone className="w-4 h-4" />
                        Get instant updates on WhatsApp
                    </div>
                    <p className="text-xs text-gray-700 mb-3">
                        Get instant updates about your intercity trip, driver details and live location tracking on WhatsApp
                    </p>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 text-white text-sm py-2 rounded-md font-medium">
                            Allow
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 text-sm py-2 rounded-md">
                            Don't Allow
                        </button>
                    </div>
                </div>

                {/* Booking Information */}
                <div className="rounded-xl border p-4 text-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500">Booking ID</span>
                        <span className="font-medium text-gray-800">{booking.id?.substring(0, 8)?.toUpperCase() || 'BK1278459'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500">Booking Date</span>
                        <span className="font-medium text-gray-800">
                            {new Date(booking.created_at).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Operator</span>
                        <span className="font-medium text-gray-800 flex items-center gap-1">
                            {acceptedRequest?.supplier_name || 'FastCabs'}
                            <span className="text-blue-500 text-xs">✔</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails; 