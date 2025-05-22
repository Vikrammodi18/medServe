const {Router} = require('express')
const { registerAdmin, loginAdmin } = require('../controllers/admin.controller')
const router = Router()


router.route("/registerAdmin").post(registerAdmin)
router.route("/loginAdmin").post(loginAdmin)

module.exports = router