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
    
    // Determine booking state
    const isPending = booking.booking_status === 'pending' || booking.booking_status === 'awaiting_supplier_confirmation';
    const isConfirmed = booking.booking_status === 'confirmed';
    const timingType = userInput.timing || 'now';
    const isNowBooking = timingType === 'now';
    const isScheduledBooking = timingType === 'later';

    // Status steps for booking progress
    const getStatusSteps = () => {
        if (isPending) {
            return [
                { label: 'Requested', key: 'requested' },
                { label: 'Pending', key: 'pending' },
                { label: 'Confirmed', key: 'confirmed' },
            ];
        } else {
            return [
                { label: 'Requested', key: 'requested' },
                { label: 'Confirmed', key: 'confirmed' },
                { label: isNowBooking ? 'Driver Onway' : 'Scheduled', key: 'onway' },
            ];
        }
    };

    const statusSteps = getStatusSteps();

    // Determine current status index
    let currentStatusIndex = 0;
    if (isPending) {
        if (booking.booking_status === 'awaiting_supplier_confirmation') {
            currentStatusIndex = 1;
        }
    } else if (isConfirmed) {
        currentStatusIndex = isNowBooking ? 2 : 1;
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

    // Get header content based on state
    const getHeaderContent = () => {
        if (isPending) {
            return {
                title: isScheduledBooking ? 'Booking Scheduled' : 'Booking Requested',
                subtitle: isScheduledBooking ? 'Awaiting operator confirmation' : 'Finding available operators',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-600'
            };
        } else if (isConfirmed) {
            if (isNowBooking) {
                return {
                    title: 'Booking Confirmed',
                    subtitle: 'Your Ride is On the Way!',
                    message: 'Please be ready at your pickup point',
                    // bgColor: 'bg-green-50',
                    textColor: 'text-blue-800',
                    iconColor: 'text-blue-600'
                };
            } else {
                return {
                    title: 'Booking Confirmed',
                    subtitle: assignment ? 'Driver Assigned' : 'Scheduled Successfully',
                    message: assignment ? 'Driver will contact you before pickup' : 'Driver will be assigned closer to pickup time',
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600'
                };
            }
        }
        return { title: '', subtitle: '', bgColor: '', textColor: '', iconColor: '' };
    };

    const headerContent = getHeaderContent();

    // Get estimated wait time
    const getEstimatedWaitTime = () => {
        if (isPending) {
            return isScheduledBooking ? '30 mins - 1 hour' : '5-10 mins';
        }
        return null;
    };

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
                <div className={`rounded-xl ${headerContent.bgColor} p-4`}>
                    {/* Success Icon for Confirmed Bookings */}
                    {isConfirmed && (
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-4">
                        <h2 className={`text-lg font-semibold ${headerContent.textColor} mb-1`}>
                            {headerContent.title}
                        </h2>
                        <p className="text-xl font-bold text-gray-900 mb-2">
                            {headerContent.subtitle}
                        </p>
                        {headerContent.message && (
                            <p className="text-sm text-gray-600">
                                {headerContent.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <div className={`text-sm font-semibold ${headerContent.textColor} flex items-center gap-2`}>
                            <Clock className="w-4 h-4" />
                            {isScheduledBooking && userInput.pickup_date && userInput.pickup_time && (
                                <span>Scheduled for {userInput.pickup_date} at {userInput.pickup_time}</span>
                            )}
                        </div>
                        <span className={`text-xs ${timingType === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} font-semibold px-2 py-1 rounded-xl`}>
                            {timingType === 'now' ? 'On-demand' : 'Scheduled'}
                        </span>
                    </div>
                    
                    {getEstimatedWaitTime() && (
                        <div className="text-sm text-gray-600 mb-2">
                            Estimated {isPending ? 'confirmation' : 'wait'} time <span className="font-medium text-gray-900">{getEstimatedWaitTime()}</span>
                        </div>
                    )}
                    
                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-4 relative">
                        {statusSteps.map((step, idx) => {
                            const isCompleted = idx < currentStatusIndex;
                            const isCurrent = idx === currentStatusIndex;
                            const circleClass = isCompleted
                                ? `bg-indigo-600 border-indigo-600 text-white`
                                : isCurrent
                                    ? `bg-indigo-500 border-indigo-500 text-white`
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
                                        <span className={`text-xs mt-1 ${isCompleted || isCurrent ? `text-indigo-600 font-medium` : 'text-gray-400'}`}>
                                            {step.label}
                                        </span>
                                        {idx < statusSteps.length - 1 && (
                                            <div className={`absolute top-4 left-1/2 w-full h-0.5 bg-indigo-500 z-10`} />
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                    
                    {isPending && (
                        <p className="text-xs flex gap-2 items-start text-gray-500 mt-4">
                            <Bell className={`w-4 h-4 ${headerContent.iconColor} flex-shrink-0`} />
                            We'll notify you via SMS & WhatsApp once an operator confirms your {isScheduledBooking ? 'scheduled' : ''} booking
                        </p>
                    )}
                </div>

                {/* Driver Details Card - Only for confirmed bookings */}
                {isConfirmed && (
                    <>
                        {assignment && (isNowBooking || (isScheduledBooking && assignment.driver_name)) ? (
                            <div className="rounded-xl border p-4">
                                <h3 className="text-sm font-semibold mb-3 text-gray-800">Driver Details</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-semibold text-gray-600">
                                            {assignment.driver_name?.charAt(0) || acceptedRequest?.supplier_name?.charAt(0) || 'R'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">
                                            {assignment.driver_name || acceptedRequest?.supplier_name || 'Rajesh Kumar'}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>4.8 (2.3k)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Vehicle</span>
                                        <div className="font-medium text-gray-800">
                                            {assignment.vehicle_model || 'Toyota Innova'} ({booking.car_category_name || 'White'})
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">Plate Number</span>
                                        <div className="font-medium text-gray-800">
                                            {assignment.registration_number || 'MH 01 AB 1234'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {booking.car_category_name || 'SUV'} • {booking.is_ac ? 'AC' : 'Non-AC'} • {booking.pax_count} Seater
                                    </div>
                                </div>

                                {isNowBooking && (
                                    <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Driver
                                    </button>
                                )}
                            </div>
                        ) : isScheduledBooking && !assignment ? (
                            <div className="rounded-xl border p-4 bg-gray-50">
                                <h3 className="text-sm font-semibold mb-3 text-gray-800">Driver Assignment</h3>
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Clock className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Driver will be assigned closer to your pickup time
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        You'll receive notification once assigned
                                    </p>
                                </div>
                            </div>
                        ) : null}
                    </>
                )}

                {/* Service Type and Route */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{getServiceDisplayName(booking.service_type)}</span>
                        <span className={`text-xs ${timingType === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} font-semibold px-2 py-1 rounded-xl`}>
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

                        {/* Show pickup date/time for scheduled bookings */}
                        {isScheduledBooking && userInput.pickup_date && userInput.pickup_time && (
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Pickup Date & Time</div>
                                    <div className="font-medium text-gray-800 text-sm">
                                        {userInput.pickup_date} at {userInput.pickup_time}
                                    </div>
                                </div>
                            </div>
                        )}

                        {userInput.estimated_duration && (
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Estimated Trip Duration</div>
                                    <div className="font-medium text-gray-800 text-sm">{userInput.estimated_duration}</div>
                                </div>
                            </div>
                        )}

                        {userInput.estimated_distance && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <div className="text-xs text-gray-500">Trip Distance</div>
                                    <div className="font-medium text-gray-800 text-sm">{userInput.estimated_distance}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fare Details - Only for confirmed bookings */}
                {isConfirmed && booking.total_price && (
                    <div className="rounded-xl border p-4">
                        <h3 className="text-sm font-semibold mb-3 text-gray-800">Fare Details</h3>
                        
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-gray-900">Total Fare</span>
                            <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">₹{booking.total_price}</div>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Cash Only</span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <Clock className="w-3 h-3" />
                            Pay directly to driver after ride completion
                        </div>

                        {acceptedRequest?.fareDetails && (
                            <div className="mt-3 pt-3 border-t">
                                <div className="text-sm font-medium mb-2">Included:</div>
                                <p className="text-xs text-gray-600">
                                    Base fare, fuel, driver services, taxes. Driver allowance and night charges (in case of night drive).
                                </p>
                                
                                <div className="text-sm font-medium mb-2 mt-3">Excluded (Offline):</div>
                                <p className="text-xs text-gray-600">
                                    Tolls, parking, permits, and state taxes
                                </p>
                                
                                <div className="mt-3 space-y-1">
                                    <div className="flex items-center gap-2 text-xs text-blue-600">
                                        <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                        </div>
                                        ₹200/hr + ₹18/km for detours
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-600">
                                        <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                        </div>
                                        Additional charges will apply for town/village/city changes
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* WhatsApp Updates - Only for pending bookings */}
                {isPending && (
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
                )}

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
                            {booking_requests[0].supplier_name || 'FastCabs'}
                            {isConfirmed && <span className="text-blue-500 text-xs">✔</span>}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                {isPending && (
                    <div className="flex gap-3">
                        <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium">
                            Cancel Booking
                        </button>
                        <button className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium">
                            Get Help
                        </button>
                    </div>
                )}

                {isConfirmed && (
                    <div className="space-y-3">
                        {!isNowBooking && (
                            <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium">
                                Get Help
                            </button>
                        )}
                        <button className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-medium">
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails; 