import express from 'express'
const SubmitRouter=express.Router()
import userMiddleware from '../middleware/userMiddleware.js'
import { submitCode,runCode} from '../controllers/userSubmission.js'
import submitCodeRateLimiter from '../middleware/ratelimiter.js'
console.log("submit2")
SubmitRouter.post("/submit/:id",userMiddleware,submitCodeRateLimiter,submitCode)
SubmitRouter.post("/run/:id",userMiddleware,submitCodeRateLimiter,runCode)
export default SubmitRouter