import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Calendar, Clock, Users, Car } from 'lucide-react';

const CabBookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingDetails, type } = location.state || {};

    if (!bookingDetails || !type) {
        navigate('/cab');
        return null;
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="px-4 py-6">
                {/* Success Message */}
                <div className="text-center mb-8">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-semibold mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600">Your booking has been successfully confirmed</p>
                </div>

                {/* Booking ID */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Booking ID</div>
                        <div className="font-mono text-lg font-semibold">{bookingDetails.booking_id}</div>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Pickup</div>
                                <div className="font-medium">{bookingDetails.pickup_location}</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-1" />
                            <div>
                                <div className="text-sm text-gray-500">Drop</div>
                                <div className="font-medium">{bookingDetails.drop_location}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Date</div>
                                <div className="font-medium">{bookingDetails.pickup_date}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Time</div>
                                <div className="font-medium">{bookingDetails.pickup_time}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-indigo-500" />
                            <div>
                                <div className="text-sm text-gray-500">Passengers</div>
                                <div className="font-medium">{bookingDetails.pax_count} people</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">•</span>
                            <span>You will receive a confirmation SMS with booking details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">•</span>
                            <span>Driver details will be shared 30 minutes before pickup</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-500">•</span>
                            <span>Please keep your phone number active for driver contact</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-8 py-3 text-lg shadow-md transition"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={() => navigate('/cab')}
                        className="w-full bg-white border border-indigo-600 text-indigo-600 font-semibold rounded-lg px-8 py-3 text-lg shadow-sm transition hover:bg-indigo-50"
                    >
                        Book Another Ride
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CabBookingConfirmation; 