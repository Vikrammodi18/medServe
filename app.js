const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    credentials:true,
    origin:"http://localhost:3000"
}))

const userRouter = require("./src/routes/user.route")
const doctorRouter = require("./src/routes/doctor.route")
const appointmentRouter = require("./src/routes/appointment.route")
const medicineRouter = require('./src/routes/medicine.route')
const cartRouter = require("./src/routes/cart.route")
const orderRouter = require("./src/routes/order.route")
app.use("/api/v1/users",userRouter)
app.use("/api/v1/doctors",doctorRouter)
app.use("/api/v1/appointments",appointmentRouter)
app.use("/api/v1/medicines",medicineRouter)
app.use("/api/v1/carts",cartRouter)
app.use("/api/v1/orders",orderRouter)
module.exports = app