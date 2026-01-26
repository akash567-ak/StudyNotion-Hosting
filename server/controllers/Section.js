const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {

        //data fetch
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Missing properties,"
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section objectId
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent:newSection._id,
                }
            },
            {new:true},
        )
            .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();
        

        //return response
        return res.status(200).json({
            success:true,
            message:"Sections created successfully",
            updatedCourse,
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create scetion, please try again",
            error:error.message,
        })
    }
}

exports.updateSection = async (req, res) => {
    try {

        //data input
        const {sectionName, sectionId, courseId} = req.body;
        //data validate
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success:false,
                message:"Missing properties",
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});
        
        
        const course = await Course.findById(courseId)
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();

        //return res
        return res.status(200).json({
            success:true,
            message: section,
            data:course,
        });
    }catch(error) {
        return res.status(404).json({
            success:false,
            message:"Unable to update section, please try again",
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {

        //get id - assuming that we are sending ID in params
        const { sectionId, courseId } = req.body;

    // remove section reference from course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      { new: true }
      
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Section Deleted successfully",
            data: updatedCourse
        })

    }catch(error) {
        return res.status(404).json({
            success:false,
            message:"Unable to update section, please try again",
            error: error.message
        });
    }
}