import { adminController } from '../../controller/adminController/index.js'; 
import combinedAuthenticate from '../../middleWare/combineAuthenticate/index.js';
import checkRole from '../../middleWare/checkRole/index.js';

const AdminRoute = (app) => {
    app.get('/all-temporary-listings', combinedAuthenticate, checkRole(['admin']), adminController.getAllListings);
    app.post('/confirm-listing/:listingId', combinedAuthenticate, checkRole(['admin']), adminController.confirmListing);
    
};

export default AdminRoute;
