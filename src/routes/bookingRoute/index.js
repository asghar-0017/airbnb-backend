import  {bookingController} from '../../controller/bookingController/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const bookingRoute = (app) => {
    app.post('/listings/:listingId/book', authenticateHost, bookingController.bookListing);
};

export default bookingRoute;
