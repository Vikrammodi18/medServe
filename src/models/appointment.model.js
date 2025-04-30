const {mongoose,Schema} = require("mongoose")

const appointmentSchema = Schema({
    doctor:{
        type: Schema.Types.ObjectId,
        ref:"Doctor"
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    patientName:{
        type:String,
        required:true
    },
    patientAge:{
        type:Number,
        required:true
    },
    appointmentDateTime:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"
    }
},{timestamps:true})

const Appointment = mongoose.model("Appointment",appointmentSchema)

module.exports = Appointment