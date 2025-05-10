
const ApiError = require('./ApiError');
const fs = require('fs')
require('dotenv').config()
const cloudinary = require("cloudinary").v2


cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadImage =async (path)=>{
    try {
        if(!path) return null
        const response = await cloudinary.uploader.upload(path,{
            resource_type: "image",
    
        })
        fs.unlinkSync(path)
        return response
    } catch (error) {
        throw new ApiError(500,error.message)
    }
}

module.exports = uploadImage