const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subSection

exports.createSubSection = async (req, res) => {
    try {
        
        //fetch data from req body
        const {sectionId, title, description} = req.body;
        //extract file/video
        const video = req.files.video;
        //validation
        if(!sectionId || !title || !description || !video) {
            return res.status(404).json({
                success:false,
                message:"All fields are required",
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        // console.log(uploadDetails)
        console.log("UPLOAD DETAILS:", uploadDetails);

        //create a sub-section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update section with this subSection objectId
        const updatedSection = await Section.findByIdAndUpdate(
            {_id:sectionId},
            {$push: { subSection: SubSectionDetails._id} },
            {new:true}
        ).populate("subSection")
        

        //return response
        return res.status(200).json({ success:true, data: updatedSection })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server error",
            error:error.message,
        })
    }
};

//HW: updateSubSection
exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId)

    if(!subSection) {
        return res.status(404).json({
            success:false,
            message:"SubSection not found",
        })
    }
    if(title !== undefined) {
        subSection.title = title
    }
    if(description !== undefined) {
        subSection.description = description
    }
    if(req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadImageToCloudinary(
            video, 
            process.env.FOLDER_NAME
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
    }
    
    await subSection.save()

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.json({
        success:true,
        data: updatedSection,
        message:"SubSection Created Successfully",
    })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"An error occured while updating the Section",
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
        if(!subSection) {
            return res.status(404).json({
                success:false,
                message:"SubSection not found"
            })
            }
            const updatedSection = await Section.findById(sectionId).populate("subSection")
            return res.json({
                success:true,
                data: updatedSection,
                message:"SubSection Deleted successfully",
                
            })   
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Ans error occured while deleting the subSection",
        })
    }
}