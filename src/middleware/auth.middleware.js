require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const ApiError = require("../utils/ApiError")
const asyncHandler = require("../utils/asyncHandler")
const Doctor = require("../models/doctor.model")
const Admin = require("../models/admin.model")
const verifyJWT = async(req,res,next)=>{
   const token = req?.cookies?.accessToken 
   
  if(!token){
    throw new ApiError(403,"unauthorise access")
  }
   const verifyToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  const user = await User.findById(verifyToken._id)
  if(!user){
    
    throw new ApiError(404,"you are not registered")
  }
  req.user = user
   next()
}

const verifyJWTdoctor = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.accessToken
    if(!token){
        throw new ApiError(403,"unauthorise access for doctor")
    }
    const verifyToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const doctor = await Doctor.findById(verifyToken._id)
    if(!doctor){
        throw new ApiError(404,"un registered doctor")
    }
    req.doctor = doctor
    next()
})
const verifyJWTAdmin = asyncHandler(async(req,res,next)=>{
  const token = req.cookies?.accessToken
  if(!token){
    throw new ApiError(404,"unauthorised access")
  }
  
  const decode = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  const admin = await Admin.findById(decode?._id)
  if(!admin){
    throw new ApiError(403,"in valid credentials")
  }
  req.admin = admin
  next()
})
module.exports = {verifyJWT,verifyJWTdoctor,verifyJWTAdmin}