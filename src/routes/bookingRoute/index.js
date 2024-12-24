import  {bookingController} from '../../controller/bookingController/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const bookingRoute = (app) => {
    app.post('/post-bookings/:listingId/',authenticateHost, bookingController.bookListing);
    app.get('/get-bookings/:listingId/',authenticateHost, bookingController.getBookings);};

export default bookingRoute;
