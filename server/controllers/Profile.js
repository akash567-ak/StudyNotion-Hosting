const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary }= require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
//Create Section
exports.updateProfile = async (req, res) => {
    try {

        //get data
        const {dateOfBirth="", about="",contactNumber, gender } = req.body;
        //get userId
        const id = req.user.id;
        //validation
        // if(!contactNumber || !gender || !id) {
        //     return res.status(400).jsopn({
        //         success:false,
        //         message:"All fields are required",
        //     });
        // }
        //find profile
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);
        
        //update profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        // profile.gender = gender;
        
        //save the updated profile
        await profile.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profile,
        })

    } catch(error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
};

//delete Account
//TODO:->how can we schedule this deletion operation
exports.deleteAccount = async(req, res) => {
    try {
        console.log("Printing ID: ", req.user.id);
        //get Id
        const id = req.user.id;
        //validation
        const user = await User.findById({ _id: id });
        //profile delete
        if(!user) {
            return res.status(404).json({
                success:false,
                message:"User not found",
            })
        }
        //profile delete
        await Profile.findByIdAndDelete({_id: user.additionalDetails });
        //TODO: HW uneroll user from all enroll courses
        //user Delete
        await User.findByIdAndDelete({ _id: id });
        //return response
        return res.status(200).json({
            success:true,
            message:"User Deleted Successfully"
        })
         

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"User cannot be deleted successfully",
        });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();
        console.log(userDetails);
        //return response
        return res.status(200).json({
            success:true,
            messgae:"User data fetched successfully",
            data: userDetails,
        })

    } catch(error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
};

//create updated display picture
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);
        const updatedProfile = await User.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new:true }
        )
        res.send({
            success:true,
            message: `Image Updated Successfully`,
            data: updatedProfile,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//create get enrolled course
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id: userId,
        })
        .populate({
            path: "courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        })
        .exec();
        userDetails = userDetails.toObject()
        var SubSectionLength = 0;
        for (var i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            SubSectionLength = 0;
            for(var j = 0; j< userDetails.courses[i].courseContent.length; j++) {
                totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                )
                SubSectionLength += 
                    userDetails.courses[i].courseContent[j].subSection.length
            }
            let courseProgressCount = await CourseProgress.findOne({
                courseId: userDetails.courses[i]._id,
                userId: userId,
            })
            courseProgressCount = courseProgressCount?.completedVideos.length
            if (SubSectionLength === 0) {
                userDetails.courses[i].progressPercentage = 100
            } else {
                const multiplier = Math.pow(10, 2)
		            userDetails.courses[i].progressPercentage =
			            Math.round(
			                (courseProgressCount / SubSectionLength) * 100 * multiplier
                        ) / multiplier
            }
        }
            if (!userDetails) {
                return res.status(400).json({
                    success:false,
                    message: `Could not find the user with id: ${userDetails}`,
                })
            }
            return res.status(200).json({
                success: true,
                data: userDetails.courses,
            })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({instructor:req.user.id})
        
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            //create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            return courseDataWithStats
        })
        res.status(200).json({
            courses:courseData
        });
    
    } catch(error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Sever Error"
        })
    }
}