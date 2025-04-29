const Doctor = require("../models/doctor.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");


const registerDoctor = asyncHandler(async(req,res)=>{
    const {doctorName,email,password,specialisation,appointmentFee} = req.body
    if([doctorName,email,password,specialisation,appointmentFee].some((field)=> !field || field.trim("")==="")){
        throw new ApiError(400,"all fields are required!")

    }
    const existedDoctor = await Doctor.findOne({email})
    if(existedDoctor){
        throw new ApiError(401,"you are already registered")
    }
    try {
        const registerDoctor = await Doctor.create({
            email,
            doctorName,
            password,
            appointmentFee,
            specialisation
        })
        const registeredDoctor = await registerDoctor.save();
        return res
        .status(200)
        .json(
            new ApiResponse(200,registeredDoctor,"doctor registered successfully")
        )
    } catch (error) {
        console.error(error)
        throw new ApiError(500,"something went wrong while register doctor")
    }
    
})
const loginDoctor = asyncHandler(async (req,res)=>{
    let {email,password} = req.body
    if([email,password].some((field)=> !field || field.trim()==="")){
        throw new ApiError(400,"email or password required")
    }
    email = email.trim()
    password = password.trim()
    const isDoctorAlreadyRegistered = await Doctor.findOne({email})
    if(!isDoctorAlreadyRegistered){
        throw new ApiError(402,"you are not registered")
    }
    const checkPassword = await isDoctorAlreadyRegistered.isPasswordCorrect(password)
    if(!checkPassword){
        throw new ApiError(403,"password is incorrect")
    }
    const refreshToken = await isDoctorAlreadyRegistered.generateRefreshToken();
    const accessToken =  await isDoctorAlreadyRegistered.generateAccessToken();

    const doctor = await Doctor.findById(isDoctorAlreadyRegistered._id)
    
    doctor.refreshToken = refreshToken
    const loggedInDoctor = await doctor.save({validateBeforeSave:false})

    const options={
        httpOnly:true,
        secure:false,
        maxAge:7*24*60*60*1000 // max age of cookies is 7 day
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {data:loggedInDoctor,
                accessToken,
                refreshToken
            },
            "successfully logged in"
        )
    )
})

module.exports = {
    registerDoctor,
    loginDoctor
}