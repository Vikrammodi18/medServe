const { isValidObjectId } = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/appointment.model");
const ApiResponse = require("../utils/ApiResponse")
const takeAppointment = asyncHandler(async(req,res)=>{
    const{doctorId} = req.params
    const{time,date} = req.body;
    if(! isValidObjectId(doctorId)){
        throw new ApiError(402,"invalid doctorId")
    }
    // const patientId = req.user?._id
    
    if([time,date].some((field)=> !field || field.trim()==="")){
        throw new ApiError(401,"appointment time and date required")
    }
    const dateTime =  new Date(`${date}T${time}`)
    
    const existedAppointment = await Appointment.findOne({appointmentDateTime:dateTime})
    if(existedAppointment){
        throw new ApiError(402,"already taken appointment by other ")
    }
    const appointment = await Appointment.create({
        doctor:doctorId,
        // patient:patientId,
        appointmentDateTime: dateTime
    })
    if(!appointment){
        throw new ApiError(501,"something went wrong while appointment")
    }
    const saveDate = new Date(appointment.appointmentDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    
    console.log(saveDate)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            appointment,
            "appointment successfull"
        )
    )
})

module.exports = {
    takeAppointment
}