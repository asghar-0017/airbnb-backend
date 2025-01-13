import authRoute from "../authRoute/index.js"
import bookingRoute from "../bookingRoute/index.js"
import listingRoute from "../listingRoute/index.js"
import reviewListingRoute from "../reviewListingRoute/index.js"
import AdminAuthRoute from '../adminAuthRoute/index.js'
import AdminRoute from "../adminRoute/index.js"
import chatController from "../chatRoute/index.js"

const allRoutes=async(app)=>{
    authRoute(app)
    listingRoute(app)
    bookingRoute(app)
    reviewListingRoute(app)
    AdminAuthRoute(app)
    AdminRoute(app)
    chatController(app)
}
export default allRoutes