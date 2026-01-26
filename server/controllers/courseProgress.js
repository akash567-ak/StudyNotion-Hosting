const CourseProgress = require("../models/CourseProgress");
const SubSection = require("../models/SubSection");


exports.updateCourseProgress = async (req, res) => {
    const {courseId, subSectionId} = req.body;
    const userId = req.user.id;

    try {
        //check subsection valid or not
        const subSection = await SubSection.findById(subSectionId);

        if(!subSection) {
            return res.status(404).json({success:false,message:"Invalid SubSection"});
        }

        console.log("subsection validation done")

        // check for old entry
        let courseProgress = await CourseProgress.findOne({
            courseId:courseId,
            userId:userId,
        });
        if(!courseProgress) {
            return res.status(404).json({
                success:false,
                message:"Course progress does not exist"
            })
        }
        else {
            // console.log("course progress validation done")
            //check for recompleting video/subsection
            if(courseProgress.completedVideos.includes(subSectionId)) {
                return res.status(400).json({
                    success:false,
                    message:"Subsection already completed"
                });
            }
            //push into completed video
            courseProgress.completedVideos.push(subSectionId); 
            // console.log("course progress push done")
        }
        await courseProgress.save();
        // console.log("course progress ka save call done")
        res.status(200).json({
            succes:true,
            message:"course progress updated successfully"})
    
        } catch(error) {
        console.error(error);
        return res.status(400).json({
            success:false,
            message:"Internal server error",
        })
    }
}    