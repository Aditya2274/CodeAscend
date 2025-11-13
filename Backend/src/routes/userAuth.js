import express from 'express'
import {register,login,logout,adminRegister,deleteprofile} from "../controllers/userAuthen.js"
import userMiddleware from '../middleware/userMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const authRouter= express.Router()
//Register
console.log(3)
authRouter.post("/register",register);
console.log(4)
//login
authRouter.post("/login",login);
//logout
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);
//GetProfile
authRouter.delete("/deleteprofile",userMiddleware,deleteprofile);
export default authRouter