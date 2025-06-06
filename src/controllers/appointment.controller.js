require("dotenv").config()
const { isValidObjectId, default: mongoose } = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/appointment.model");
const ApiResponse = require("../utils/ApiResponse")
const nodemailer = require("nodemailer");

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
    const isAvailableAppointmentTime = await Appointment.findOne({appointmentDateTime:dateTime,doctor:doctorId})
    
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
    const doctorId = req?.doctor?._id
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
    
    if(!appointmentDate){
        throw new ApiError(404,"no appointment scheduled")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,appointmentDate,"appointment date fetch successfully!!")
    )

})


const confirmOrCancelAppointment = asyncHandler(async(req,res)=>{
    const{status} = req.body
    const{appointmentId} = req.params
    const checkStatus = ["confirmed","cancelled"]
    if(! checkStatus.includes(status)){
        throw new ApiError(400,"invalid staus")
    }
    const updateStatus = await Appointment.findOneAndUpdate(
        {_id:appointmentId,doctor:req.doctor._id},
        {$set:{status:status}},
        {new:true}
    )
    if(updateStatus.status === "confirmed"){
        const appointment = await Appointment.findById(new mongoose.Types.ObjectId(appointmentId)).populate('doctor').populate('user')
        
        const transporter = nodemailer.createTransport({
            service: "gmail", // or any other
            auth: {
              user: "mediserve.jru@gmail.com",
              pass: process.env.PASSWORD
            }
          });
          const mailOptions = {
            from: "mediserve.jru@gmail.com",
            to: `${appointment.user.email}`,
            subject: "Your Appointment is Confirmed ✅",
            html: `
              <h3>Hi ${appointment.user.username},</h3>
                <p><strong>Patient Name:</strong> ${appointment.patientName}</p>
                <p><strong>Patient Age:</strong> ${appointment.patientAge}</p>
              <p>Your appointment has been <strong>confirmed</strong> by <strong>${appointment.doctor.doctorName}</strong>.</p>
              <p><strong>Appointment Fee:</strong> ₹${appointment.doctor.appointmentFee}</p>
              <p><strong>Visit Date & Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
              <p>Please visit the clinic on time.</p>
              <br />
              <p>Thanks,</p>
              <p>MEDI SERVE Clinic Team</p>
            `
          }
        
         await transporter.sendMail(mailOptions);
         

    }else if(updateStatus.status === "cancelled"){
          const appointment = await Appointment.findById(new mongoose.Types.ObjectId(appointmentId)).populate('doctor').populate('user')
        const transporter = nodemailer.createTransport({
            service: "gmail", // or any other
            auth: {
              user: "mediserve.jru@gmail.com",
              pass: process.env.PASSWORD
            }
          });
          const mailOptions = {
                from: "mediserve.jru@gmail.com",
                to: `${appointment.user.email}`,
                subject: "Appointment Cancelled: Doctor Unavailable ❌",
                html: `
                    <h3>Hi ${appointment.user.username},</h3>
                    <p>We regret to inform you that your appointment has been <strong>cancelled</strong> due to the unavailability of <strong>Dr. ${appointment.doctor.doctorName}</strong>.</p>
                    <p><strong>Patient Name:</strong> ${appointment.patientName}</p>
                    <p><strong>Patient Age:</strong> ${appointment.patientAge}</p>
                    <p><strong>Originally Scheduled Date & Time:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                    <p>We apologize for the inconvenience caused. You may reschedule your appointment at your convenience through our platform.</p>
                    <br />
                    <p>Thanks,</p>
                    <p>MEDI SERVE Clinic Team</p>
                `
            };
            await transporter.sendMail(mailOptions)
    }
    if(!updateStatus){
        throw new ApiError(404,"no appointment found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,updateStatus,`${status}`)
    )
})

module.exports = {
    takeAppointment,
    getAppointmentDetails,
    confirmOrCancelAppointment,
}