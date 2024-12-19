const listingController = require('../../controller/listingController/index.js');
const upload = require('../../config/multer/index.js');

const listingRoute = (app) => {
    app.post('/listings', upload.array('photos', 8), listingController.createListing);
    app.get('/listings/:hostId', listingController.getListingsByHost);

};

export default listingRoute;
