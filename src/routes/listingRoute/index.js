import  {listingController} from '../../controller/listingController/index.js';
import upload from '../../config/cloudnry/index.js';
import  {authenticateHost } from '../../middleWare/index.js';

const listingRoute = (app) => {
    app.post('/listings',authenticateHost, upload.array('photos', 8), listingController.createListing);
    app.get('/listings/:hostId', authenticateHost,listingController.getListingsByHostId);
    app.get('/listing/:id',listingController.getListingById);
    app.get('/all-listring',listingController.getAllListings)
    app.put('/listing/:id', authenticateHost, upload.single('image'), listingController.updateListing);
    app.delete('/listing/:id', authenticateHost, listingController.deleteListing);
};

export default listingRoute;
