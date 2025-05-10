const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const userRouter = require("./src/routes/user.route")
const doctorRouter = require("./src/routes/doctor.route")
const appointmentRouter = require("./src/routes/appointment.route")
const medicineRouter = require('./src/routes/medicine.route')

app.use("/api/v1/users",userRouter)
app.use("/api/v1/doctors",doctorRouter)
app.use("/api/v1/appointments",appointmentRouter)
app.use("/api/v1/medicines",medicineRouter)
module.exports = app