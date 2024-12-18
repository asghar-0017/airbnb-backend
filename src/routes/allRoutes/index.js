import authRoute from "../authRoute/index.js"

const allRoutes=async(app)=>{
    authRoute(app)
}
export default allRoutes