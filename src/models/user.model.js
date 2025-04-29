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

userSchema.pre("save", async function(next){
    
    if(! this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password,10)
    next()

})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
   return jwt.sign({
        username:this.username,
        email:this.email,
        contact:this.contact
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateAccessToken = function(){
   return jwt.sign({
        username:this.username,
        email:this.email,
        contact:this.contact
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        username:this.username,
        email:this.email,
        contact:this.contact
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

const User = mongoose.model("User",userSchema)
module.exports = User