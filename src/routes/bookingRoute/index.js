import  {bookingController} from '../../controller/bookingController/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const bookingRoute = (app) => {
    app.post('/create-bookings/:listingId/',authenticateHost, bookingController.createBooking);
    app.post('/confirm-booking/:bookingId', authenticateHost, bookingController.confirmBooking);

    app.get('/temporary-booking', authenticateHost, bookingController.getTemporaryBookings);
    app.get('/get-confirmed-booking', authenticateHost, bookingController.getConfirmedBookings);
    app.get('/bookings-summary', authenticateHost, bookingController.getBookingSummary);
    app.put('/update-booking-status/:bookingId', authenticateHost, bookingController.updateBookingStatus);


    app.get('/bookings-today/:hostId', authenticateHost, bookingController.getBookingsToday);

}
export default bookingRoute;
