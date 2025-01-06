import { adminController } from '../../controller/adminController/index.js'; // Import controller
import  {authenticateHost } from '../../middleWare/authenticate/index.js';
import checkRole from '../../middleWare/checkRole/index.js';
import combinedAuthenticate from '../../middleWare/combineAuthenticate/index.js'
const AdminRoute = (app) => {
     app.get('/all-temporary-listings', combinedAuthenticate,checkRole(['admin']), adminController.getAllListings);

};

export default AdminRoute;
