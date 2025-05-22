const Admin = require("../models/admin.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const registerAdmin = asyncHandler(async(req,res)=>{
    const {email,password,username} = req.body
    if([email,password,username].some((field)=> !field|| field.trim()==="")){
        throw new ApiError(400,"email and password is required")
    }
    const alreadyRegistered = await Admin.findOne({email})
    console.log("alreadyRegistered",alreadyRegistered)
    if(alreadyRegistered){
        throw new ApiError(400,"admin already registered")
    }
    const admin = await Admin.create({
        email,
        password,
        username,
    })
    if(!admin){
        throw new ApiError(500,"something went wrong while register admin")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,admin,"admin registered successfully")
    )
})
const loginAdmin = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if([email,password].some((field)=> !field || field.trim()==="")){
        throw new ApiError(400,"email and password are required")
    }
    const admin = await Admin.findOne({email})
    if(!admin){
        throw new ApiError(400,"admin did not registered")
    }
    const checkPassword = await admin.isPasswordCorrect(password)
    if(!checkPassword){
        throw new ApiError(400,"password is incorrect")
    }
    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();
    admin.refreshToken = refreshToken
    const options= {
        httpOnly:true,
        secure:false,
    }
    await admin.save()
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{admin,accessToken,refreshToken},"admin logged in")
    )
})

module.exports = {
    registerAdmin,
    loginAdmin
}