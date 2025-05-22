const{Router} = require("express")
const router = Router()
const{registerDoctor,
    loginDoctor,
    getAllDoctor
} = require("../controllers/doctor.controller")
const {verifyJWTAdmin}  = require('../middleware/auth.middleware')
router.route("/registerDoctor").post(verifyJWTAdmin,registerDoctor)
router.route("/login").post(loginDoctor)
router.route("/getAllDoctor").get(getAllDoctor)
module.exports = router