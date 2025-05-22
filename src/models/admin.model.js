
const {mongoose,Schema} = require("mongoose")
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")
const adminSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }

},{timestamps:true})
adminSchema.pre("save", async function(next){
    if(! this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

adminSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

adminSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id:this._id,
        doctorName : this.doctorName,
        specialisation: this.specialisation,
        password: this.password
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
adminSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        doctorName : this.doctorName,
        specialisation: this.specialisation
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
const Admin = mongoose.model("Admin",adminSchema)
module.exports = Admin