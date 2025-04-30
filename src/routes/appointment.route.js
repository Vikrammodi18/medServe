const {Router} = require("express")
const router = Router()
const {verifyJWT,verifyJWTdoctor} = require("../middleware/auth.middleware")
const{
    takeAppointment,
    getAppointmentDetails,
    confirmOrCancelAppointment
} =require("../controllers/appointment.controller")

router.route("/:doctorId/takeAppointment").post(verifyJWT,takeAppointment)
router.route("/getAppoitmentDetails").post(verifyJWTdoctor,getAppointmentDetails)
router.route("/status/:appointmentId").post(verifyJWTdoctor,confirmOrCancelAppointment)
module.exports = router