const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

//Initiate the paymen
exports.capturePayment = async(req, res) => {
    
    const {courses} = req.body;
    const userId = req.user.id;
        if(courses.length === 0) {
            return res.json({ success:false, message:"Please provide course Id" });
        }

        let totalAmount = 0;

        for(const course_id of courses) {
            let course;
            try {
                console.log("TYPE OF COURSEID",typeof(course_id))
                console.log("PRINTING", course_id);
                course = await Course.findById(course_id);
                if(!course) {
                    return res.status(200).json({
                        success:false, 
                        message:"Could not find the course" 
                    })
                }

                const uid = new mongoose.Types.ObjectId(userId);

                if(course.studentsEnrolled.includes(uid)) {
                    return res.status(200).json({
                        success:false, 
                        message:"Student is already Enrolled"
                    })
                }

                totalAmount += course.price;

            } catch(error) {
                console.log(error);
                return res.status(500).json({ 
                    success:false, 
                    message:error.message 
                })
            }
        }

        const options = {
            amount: totalAmount * 10,
            currency:"INR",
            receipt: Math.random(Date.now()).toString(),
        }
        try {
            const paymentResponse = await instance.orders.create(options);
            res.json({ 
                success:true, 
                message: paymentResponse 
            })
        } catch(error) {
            console.log(error);
            return res.status(500).json({ success: false, message:"Could not Initiate Order" })
        }
}

//verification payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !userId ||
        !courses) {
            return res.status(400).json({
                success:false,
                message:"Payment Failed"
            })
        }

        let body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll that student
            await enrolledStudent(courses, userId, res);

            //return res
            return res.status(200).json({
                success:true,
                message:"Payment verified"
            })
        }
        return res.status(200).json({success:false, message:"Payment Failed"});
    
    
}

const enrolledStudent = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({
            success:false,
            message:"Please provide data for Course",
        })
    }

    for(const courseId of courses) {
        try {
            //find the course and enrolled student in it
        const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            
        )
        if(!enrolledCourse) {
            return res.status(500).json({
                success:false,
                message:"Course not found"
            })
        }

        const courseProgress = await CourseProgress.create({
            courseId:courseId,
            userId:userId,
            completedVideos: [],
        })

        //find the student and the add the courses to their list of enrolledCourses
        const enrolledStudent = await User.findByIdAndUpdate( userId,
            {$push:{
                courses: courseId,
                courseProgress: courseProgress._id,
            }},{new:true})

            //send the mail to the students
            const emailResponse = await mailSender (
                enrolledStudent.email,
                `Successfully enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
        )
        console.log("Email Send Successfully", emailResponse);
        
    } catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success:false,
            message:"Please provide all the fields"
        })
    }
    try {
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
            amount/100,orderId, paymentId
            )
        );
        return res.status(200).json({
            success:true,
            message:"Payment success email send",
        });
    } catch(error) {
        console.log("Error in sending mail", error);
        return res.status(500).json({
            success:false,
            message:"Could not send email"
        })
    }
}

//capture the payments and initiate razorpay order
// exports.capturePayment = async (req, res) => {
    
//     //get courseId and UserId
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseId
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:"Please provide valid courseId"
//         })
//     };
//     //valid courseDetails
//     let course;
//     try {
//         course = await Course.findByIdAndUpdate(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 messsage:"Could not find the course",
//             })
//         };
        
//         //user already pay for the same course or not
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(500).json({
//                 success:false,
//                 message:"Student is already Enrolled",
//             })
//         };
//     } catch(error) {
//         console.error(error);
//         return res.status(404).json({
//             success:false,
//             message:error.message,
//         })
//     };
    
//     //order create
//     const amount = course.price;
//     const currency  = "INR";

//     const options = {
//         amount: amount*100,
//         currency,
//         receipt:Math.random(Date.now()).toString(),
//         notes: {
//             courseId: course_id,
//             userId,
//         }
//     };

//     try {
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName: course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount,
//         });
//     }catch(error) {
//         console.log(error);
//         return res.json({
//             success:false,
//             message:"Could not initiate order",
//         })
//     }
    
// };


// //verify signature of Razorpay and Server
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers("x-razorpay-signature");

//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try {
            
//             //fulfill the action
//             //find the course and enroll student in it
//             const enrolledCourse = await Course.findOneAndUpdate(
//                                 {_id: courseId},
//                                 {$push: {studentsEnrolled: userId}},
//                                 {new:true},
//             );
//             if(!enrolledCourse) {
//                 return res.status(500).json({
//                     success:false,
//                     messgae:"Course not found",
//                 });
//             }
//             console.log(enrolledCourse);

//             //find the student and update the course to their list of erolled courses
//             const enrolledStudent = await User.findOneAndUpdate(
//                 {_id: userId},
//                 {$push: {courses:courseId}},
//                 {new:true},
//             )
//             console.log(enrolledStudent);

//             //mail send for confirmation
//             const emailResponse = await mailSender(
//                     enrolledStudent.email,
//                     "Congratulations from CodeHelp",
//                     "Congratulations, you are on boarded into CodeHelp",
//             );
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature Verified and Course Added",
//             })


//         } catch(error) {
//             console.error(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request",
//         });
//     }
// };