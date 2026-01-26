const express = require("express");
const router = express.Router();

//import auth controller
const {sendotp, login, signUp, changePassword} = require("../controllers/Auth");
const {resetPassword, resetPasswordToken} = require("../controllers/ResetPassword");
const { auth } = require("../middleware/auth");

//Route for sendOTP,login,signUp,changePassword
router.post("/sendOTP", sendotp)
router.post("/logIn", login)
router.post("/signUp",signUp)
router.post("/changePassword",auth, changePassword)


//Route for generating reset password
router.post("/reset-password", resetPassword);
router.post("/reset-password-token", resetPasswordToken);

module.exports = router