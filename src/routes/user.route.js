const {Router} = require('express')

const router = Router()
const {
    registerUser,
    login
} = require("../controllers/user.controller")


router.route("/register").post(registerUser)
router.route("/login").post(login)

module.exports = router