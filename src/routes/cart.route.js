const {Router} = require('express')

const router = Router()
const {addToCart, getCart, deleteItem} = require("../controllers/cart.controller.js")
const {verifyJWT} = require('../middleware/auth.middleware.js')

router.route("/addToCart").post(verifyJWT,addToCart)
router.route("/getCart").get(verifyJWT,getCart)
router.route("/deleteCartItem").delete(verifyJWT,deleteItem)
module.exports = router