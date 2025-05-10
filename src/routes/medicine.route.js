const {Router} = require('express')

const router = Router()
const upload = require('../middleware/multer.middlware.js')
const {uploadMedicine,getAllMedicine} = require('../controllers/medicine.controller.js')
const {verifyJWT} = require('../middleware/auth.middleware.js')

router.route("/uploadMedicine").post(upload.single("medicineImage"),uploadMedicine)
router.route("/getAllMedicine").get(getAllMedicine)
module.exports = router