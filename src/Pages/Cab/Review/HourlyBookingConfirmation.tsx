import BookingConfirmationShared from '../../../Components/Cab/BookingConfirmationShared';
import { useLocation } from 'react-router-dom';

const HourlyBookingConfirmation = () => {
  const location = useLocation();
  const { bookingDetails, type, userInput } = location.state;
  return <BookingConfirmationShared bookingDetails={bookingDetails} type={type} userInput={userInput} />;
};

export default HourlyBookingConfirmation; 