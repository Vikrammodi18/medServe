const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()
app.use(cookieParser)
app.use(express.urlencoded({extended:true}))


const userRouter = require("./src/routes/user.route")
app.use("/api/v1/users",userRouter)

module.exports = app