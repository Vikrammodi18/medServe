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
    const refreshToken = await isUserAlreadyRegistered.generateRefreshToken();
    const accessToken = await isUserAlreadyRegistered.generateAccessToken();
    isUserAlreadyRegistered.refreshToken = refreshToken
    isUserAlreadyRegistered.save({validateBeforeSave:false})
    const loggedInUser = await User.findById(isUserAlreadyRegistered._id).select("-refreshToken -password")
    const options={
        httpOnly:true,
        secure:false,
        maxAge:7*24*60*60*1000 //max age of cookies is 7 day
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {data:loggedInUser,
                accessToken,
                refreshToken
            },
            "successfully logged in"
        )
    )
})
module.exports = {
    registerUser,
    login
}