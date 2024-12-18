import {signUp,login} from '../../controller/authController/index.js'

const authRoute=async(app)=>{
    app.post('/signUp',signUp)
    app.post('/login',login)
}

export default authRoute