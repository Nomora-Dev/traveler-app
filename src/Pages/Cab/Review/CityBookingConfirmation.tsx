import BookingConfirmationShared from '../../../Components/Cab/BookingConfirmationShared';
import { useLocation } from 'react-router-dom';

const CityBookingConfirmation = (state: any) => {
    const { bookingDetails, type, userInput } = state.state;
    console.log(bookingDetails, type, userInput);
    return <BookingConfirmationShared bookingDetails={bookingDetails} type={type} userInput={userInput} />;
};

export default CityBookingConfirmation; 