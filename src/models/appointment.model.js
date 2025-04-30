const {mongoose,Schema} = require("mongoose")

const appointmentSchema = Schema({
    doctor:{
        type: Schema.Types.ObjectId,
        ref:"Doctor"
    },
    // patient:{
    //     type: new Schema.Types.ObjectId,
    //     ref:"User"
    // },
    appointmentDateTime:{
        type:Date,
        required:true
    }
},{timestamps:true})

const Appointment = mongoose.model("Appointment",appointmentSchema)

module.exports = Appointment