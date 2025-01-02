import  {bookingController} from '../../controller/bookingController/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const bookingRoute = (app) => {
    app.post('/create-bookings/:listingId/',authenticateHost, bookingController.createBooking);
    app.post('/confirm-booking/:bookingId', authenticateHost, bookingController.confirmBooking);
    app.get('/temporary-booking', authenticateHost, bookingController.getTemporaryBookings);
    app.get('/get-confirmed-booking', authenticateHost, bookingController.getConfirmedBookings);

    
}
export default bookingRoute;
