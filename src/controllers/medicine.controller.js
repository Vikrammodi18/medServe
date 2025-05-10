const Medicine = require("../models/medicine.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const uploadImage = require("../utils/cloudinary");


const uploadMedicine = asyncHandler(async(req,res)=>{
    const {name,stock,description,price} = req.body

    if([name,stock,description,price].some((field)=> !field || field.trim()==='')){
        throw new ApiError(400,"all fields are required")
    }
    
    const imagePath = req?.file?.path
    if(!imagePath){
        throw new ApiError(400,"image path is required")
    }
    
    const uploaded = await uploadImage(imagePath)
    if(!uploaded){
        throw new ApiError(500,"something went wrong while uploading image")
    }
    console.log(uploaded.url)
    const medicineUpload = await Medicine.create({
        name,
        stock,
        description,
        price,
        image:uploaded.url
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,medicineUpload,"medicine uploaded successfully")
    )


})
const getAllMedicine = asyncHandler(async(req,res)=>{
    
    const allMedicine = await Medicine.find({})
    console.log("allMedicine",allMedicine)
    return res
    .status(200)
    .json(
        new ApiResponse(200,allMedicine,"all medicine fetched Successfully")
    )

})
module.exports = {
    uploadMedicine,
    getAllMedicine
}