const {Router} = require('express')


const {
    registerUser,
    login
} = require("../controllers/user.controller")
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)

module.exports = router