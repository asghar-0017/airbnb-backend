import authRoute from "../authRoute/index.js"
import bookingRoute from "../bookingRoute/index.js"
import listingRoute from "../listingRoute/index.js"


const allRoutes=async(app)=>{
    authRoute(app)
    listingRoute(app)
    bookingRoute(app)
}
export default allRoutes