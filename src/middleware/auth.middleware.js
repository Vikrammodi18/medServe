require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")
const ApiError = require("../utils/ApiError")

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

module.exports = verifyJWT