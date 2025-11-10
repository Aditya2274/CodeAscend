import express from 'express'
import adminMiddleware from '../middleware/adminMiddleware.js'
import userMiddleware from '../middleware/userMiddleware.js'
const problemRouter=express.Router()
import {createProblem,problemUpdate,problemDelete,problemfetch,problemFetchAll,solvedAllProblem,submittedProblem} from '../controllers/userProblem.js'
problemRouter.post("/create",adminMiddleware,createProblem)
problemRouter.put("/update/:id",adminMiddleware,problemUpdate)
problemRouter.delete("/delete/:id",adminMiddleware,problemDelete)

problemRouter.get("/problemById/:id",userMiddleware,problemfetch)
problemRouter.get("/getAllProblem",userMiddleware,problemFetchAll)
problemRouter.get("/ProblemSolvedByUser",userMiddleware,solvedAllProblem)
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)

export default problemRouter