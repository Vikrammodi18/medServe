const {Router} = require("express")
const router = Router()
const{
    takeAppointment,
} =require("../controllers/appointment.controller")

router.route("/:doctorId/takeAppointment").post(takeAppointment)

module.exports = router