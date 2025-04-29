const{Router} = require("express")
const router = Router()
const{registerDoctor,
    loginDoctor
} = require("../controllers/doctor.controller")

router.route("/registerDoctor").post(registerDoctor)
router.route("/login").post(loginDoctor)

module.exports = router