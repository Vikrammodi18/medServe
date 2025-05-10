const {Router} = require('express')

const router = Router()
const {uploadMedicine} = require('../controllers/medicine.controller.js')
const upload = require('../middleware/multer.middlware.js')
const {verifyJWT} = require('../middleware/auth.middleware.js')

router.route("/uploadMedicine").post(upload.single("medicineImage"),uploadMedicine)

module.exports = router