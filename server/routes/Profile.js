const express = require("express");
const router = express.Router();

//profile controller import
const { updateProfile, deleteAccount, getUserDetails, updateDisplayPicture, getEnrolledCourses, instructorDashboard } = require("../controllers/Profile");
const { auth, isInstructor } = require("../middleware/auth");

router.put("/updateProfile", auth, updateProfile);
router.delete("/deleteProfile", auth, deleteAccount);
router.get("/getUserDetails", auth, getUserDetails);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router