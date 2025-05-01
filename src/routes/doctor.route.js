const{Router} = require("express")
const router = Router()
const{registerDoctor,
    loginDoctor,
    getAllDoctor
} = require("../controllers/doctor.controller")

router.route("/registerDoctor").post(registerDoctor)
router.route("/login").post(loginDoctor)
router.route("/getAllDoctor").get(getAllDoctor)
module.exports = router