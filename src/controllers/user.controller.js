const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError")
const User = require("../models/user.model")
const ApiResponse = require("../utils/ApiResponse")

const registerUser = asyncHandler(async (req,res)=>{
    const {email,password,username,contact} =req.body;

    //validate all the required field
    if([email,password,username,contact].some((field)=> !field || field.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }

    //checking user already registered or not
    const isUserAlreadyRegistered = await User.findOne({email})
    if(isUserAlreadyRegistered){
        throw new ApiError(400,"user already registered")
    }
    // registered new User
    const registeredUser = await User({
        email:email.trim(),
        password:password.trim(),
        contact:contact.trim(),
        username:username.trim(),

    })
    const user = await registeredUser.save()
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "user registered successfully"
        )
    )
})
const login = asyncHandler(async(req,res)=>{
    let {email,password} = req.body
    if([email,password].some((field)=> !field || field.trim()==="")){
        throw new ApiError(400,"email or password required")
    }
    email = email.trim()
    password = password.trim()
    const isUserAlreadyRegistered = await User.findOne({email})
    if(!isUserAlreadyRegistered){
        throw new ApiError(402,"you are not registered")
    }
    const checkPassword = await isUserAlreadyRegistered.isPasswordCorrect(password)
    if(!checkPassword){
        throw new ApiError(403,"password is incorrect")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{isUserAlreadyRegistered},"successfully logged in")
    )
})
module.exports = {
    registerUser,
    login
}