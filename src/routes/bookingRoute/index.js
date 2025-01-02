import  {bookingController} from '../../controller/bookingController/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const bookingRoute = (app) => {
    app.post('/create-bookings/:listingId/',authenticateHost, bookingController.createBooking);
    app.post('/confirm-booking/:bookingId', authenticateHost, bookingController.confirmBooking);
    app.delete('/reject-booking/:bookingId', authenticateHost, bookingController.deleteBooking);
    app.get('/temporary-booking', authenticateHost, bookingController.getTemporaryBookings);
    app.get('/get-confirmed-booking', authenticateHost, bookingController.getConfirmedBookings);

    app.get('/bookings-checking-out-today', authenticateHost, bookingController.getBookingsCheckingOutToday);
    app.get('/currently-hosting', authenticateHost, bookingController.getCurrentlyHostingBookings);
    app.get('/upcoming-bookings', authenticateHost, bookingController.getUpcomingBookings);

    app.get('/guest-bookings', authenticateHost, bookingController.getUserBoguestokings);

}
export default bookingRoute;
