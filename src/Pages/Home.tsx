import { Plane, Car, Clock, Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserBookings } from '../services/cab';
import ActiveBookingCard from '../Components/Cab/ActiveBookingCard';

const services = [
  {
    icon: <Plane className="w-10 h-10 text-hero-peach bg-hero-peach/10 rounded-full p-2 mx-auto" />,
    title: 'Terminal Transfer',
    desc: 'Quick airport transfers between terminals. Fixed rates, no waiting.'
  },
  {
    icon: <Car className="w-10 h-10 text-hero-peach bg-hero-peach/10 rounded-full p-2 mx-auto" />,
    title: 'City Transfers',
    desc: 'Reliable city-to-city travel with experienced drivers.'
  },
  {
    icon: <Clock className="w-10 h-10 text-hero-peach bg-hero-peach/10 rounded-full p-2 mx-auto" />,
    title: 'Hourly Rental',
    desc: 'Flexible car rental by the hour with driver included.'
  },
  {
    icon: <Calendar className="w-10 h-10 text-hero-peach bg-hero-peach/10 rounded-full p-2 mx-auto" />,
    title: 'Multi-day Rental',
    desc: 'Extended car rentals for longer trips and tours.'
  },
  {
    icon: <MapPin className="w-10 h-10 text-hero-peach bg-hero-peach/10 rounded-full p-2 mx-auto" />,
    title: 'Tours & Activities',
    desc: 'Guided local tours and exciting activities nearby.'
  },
];

const Home = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const res = await getUserBookings({
        active_only: true
      });
      if (res && res.bookings) setBookings(res.bookings);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-6">
        <img src="logo.png" alt="logo" className="h-10" />
        <span className="text-heading-black text-lg font-semibold">Hello!</span>
      </div>
      {/* Title */}
      <h2 className="text-heading-black text-2xl font-semibold mb-6">Our Services</h2>
      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center transition hover:shadow-lg"
          >
            <div className="mb-4">{service.icon}</div>
            <div className="font-semibold text-heading-black text-md mb-1">{service.title}</div>
            <div className="text-text-gray text-sm">{service.desc}</div>
          </div>
        ))}
      </div>
      {/* Active Bookings Section */}
      <div className='mb-16'>
      <h2 className="text-heading-black text-2xl font-semibold mb-4">Active Bookings</h2>
      {loading ? (
        <div className="text-center text-gray-400">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-400">No active bookings found.</div>
      ) : (
        bookings.map((booking, idx) => (
          <ActiveBookingCard key={booking.id || idx} bookingObject={booking} />
        ))
      )}
      </div>
    </div>
  );
};

export default Home; 