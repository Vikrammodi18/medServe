
const {mongoose,Schema} = require("mongoose")
const doctorSchema = Schema({
    doctorName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
    },
    specialisation:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})

const Doctor = mongoose.model("Doctor",doctorSchema)
module.exports = Doctor