import  {listingController} from '../../controller/listingController/index.js';
import upload from '../../config/multer/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const listingRoute = (app) => {
    app.post('/listings',authenticateHost, upload.array('photos', 8), listingController.createListing);
    app.get('/listings/:hostId', authenticateHost,listingController.getListingsByHostId);
    app.get('/listing/:id', authenticateHost,listingController.getListingById);

};

export default listingRoute;
