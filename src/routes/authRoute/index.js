import signUpController from '../../controller/authController/index.js'

const authRoute=async(app)=>{
    app.post('/signUp',signUpController.signUp)
    app.post('/login',signUpController.login)
}

export default authRoute