import BookingConfirmationShared from '../../../Components/Cab/BookingConfirmationShared';

const CityBookingConfirmation = (state: any) => {
    const { bookingDetails, type, userInput } = state.state;
    console.log(bookingDetails, type, userInput);
    return <BookingConfirmationShared bookingDetails={bookingDetails} type={type} userInput={userInput} />;
};

export default CityBookingConfirmation; 