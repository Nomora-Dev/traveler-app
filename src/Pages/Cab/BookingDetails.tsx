import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Star, Car, Phone, ArrowLeft } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-2xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/cab')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
                            <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
                {/* Booking Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Booking Status</h2>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.booking_status === 'awaiting_supplier_confirmation' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {booking.booking_status?.replace(/_/g, ' ').toUpperCase()}
                        </span>
                    </div>
                    {booking.total_price && (
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-gray-900">₹{booking.total_price}</p>
                            <p className="text-sm text-gray-500">Total amount</p>
                        </div>
                    )}
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Pickup</p>
                                <p className="font-medium text-gray-900">{booking.pickup_location}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500">Drop</p>
                                <p className="font-medium text-gray-900">{booking.drop_location}</p>
                            </div>
                        </div>

                        {userInput.estimated_distance && (
                            <div className="flex items-center gap-6 text-sm text-gray-600 pt-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{userInput.estimated_distance} km</span>
                                </div>
                                {userInput.estimated_duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{userInput.estimated_duration}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle & Supplier Details */}
                {acceptedRequest && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle & Supplier</h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{acceptedRequest.supplier_name}</p>
                                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                        <Star className="w-4 h-4" />
                                        <span>4.5</span>
                                        <span className="text-gray-400">(123)</span>
                                    </div>
                                </div>
                                {acceptedRequest.proposed_price && (
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900">₹{acceptedRequest.proposed_price}</p>
                                        <p className="text-xs text-gray-500">Final price</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                    <Car className="w-4 h-4" /> {booking.car_category_name}
                                </span>
                                {booking.is_ac && (
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                        AC
                                    </span>
                                )}
                                <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    <Users className="w-4 h-4" /> {booking.pax_count} Seats
                                </span>
                            </div>

                            {acceptedRequest.vehicle_model && (
                                <p className="text-sm text-gray-600">
                                    {acceptedRequest.vehicle_model} {acceptedRequest.vehicle_number && `(${acceptedRequest.vehicle_number})`}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Fare Breakdown */}
                {acceptedRequest?.faredetails && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fare Breakdown</h2>
                        
                        <div className="space-y-3">
                            {acceptedRequest.faredetails.base_fare && (
                                <div className="flex justify-between text-sm">
                                    <span>Base fare</span>
                                    <span>₹{acceptedRequest.faredetails.base_fare}</span>
                                </div>
                            )}
                            {acceptedRequest.faredetails.taxes && (
                                <div className="flex justify-between text-sm">
                                    <span>Taxes</span>
                                    <span>₹{acceptedRequest.faredetails.taxes}</span>
                                </div>
                            )}
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-bold">
                                    <span>Total fare</span>
                                    <span>₹{acceptedRequest.faredetails.total_fare || acceptedRequest.proposed_price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                {booking.booking_status === 'confirmed' && assignment && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                        
                        {assignment.driver_name && (
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Driver: {assignment.driver_name}</p>
                                    <p className="text-sm text-gray-500">Assigned driver</p>
                                </div>
                                <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg">
                                    <Phone className="w-4 h-4" />
                                    Call
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails; 