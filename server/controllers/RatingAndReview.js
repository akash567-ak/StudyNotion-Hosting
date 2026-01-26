const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//creating rating
exports.createRating = async (req, res) => {
    try {

        //get userid
        const userId = req.user.id;
        //data fetch
        const {rating, review, courseId} = req.body;
        //check if user enrolled or not for review/rating
        const courseDetails = await Course.findOne(
            {_id:courseId},
            {studentsEnrolled: {$elemMatch: {$eq: userId} },
        });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled to this course",
            });
        }
        //check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });
        if(alreadyReviewed) {
            return res.status(400).json({
                success:false,
                message:"Course is already reviewed by the User",
            })
        }
        //create rating review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId
        });

        //update course with this rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id: courseId},
                            {
                                $push: {
                                    RatingAndReview: ratingReview._id,
                                }
                            },
                            {new:true} );
        console.log(updatedCourseDetails);
        //response return
        return res.status(200).json({
            success:true,
            message:"Rating and Review Created Successfully",
            ratingReview
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//average rating
exports.getAverageRating = async (req, res) => {
    try {

        //get courseId
        const courseId = req.body.courseId;
        // calculate avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{ course: new mongoose.Types.ObjectId(courseId) },
            },

            {
                $group:{ 
                    _id: null, 
                    averageRating: { $avg: "$rating" } 
                },
            }
        ])

        //return Rating
        if(result.length > 0) {

            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            });
        }

        //if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, No ratings given till now",
            averageRating:0,
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:true,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try {

        const allReviews = await RatingAndReview.find({})
                                .sort({ rating: "desc" })
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName",
                                })
                                .exec();
        return res.status(200).json({
            success:true,
            messgae:"All Reviews fetched successfully",
            data: allReviews,
        });
    } catch(error) {
       console.log(error);
        return res.status(500).json({
            success:true,
            message:error.message,
        });
    }
}