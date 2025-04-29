
const {mongoose,Schema} = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
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
    },
    appointmentFee:{
        type:Number,

    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

doctorSchema.pre("save", async function(next){
    if(! this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

doctorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

doctorSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        doctorName : this.doctorName,
        specialisation: this.specialisation,
        password: this.password
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
doctorSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        doctorName : this.doctorName,
        specialisation: this.specialisation
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
const Doctor = mongoose.model("Doctor",doctorSchema)
module.exports = Doctor