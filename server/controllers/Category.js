const { data } = require("react-router-dom");
const Category = require("../models/Category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

//create Tag ka handler function
exports.createCategory = async (req, res) => {
    try {
    //fetch Data
        const {name, description} = req.body;
    //validation
        if(!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }
    //create a entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
        });
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//showAllCategory handler function
exports.showAllCategory = async (req, res) => {
    try {
        const allCategory = await Category.find({}, {name:true, description:true});
        res.status(200).json({
            success:true,
            data:allCategory,
            message:"All categories return successfully"
        });
        console.log(allCategory);
    } catch(error) {
        console.log(error);
        return res.status(404).json({
            success:false,
            message:error.message,
        });
    }
}

//categoryPageDetails ka handler function
exports.categoryPageDetails = async (req, res) => {
    try {

        //get categoryId
        const {categoryId} = req.body;
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId)
                                        .populate({
                                            path: "courses",
                                            match: { status: "Published" },
                                            populate: "ratingAndReviews",
                                        })
        //validation
        if(!selectedCategory) {
            console.log("Catgory not found")
            return res.status(400).json({
                success:false,
                message:"Category not found",
            });
        }
        //Handle the case when the catory is not found
        const selectedCourses = selectedCategory.courses || [];
        //Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId},
        })
        
        let differentCategory = null;
        if(categoriesExceptSelected.length > 0) {
            const randomCategory =
                categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

        differentCategory = await Category.findById(randomCategory._id)
        .populate({
            path: "courses",
            match: { status: "Published" },
        })
    }
        //Get top-selling courses across al categories
        const allCategories = await Category.find()
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
        },
    });

        const allCourses = allCategories.flatMap(
            (category) => category.courses || []);
        const mostSellingCourses = allCourses
        .sort((a, b) => (b.sold || 0) - (a.sold || 0))
        .slice(0, 10);
        // console.log("mostSellingCourses COURSE", mostSellingCourses);
        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                selectedCourses,
                mostSellingCourses,
                differentCategory,
            }  
        });
    } catch(error) {
        console.error("CategoryPageDetails error", error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}