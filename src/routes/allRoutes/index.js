import authRoute from "../authRoute/index.js"
import listingRoute from "../listingRoute/index.js"


const allRoutes=async(app)=>{
    authRoute(app)
    listingRoute(app)
}
export default allRoutes