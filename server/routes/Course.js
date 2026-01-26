const express = require("express");
const router = express.Router();

//import controller
//category controllers import
const 
{   
    createCategory,
    showAllCategory,
    categoryPageDetails,
} = require("../controllers/Category");


//course controller import
const 
{   
    createCourse,
    editCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    getInstructorCourses,
    deleteCourse
} = require("../controllers/Course");

//section controller import
const 
{
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

//sub-Section controller import
const 
{
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/SubSection");

//ratingAndReview controller import
const
{
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview");


const {updateCourseProgress} = require("../controllers/courseProgress");
//import middleware 
const { auth, isStudent, isInstructor, isAdmin } = require("../middleware/auth");
//define API routes

//                                                    course route
//course only be created by the instructor
router.post("/createCourse", auth, isInstructor, createCourse);
//create a section in course
router.post("/addSection", auth, isInstructor, createSection);
//update the section
router.post("/updateSection", auth, isInstructor, updateSection);
//delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// create a subSection
router.post("/addSubSection", auth, isInstructor, createSubSection);
//update a subSection
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
//delete a subSection
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
//get all registered courses 
router.get("/getAllCourses", getAllCourses);
//Get Details for a specific course
router.post("/getCourseDetails", getCourseDetails);
//get all courses details
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
//Edit course routes
router.post("/editCourse", auth, isInstructor, editCourse);
//get all courses under a specific instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
//Delete a Course
router.delete("/deleteCourse", deleteCourse);

router.post("/updateCourseProgress",auth, isStudent, updateCourseProgress);


//                                                  category route

//create category
router.post("/createCategory", auth, isAdmin, createCategory);
//get all category
router.get("/showAllCategories", showAllCategory);
//category page details
router.post("/getCategoryPageDetails", categoryPageDetails);


//                                                  Rating And Review
//create rating
router.post("/createRating", auth, isStudent, createRating);
//get average rating
router.get("/getAverageRating", getAverageRating);
//getAllRatingsAndReview
router.get("/getReviews", getAllRating);

module.exports = router;