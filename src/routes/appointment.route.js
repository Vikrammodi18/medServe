const {Router} = require("express")
const router = Router()
const verifyJWT = require("../middleware/auth.middleware")
const{
    takeAppointment,
    getAppointmentDetails,
} =require("../controllers/appointment.controller")

router.route("/:doctorId/takeAppointment").post(verifyJWT,takeAppointment)
router.route("/:doctorId").post(getAppointmentDetails)
module.exports = router