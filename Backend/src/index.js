import express from 'express';
const app=express()
import dotenv from 'dotenv'
dotenv.config()
console.log('JWT_TOKEN length at startup:', (process.env.JWT_TOKEN||'').length)
import cookieParser from 'cookie-parser'
import main from './config/db.js';
import User from './models/user.js';
import authRouter from './routes/userAuth.js';
import client from "./config/redis.js"
import userMiddleware from './middleware/userMiddleware.js';
import problemRouter from './routes/problemCreator.js';
import SubmitRouter from './routes/submit.js';
app.use(express.json())// to convert json data in req.body to object
app.use(cookieParser())
console.log(1)
app.use("/auth",authRouter)
app.use("/problem",problemRouter)
console.log("submit")
app.use("/submission",SubmitRouter)
console.log(2)
const InitializeConnection=async()=>{
    try{
       await Promise.all([main(),client.connect()])
       console.log("DB Connected")
       app.listen(process.env.PORT,()=>{
        console.log("Server listening at port number: "+process.env.PORT)
    })
    }
    catch(err){
        console.log("Error Occured:"+err)
    }
}
InitializeConnection()
// main()
// .then(async()=>{
//     app.listen(process.env.PORT,()=>{
//         console.log("Server listening at port number: "+process.env.PORT)
//     })
// })
// .catch(err=>console.log("Error Occured:"+err))