import express from "express"
const router = express.Router()

import {login,register,forgotPassword, resetPassword,} from "../controllers/authCtrl.js"

router.get('/',(req,res)=>{
    res.send("This is Homepage")
})

router.post('/register',register)
router.post('/login',login)
router.post('/forgotpassword',forgotPassword)
router.post('/resetpassword/:resetToken',resetPassword)

export default router