const {mongoose,Schema} = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,

    },
    username:{
        type:String,
        required:true,
        lowercase:true,

    },
    contact:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})
userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
const User = mongoose.model("User",userSchema)
module.exports = User