const {Router} = require('express')
const { 
    placedOrder,
    getOrderDetails
     } = require("../controllers/order.controller")
const { verifyJWT } = require("../middleware/auth.middleware")

const router = Router()

router.route("/placedOrder").post(verifyJWT,placedOrder)
router.route("/getOrderDetails").get(verifyJWT,getOrderDetails)
module.exports = router