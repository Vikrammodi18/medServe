const { isValidObjectId } = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/appointment.model");
const ApiResponse = require("../utils/ApiResponse")
const takeAppointment = asyncHandler(async(req,res)=>{
    const{doctorId} = req.params
    const{time,date,patientName,patientAge} = req.body;
    if(! isValidObjectId(doctorId)){
        throw new ApiError(402,"invalid doctorId")
    }
    const userId = req.user?._id
    
    if([time,date,patientAge,patientName].some((field)=> !field || field.trim()==="")){
        throw new ApiError(401,"appointment time and date required")
    }
    console.log(date,time)
    const dateTime =  new Date(`${date}T${time}`)
    console.log(dateTime)
    const isAvailableAppointmentTime = await Appointment.findOne({appointmentDateTime:dateTime})
    
    if(isAvailableAppointmentTime){
        throw new ApiError(402,"already taken appointment by other ")
    }
    const appointment = await Appointment.create({
        doctor:doctorId,
        user:userId,
        patientName,
        patientAge,
        appointmentDateTime: dateTime
    })
    if(!appointment){
        throw new ApiError(501,"something went wrong while appointment")
    }
    const saveDate = new Date(appointment.appointmentDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    
    
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

const getAppointmentDetails = asyncHandler(async(req,res)=>{
    const{date} = req.body
    const {doctorId} = req.params
    if(! isValidObjectId(doctorId)){
        throw new ApiError(404,"invalid doctorId")
    }
    const startDateTime = new Date(`${date}T00:00:00`)
    const endDateTime = new Date(`${date}T23:59:59`)
    const appointmentDate = await Appointment.find(
        {
            doctor:doctorId,
            appointmentDateTime: {
                $gte: startDateTime,
                $lte: endDateTime
            }

    })
    console.log(appointmentDate)
    if(!appointmentDate){
        throw new ApiError(404,"no appointment scheduled")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,appointmentDate,"appointment date fetch successfully!!")
    )

})

module.exports = {
    takeAppointment,
    getAppointmentDetails,
}