import React from 'react';
import { Clock, Car, MapPin, LocateIcon, Phone, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingConfirmationSharedProps {
    bookingDetails: any;
    type: string;
    userInput: any;
}

const statusSteps = [
    { label: 'Requested', key: 'requested' },
    { label: 'Pending', key: 'pending' },
    { label: 'Driver Onway', key: 'onway' },
];

const BookingConfirmationShared: React.FC<BookingConfirmationSharedProps> = ({ bookingDetails, type, userInput }) => {
    const navigate = useNavigate();
    let booking = bookingDetails;
    booking.status = 'confirmed';
    const currentStatusIndex = statusSteps.findIndex(step => step.key === booking.status) + 2;

    // Dynamic fields for each type
    let pickupInfo = null;
    let tripDetails = null;

    console.log(bookingDetails, userInput);

    // Helper: is driver assigned?
    const driverAssigned = booking.driver && booking.driver.name;

    // Banner and driver info logic
    let statusBanner = null;
    if (booking.status === 'completed') {
        statusBanner = (
            <div className="flex flex-col items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="text-lg font-bold text-green-700">Trip Completed</div>
            </div>
        );
    } else if (booking.status === 'confirmed') {
        statusBanner = (
            <div className="flex flex-col items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="text-lg font-bold text-indigo-700">Booking Confirmed!</div>
                {userInput.pickup_time_type === 'later' && !driverAssigned && (
                    <div className="text-xs text-gray-500 mt-1">Driver will be assigned 4 hours before pickup</div>
                )}
            </div>
        );
    }

    // Driver info or pending
    let driverSection = null;
    if (booking.status === 'confirmed' && driverAssigned) {
        driverSection = (
            <div className="rounded-xl border p-4 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                    <div className="font-semibold text-gray-800">{booking.driver.name}</div>
                    <div className="text-xs text-gray-500">{booking.driver.phone}</div>
                    <div className="text-xs text-gray-500">{booking.driver.vehicle} • {booking.driver.plate}</div>
                </div>
                <a href={`tel:${booking.driver.phone}`} className="ml-auto bg-indigo-600 text-white px-3 py-1 rounded text-xs">Call</a>
            </div>
        );
    } else if (booking.status === 'confirmed' && userInput.pickup_time_type === 'later' && !driverAssigned) {
        driverSection = (
            <div className="rounded-xl border p-4 mb-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.201 20.5 1 15.299 1 9.5S6.201-1.5 12-1.5 23 4.701 23 10.5 17.799 20.5 12 20.5z" /></svg>
                </div>
                <div className="font-semibold text-gray-700">Driver Details Pending</div>
                <div className="text-xs text-gray-500 mt-1">Driver and vehicle details will be assigned 4 hours before your scheduled pickup</div>
                <button className="mt-2 w-full bg-gray-100 text-gray-400 py-2 rounded" disabled>
                    <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v10m0 0a2 2 0 01-2 2H7a2 2 0 01-2-2V10m11 10a2 2 0 002-2V10m-2 10V10" /></svg>
                    Call Driver
                </button>
            </div>
        );
    }

    if (type === 'city' || type === 'terminal') {
        pickupInfo = (
            <div className="rounded-xl border p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{type === 'terminal' ? 'Terminal Transfer' : 'City Transfer'}</span>
                    <span className={`text-xs ${userInput.pickup_time_type === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-200 text-blue-800'} font-semibold px-2 py-1 rounded-xl`}>
                        {userInput.pickup_time_type === 'now' ? 'On-demand' : 'Scheduled'}
                    </span>
                </div>
                <div className="text-base font-semibold text-gray-800 mb-1">Pickup from {booking.pickup_location}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    {booking.vehicle_type} • {booking.pax_count} Seater • {booking.ac}
                </div>
            </div>
        );
        tripDetails = (
            <div className="rounded-xl border p-4 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">Trip Details</h3>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Pickup Location</div>
                            <div className="font-medium text-gray-800">{booking.pickup_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <LocateIcon className="w-4 h-4 text-orange-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Drop Location</div>
                            <div className="font-medium text-gray-800">{booking.drop_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <div className="flex flex-col">
                        <div>Estimated Trip Duration</div>
                        <div className="font-medium text-gray-800">{booking.estimated_duration}</div>
                    </div>
                </div>
            </div>
        );
    } else if (type === 'hourly') {
        pickupInfo = (
            <div className="rounded-xl border p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Hourly Rental</span>
                    <span className={`text-xs ${userInput.pickup_time_type === 'now' ? 'bg-orange-100 text-orange-700' : 'bg-blue-200 text-blue-800'} font-semibold px-2 py-1 rounded-xl`}>
                        {userInput.pickup_time_type === 'now' ? 'On-demand' : 'Scheduled'}
                    </span>
                </div>
                <div className="text-base font-semibold text-gray-800 mb-1">Pickup from {booking.pickup_location}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    {booking.vehicle_type} • {booking.pax_count} Seater • {booking.ac}
                </div>
            </div>
        );
        tripDetails = (
            <div className="rounded-xl border p-4 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">Trip Details</h3>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Pickup Location</div>
                            <div className="font-medium text-gray-800">{booking.pickup_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <LocateIcon className="w-4 h-4 text-orange-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Drop Location</div>
                            <div className="font-medium text-gray-800">{booking.drop_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <div className="flex flex-col">
                        <div>Estimated Hours</div>
                        <div className="font-medium text-gray-800">{booking.userInput.hours} Hours | {booking.pricing.included_kms} km included</div>
                    </div>
                </div>
            </div>
        );
    } else if (type === 'multiday') {
        pickupInfo = (
            <div className="rounded-xl border p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Multiday Rental</span>
                </div>
                <div className="text-base font-semibold text-gray-800 mb-1">Pickup from {booking.pickup_location}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    {booking.vehicle_type} • {booking.pax_count} Seater • {booking.ac}
                </div>
            </div>
        );
        tripDetails = (
            <div className="rounded-xl border p-4 mb-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-800">Trip Details</h3>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Pickup Location</div>
                            <div className="font-medium text-gray-800">{booking.pickup_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <LocateIcon className="w-4 h-4 text-orange-600" />
                        <div>
                            <div className="font-normal text-sm text-gray-500">Drop Location</div>
                            <div className="font-medium text-gray-800">{booking.drop_location}</div>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <div className="flex flex-col">
                        <div>Estimated Days</div>
                        <div className="font-medium text-gray-800">{booking.estimated_days}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4 font-sans">
            {/* Back Button */}
            <button className="mb-4 text-indigo-600 flex items-center gap-1" onClick={() => navigate(-1)}>
                ← Back
            </button>
            {/* Status Card */}
            <div className="rounded-xl bg-indigo-50 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-indigo-800 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Pending Operator Confirmation
                    </div>
                    <span className={`text-xs ${userInput.pickup_time_type === 'now' ? 'bg-yellow-200 text-yellow-700' : 'bg-blue-200 text-blue-800'} font-semibold px-2 py-1 rounded-xl`}>
                        {userInput.pickup_time_type === 'now' ? 'On-demand' : 'Scheduled'}
                    </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                    Estimated wait time <span className="font-medium text-gray-900">{booking.waitTime}</span>
                </div>
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
                                    {/* Circle */}
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${circleClass} z-20`}>
                                        {isCompleted ? (
                                            <span className="text-lg">✓</span>
                                        ) : (
                                            <span className="w-2 h-2 rounded-full bg-current block"></span>
                                        )}
                                    </div>
                                    {/* Label */}
                                    <span className={`text-xs mt-1 ${isCompleted || isCurrent ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                    {/* Connector line */}
                                    {idx < statusSteps.length - 1 && (
                                        <div
                                            className={`absolute top-4 transform translate-x-1/2 w-full z-10 h-0.5 ${isCompleted ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                        />
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                <p className="text-xs flex gap-2 items-start text-gray-500 mt-2">
                    <Bell className="w-4 h-4 text-indigo-600" />
                    We'll notify you via SMS & WhatsApp when your booking is confirmed
                </p>
            </div>
            {statusBanner}
            {driverSection}
            {/* Pickup Info */}
            {pickupInfo}
            {/* Trip Details */}
            {tripDetails}
            {/* WhatsApp Updates */}
            <div className="rounded-xl border p-4 mb-4 bg-green-50">
                <div className="flex items-center gap-2 text-sm text-green-900 mb-2">
                    <Phone className="w-4 h-4" />
                    Get instant updates on WhatsApp
                </div>
                <p className="text-xs text-gray-700 mb-3">Receive driver details, booking status, and trip updates instantly on WhatsApp</p>
                <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white text-sm py-2 rounded-md">Allow</button>
                    <button className="flex-1 border text-sm py-2 rounded-md">Don't Allow</button>
                </div>
            </div>
            {/* Booking Meta */}
            <div className="rounded-xl border p-4 text-sm text-gray-700">
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Booking ID</span>
                    <span className="font-medium text-gray-800">{booking.id}</span>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Booking Date</span>
                    <span className="font-medium text-gray-800">{booking.date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Operator</span>
                    <span className="font-medium text-gray-800">{booking.operator} <span className="text-blue-500">✔</span></span>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmationShared; 