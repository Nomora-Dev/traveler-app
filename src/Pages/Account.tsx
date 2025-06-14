import { useEffect, useState } from 'react';
import { getUserBookings } from '../services/cab';
import { Calendar, MapPin, Car, XCircle, CheckCircle, User, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// BookingCard component for each booking
const BookingCard = ({ bookingObj, onViewDetails }: { bookingObj: any, onViewDetails: () => void }) => {
    const { booking, booking_requests } = bookingObj;
    const firstRequest = booking_requests && booking_requests[0];
    const fare = firstRequest?.faredetails?.total_fare || firstRequest?.faredetails?.calculated_final_price || 'N/A';
    const pickup = booking.userinput?.pickup_location?.formatted_address || booking.pickup_location;
    const drop = booking.userinput?.drop_location?.formatted_address || booking.drop_location;
    const date = booking.userinput?.date || booking.userinput?.pickup_date || booking.created_at?.slice(0, 10);
    const time = booking.userinput?.time || booking.userinput?.pickup_time || '';
    const status = booking.booking_status[0].toUpperCase() + booking.booking_status.slice(1);
    const statusColor = booking.booking_status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
    const serviceType = booking.service_type === 'city' ? 'City Transfer' : booking.service_type === 'terminal' ? 'Terminal Transfer' : booking.service_type === 'hourly' ? 'Hourly Rental' : 'Multi-day Rental';

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 max-w-md mx-auto mb-6">
            {/* Header: Service Type & Status */}
            <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-heading-black text-lg">{serviceType}</div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>{status}</span>
            </div>
            {/* Date & Time */}
            <div className="flex items-center text-gray-600 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{date}{time && ` • ${time}`}</span>
            </div>
            {/* Pickup */}
            <div className="mb-1">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Pickup</span>
                </div>
                <div className="ml-6 text-heading-black text-sm">{pickup}</div>
            </div>
            {/* Drop */}
            <div className="mb-2">
                <div className="flex items-center gap-2 text-red-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Drop</span>
                </div>
                <div className="ml-6 text-heading-black text-sm">{drop}</div>
            </div>
            {/* Fare & View Details */}
            <div className="flex items-center justify-between mt-4">
                <div>
                    <div className="text-xs text-gray-400">Total Fare</div>
                    <div className="text-lg font-bold text-heading-black">₹{fare}</div>
                </div>
                <button
                    className="text-hero-peach font-semibold text-base hover:underline focus:outline-none"
                    onClick={onViewDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

// BookingSummaryCard component (reusable for modal and details page)
export const BookingSummaryCard = ({ bookingObj, onClose }: { bookingObj: any, onClose?: () => void }) => {
    if (!bookingObj) return null;
    const { booking, booking_requests } = bookingObj;
    const firstRequest = booking_requests && booking_requests[0];
    const fare = firstRequest?.faredetails?.total_fare || firstRequest?.faredetails?.calculated_final_price || 'N/A';
    const pickup = booking.userinput?.pickup_location?.formatted_address || booking.pickup_location;
    const drop = booking.userinput?.drop_location?.formatted_address || booking.drop_location;
    const date = booking.userinput?.date || booking.userinput?.pickup_date || booking.created_at?.slice(0, 10);
    const time = booking.userinput?.time || booking.userinput?.pickup_time || '';
    const carCategory = booking.car_category_name || 'Car';
    const isAC = booking.is_ac ? 'AC' : 'Non-AC';
    const status = booking.booking_status;
    const serviceType = booking.service_type === 'city' ? 'City Transfer' : booking.service_type === 'terminal' ? 'Terminal Transfer' : booking.service_type === 'hourly' ? 'Hourly Rental' : 'Multi-day Rental';
    const bookingId = booking.id;
    let StatusIcon = null;
    if (status === 'completed') {
        StatusIcon = <CheckCircle className="w-20 h-20 text-green-400 bg-green-100 rounded-full p-4 mx-auto" />;
    } else if (status === 'cancelled' || status === 'expired') {
        StatusIcon = <XCircle className="w-20 h-20 text-red-400 bg-red-100 rounded-full p-4 mx-auto" />;
    }
    return (
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 sm:p-8 relative flex flex-col gap-6 overflow-y-auto">
            {onClose && (
                <button className="absolute top-8 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>
                    <XCircle className="w-6 h-6" />
                </button>
            )}
            <div className="flex flex-col items-center mb-2 mt-2 gap-2">
                {StatusIcon}
                <div className="text-xl font-semibold text-heading-black mt-2 mb-1 text-center">
                    {status === 'completed' ? 'Your trip is completed' : status === 'cancelled' ? 'Your trip was cancelled' : status === 'expired' ? 'Your trip expired' : 'Booking Details'}
                </div>
                <div className="text-gray-500 text-base text-center">{serviceType}</div>
            </div>
            <div className="bg-white border rounded-2xl p-5 mb-2 flex flex-col gap-3">
                <div className="mb-1">
                    <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                        <MapPin className="w-4 h-4" /> Pickup
                    </div>
                    <div className="ml-6 text-heading-black text-sm mt-1">{pickup}</div>
                </div>
                <div className="mb-1">
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <MapPin className="w-4 h-4" /> Drop
                    </div>
                    <div className="ml-6 text-heading-black text-sm mt-1">{drop}</div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Pickup Time</span>
                    <span className="ml-2 font-medium text-heading-black">{date}{time && ` • ${time}`}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1 mt-1">
                    <Car className="w-4 h-4" />
                    <span>Car Category</span>
                    <span className="ml-2 font-medium text-heading-black">{carCategory} • {isAC}</span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center justify-between mt-1">
                    <div>
                        <div className="text-xs text-gray-400">Total Fare</div>
                        <div className="text-lg font-bold text-heading-black">₹{fare}</div>
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                        Booking ID<br />
                        <span className="text-heading-black font-medium">{bookingId}</span>
                    </div>
                </div>
            </div>
            <div className="mb-2 flex flex-col gap-4">
                <div className="text-heading-black font-semibold mb-1">Rate your experience</div>
                <div className="bg-white border rounded-2xl p-4 mb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1 text-purple-600"><Car className="w-4 h-4" /> Rate the car</div>
                    <div className="text-xs text-gray-400 mb-1">Comfort & cleanliness</div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-2xl text-gray-300">★</span>)}
                    </div>
                </div>
                <div className="bg-white border rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1 text-purple-600"><User className="w-4 h-4" /> Rate the driver</div>
                    <div className="text-xs text-gray-400 mb-1">Behavior & punctuality</div>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-2xl text-gray-300">★</span>)}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-2">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-base">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 17.34l-2.06-2.06a1.25 1.25 0 0 0-1.77 0l-1.06 1.06a1.25 1.25 0 0 1-1.77 0l-5.66-5.66a1.25 1.25 0 0 1 0-1.77l1.06-1.06a1.25 1.25 0 0 0 0-1.77L6.66 3.48a1.25 1.25 0 0 0-1.77 0l-1.06 1.06a5.25 5.25 0 0 0 0 7.43l7.07 7.07a5.25 5.25 0 0 0 7.43 0l1.06-1.06a1.25 1.25 0 0 0 0-1.77z"></path></svg>
                    Need Help? Chat with us
                </button>
                <button className="w-full border border-gray-300 text-heading-black font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z" /></svg>
                    Download Invoice
                </button>
                <button className="w-full bg-hero-peach hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v.01" /><path d="M8 12v.01" /><path d="M12 12v.01" /><path d="M16 12v.01" /><path d="M20 12v.01" /></svg>
                    Share Nomora with Friends & Family
                </button>
            </div>
        </div>
    );
};

const Account = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const res = await getUserBookings({ active_only: false });
            if (res && res.bookings) setBookings(res.bookings);
            setLoading(false);
        };
        fetchBookings();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white px-4 py-2 pb-20">
            {/* Hamburger Menu */}
            <div className="relative">
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
                
                {isMenuOpen && (
                    <div className="absolute right-4 top-14 bg-white rounded-lg shadow-lg py-2 w-48 z-50">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center py-8">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <span className="text-4xl text-purple-600">👤</span>
                </div>
                <div className="text-gray-500 mb-1 text-lg">{user?.mobile_number?.slice(0, 3)} {user?.mobile_number?.slice(3, 8)} {user?.mobile_number?.slice(8)}</div>
                <div className="text-gray-400 text-base">Member since {user?.created_at?.slice(0, 10)}</div>
            </div>

            {/* Bookings */}
            <h2 className="text-heading-black text-xl font-semibold mb-4">Past Bookings</h2>
            {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center text-gray-400">No bookings found.</div>
            ) : (
                bookings.map((bookingObj, idx) => (
                    <BookingCard
                        key={bookingObj.booking.id || idx}
                        bookingObj={bookingObj}
                        onViewDetails={() => navigate(`/cab/booking/${bookingObj.booking.id}`)}
                    />
                ))
            )}
            {selectedBooking && (
                <BookingSummaryCard bookingObj={selectedBooking} onClose={() => setSelectedBooking(null)} />
            )}
        </div>
    );
};

export default Account; 