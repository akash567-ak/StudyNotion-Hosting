const express = require("express");
const router = express.Router();

//import controller
// capturePayments controller import
const {capturePayment, verifyPayment, sendPaymentSuccessEmail} = require("../controllers/Payments");
const { auth, isStudent, isAdmin, isInstructor} = require("../middleware/auth");
router.post("/capturePayment",auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);


module.exports = router