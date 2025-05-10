const {mongoose,Schema} = require('mongoose')

const medicineSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        // required:true
    },
    stock:{
        type:Number,
        default:0,
    },
    description:{
        type:String,

    },
    price:{
        type:Number,
    }
},{timestamps:true})

const Medicine = mongoose.model("Medicine",medicineSchema)
module.exports = Medicine
