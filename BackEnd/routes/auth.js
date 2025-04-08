var express = require('express');
const passport = require('passport');
var router = express.Router();
var userController = require('../controllers/users')
var authGoogle = require('../utils/auth_gg')
let { sendSuccess, sendError } = require('../utils/responseHandler');
let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
const key = require('../config');
let { Authentication } = require('../utils/check_auth')
let { validate, validatorLogin,validatorSignup, validatorForgotPassword, validatorChangePassword } = require('../utils/validators')
let crypto = require('crypto')
let {sendmail} = require('../utils/sendmail')
router.use(passport.initialize());
/* GET home page. */
router.get('/google', authGoogle.authenticate);
router.get('/google/callback', ...authGoogle.handleCallback);


// Đăng nhập
router.post('/login', validate, async function (req, res, next) {
    try {
        let body = req.body;
        let username = body.username;
        let password = body.password;
        let userID = await userController.CheckLogin(username, password);
        sendSuccess(res, jwt.sign({
            id: userID,
            expire: (new Date(Date.now() + 60 * 60 * 1000)).getTime()
        }, key.SECRET_KEY),"Login successfully", 200)
    } catch (error) {
        sendError(res, error.message, "SERVER_ERROR", 500)
        next(error)
    }
});
// Đăng ký
router.post('/signup',validatorSignup, validate, async function (req, res, next) {
    try {
        let body = req.body;
        let newUser = await userController.CreateAnUser(
            body.username, body.password, body.email, 'User'
        )
        sendSuccess(res, null,"Signup successfully", 200);
    } catch (error) {
        next(error)
    }
})
// Đổi mật khẩu
router.post('/changepassword', Authentication, async function (req, res, next) {
    try {
        let body = req.body;
        let oldpassword = body.oldpassword;
        let newpassword = body.newpassword;
        let result = await userController.ChangePassword(req.user, oldpassword, newpassword);
        sendSuccess(res, result,"Change password successfully", 200);
    } catch (error) {
        next(error)
    }

})
// Lấy user bằng token
router.get('/me', Authentication, async function (req, res, next) {
    sendSuccess(res, req.user,"Get info user successfully", 200)
})
// Quên mất khẩu gửi email
router.post('/forgotpassword', validatorForgotPassword, validate, async function (req, res, next) {
    try {
        let email = req.body.email;
        let user = await userController.GetUserByEmail(email);
        if (user) {
            user.resetPasswordToken = crypto.randomBytes(24).toString('hex')
            console.log(user.resetPasswordToken);
            user.resetPasswordTokenExp = (new Date(Date.now() + 10 * 60 * 1000)).getTime();
            await user.save();
            let url = `http://localhost:3000/auth/reset_password/${user.resetPasswordToken}`
            await sendmail(user.email,"Reset password",url)
            sendSuccess(res, {
                url: url
            },"Gui mail thanh cong", 200)
            
        } else {
            return sendError(res, "Email khong ton tai", "SERVER_ERROR", 500)
        } 
    } catch (error) {
        next(error)
    }
})

//cai 2 thu vien: nodemailer, multer
// Đổi mật khẩu cũ thành mới
router.post('/reset_password/:token', validatorChangePassword, 
validate, async function (req, res, next) {
    try {
        let token = req.params.token;
        let user = await userController.GetUserByToken(token);
        if (user) {
            let newpassword = req.body.password;
            user.password = newpassword;
            user.resetPasswordToken= null;
            user.resetPasswordTokenExp = null;
            await user.save();
            sendSuccess(res, user,"Change password successfully", 200)
        } else {
            return sendError(res, "Email khong ton tai", "SERVER_ERROR", 500)
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;
