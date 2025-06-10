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
    const pickup_time_type = booking.pickup_time_type || 'now';
    const isNowBooking = pickup_time_type === 'now';
    const isScheduledBooking = pickup_time_type === 'schedule';
    const pricing_framework = booking_requests[0].pricing_framework[0] || {};

    console.log(pricing_framework);

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
            case 'city': return 'Intercity Transfer';
            case 'terminal': return 'Terminal Transfer';
            case 'hourly': return 'Hourly Rental';
            case 'multiday': return 'Multiday Rental';
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
                    // bgColor: 'bg-blue-50',
                    textColor: 'text-blue-800',
                    iconColor: 'text-blue-600'
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

    // Pricing framework for fare details by service type
    const pricingFramework: Record<string, {
        included: string[],
        excluded: string[],
        notes: string[]
    }> = {
        city: {
            included: [
                'Base fare, fuel, driver services, taxes.',
                'Driver allowance and night charges (in case of night drive).'
            ],
            excluded: [
                'Tolls, parking, permits, and state taxes'
            ],
            notes: [
                '₹200/hr + ₹18/km for detours',
                'Additional charges will apply for town/village/city changes'
            ]
        },
        terminal: {
            included: [
                'Base fare, fuel, driver services, taxes.'
            ],
            excluded: [
                'Tolls, parking, permits, and state taxes'
            ],
            notes: [
                '₹150/hr + ₹15/km for detours',
                'Extra charges for airport parking if applicable'
            ]
        },
        hourly: {
            included: [
                'Base fare, fuel, driver services, taxes.',
                'Driver allowance included.'
            ],
            excluded: [
                'Tolls, parking, permits, and state taxes'
            ],
            notes: [
                '10min grace period at trip end; charges apply after',
                'No refund for unused time/km',
                'Service valid within city/town limits'
            ]
        },
        multiday: {
            included: [
                'Base fare, fuel, driver services, taxes.',
                'Driver allowance and night charges included.'
            ],
            excluded: [
                'Tolls, parking, permits, and state taxes',
                'Hotel accommodation for driver (if required)'
            ],
            notes: [
                'Extra km and day charges as per policy',
                'Additional charges for inter-state travel'
            ]
        }
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
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
                            {isScheduledBooking && userInput.pickup_date && userInput.pickup_time && (
                                <>
                                    <Clock className="w-4 h-4" />
                                    <span>Scheduled for {userInput.pickup_date} at {userInput.pickup_time}</span>
                                </>
                            )}
                        </div>
                        {!isConfirmed && (
                            <span className={`text-xs ${pickup_time_type === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} font-semibold px-2 py-1 rounded-xl`}>
                                {pickup_time_type === 'now' ? 'On-demand' : 'Scheduled'}
                            </span>
                        )}
                    </div>

                    {getEstimatedWaitTime() && (
                        <div className="text-sm text-gray-600 mb-2">
                            Estimated {isPending ? 'confirmation' : 'wait'} time <span className="font-medium text-gray-900">{getEstimatedWaitTime()}</span>
                        </div>
                    )}

                    {/* Progress Steps */}
                    {!assignment && (
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
                    )}

                    {isPending && (
                        <p className="text-xs flex gap-2 items-start text-gray-500 mt-4">
                            <Bell className={`w-4 h-4 ${headerContent.iconColor} flex-shrink-0`} />
                            We'll notify you via SMS & WhatsApp once an operator confirms your {isScheduledBooking ? 'scheduled' : ''} booking
                        </p>
                    )}
                </div>

                {/* Trip Details - Redesigned as per screenshot */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-start gap-4">
                        {/* Left: Dots and line */}
                        <div className="flex flex-col items-center pt-1">
                            <span className="w-3 h-3 rounded-full bg-purple-600 block"></span>
                            <span className="w-0.5 h-8 bg-gray-300 my-1"></span>
                            <span className="w-3 h-3 rounded-full bg-green-600 block"></span>
                        </div>
                        {/* Right: Locations and date/time */}
                        <div className="flex-1">
                            {/* Pickup */}
                            <div>
                                <div className="text-xs text-gray-500">Pickup</div>
                                <div className="font-medium text-gray-800 text-sm">{booking.pickup_location}</div>
                                {isScheduledBooking && userInput.pickup_date && userInput.pickup_time && (
                                    <div className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
                                        {userInput.pickup_date} • {userInput.pickup_time}
                                    </div>
                                )}
                            </div>
                            {/* Drop */}
                            <div className="mt-6">
                                <div className="text-xs text-gray-500">Drop</div>
                                <div className="font-medium text-gray-800 text-sm">{booking.drop_location}</div>
                            </div>
                        </div>
                    </div>
                    {/* Est time and distance below, side by side */}
                    <div className="flex gap-4 mt-6">
                        {userInput.estimated_duration && (
                            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-700">{userInput.estimated_duration} mins</span>
                            </div>
                        )}
                        {userInput.estimated_distance && (
                            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-700">{userInput.estimated_distance} km</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Driver Details Card - Only for confirmed bookings, after trip details */}
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

                {/* Package Fare Card - styled as per screenshot, above Fare Details */}
                {isConfirmed && (
                    <>
                        <hr className="my-4" />
                        <div className="rounded-xl border p-4 bg-white mb-2">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-base font-medium text-gray-700">Package Fare</span>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Cash Only</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                                ₹{(booking_requests && booking_requests[0]?.faredetails?.total_fare) ? booking_requests[0].faredetails.total_fare : (booking.total_price || '--')}
                            </div>
                            <div className="text-xs text-gray-600 flex items-center gap-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Pay directly to driver after ride completion
                            </div>
                        </div>
                        <hr className="my-4" />
                    </>
                )}

                {/* Fare Details Card - always for confirmed bookings, below driver */}
                {isConfirmed && (
                    <div className="rounded-xl border p-4 bg-white">
                        <h3 className="text-base font-semibold mb-3 text-gray-900">
                            Package Fare
                        </h3>
                        ₹ {booking_requests[0].faredetails.total_fare}
                        <h3 className="text-base font-semibold mb-3 text-gray-900">Fare Details</h3>
                        {/* Included */}
                        <div className="mb-2">
                            <div className="font-bold text-sm mb-1">Included:</div>
                            <ul className="text-xs text-gray-700 list-disc pl-4">
                                {(pricingFramework[booking.service_type]?.included || []).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        {/* Excluded */}
                        <div className="mb-2">
                            <div className="font-bold text-sm mb-1">Excluded (Offline):</div>
                            <ul className="text-xs text-gray-700 list-disc pl-4">
                                {(pricingFramework[booking.service_type]?.excluded || []).map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <hr className="my-3" />
                        {/* Notes */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-blue-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                ₹{pricing_framework.base_hourly}/hr for extra time (billed per 30 mins)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                ₹{pricing_framework.extra_km_charge}/km beyond {pricing_framework.included_kms} km
                            </div>
                            {pricingFramework[booking.service_type]?.notes && pricingFramework[booking.service_type]?.notes?.map((note, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-blue-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    {note}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Service Type and Route (keep after fare details) */}
                <div className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{getServiceDisplayName(booking.service_type)}</span>
                        <span className={`text-xs ${pickup_time_type === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'} font-semibold px-2 py-1 rounded-xl`}>
                            {pickup_time_type === 'now' ? 'On-demand' : 'Scheduled'}
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