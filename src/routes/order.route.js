const {Router} = require('express')
const { 
    placedOrder,
    getOrderDetails,
    orderHandleByAdmin,
    orderStatus
     } = require("../controllers/order.controller")
const { verifyJWT,verifyJWTAdmin } = require("../middleware/auth.middleware")

const router = Router()

router.route("/placedOrder").post(verifyJWT,placedOrder)
router.route("/getOrderDetails").get(verifyJWT,getOrderDetails)
router.route("/orderHandleByAdmin").get(verifyJWTAdmin,orderHandleByAdmin)
router.route("/orderStatus").put(verifyJWTAdmin,orderStatus)
module.exports = router