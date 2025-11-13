import { response } from "express";
import Problem from "../models/problem.js";
import {getLanguagebyID,submitBatch,submitToken} from "../utils/ProblemUtility.js";
import User from "../models/user.js";
import submission from "../models/Submission.js";
const createProblem=async(req,res)=>{
    const {title,description,difficulty,tags,visibleTestCases,
        hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body
    try{
      //first language and code are given to judge0 for the compilation
      //  and then return token which is then again submittted to get the
      //  status._id
      for (const {language,completeCode} of referenceSolution){
        //source_code
        //language_id
        //stdin:
        //expected_output
        const languageId=getLanguagebyID(language);
        //i am creating a batch submission
        const submissions=visibleTestCases.map((testcases)=>({
         source_code:completeCode,
         language_id:languageId,
         stdin:testcases.input,
         expected_output:testcases.output
        }));
        const submitResult=await submitBatch(submissions)
        const resultToken=submitResult.map((value)=>value.token)
        //["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        const TestResult= await submitToken(resultToken)
        for(const test of TestResult){
          if(test.status_id!=3){
            return res.status(400).send("Error Occured")
          }
        }
      }
      //Now we can store it in database
      const userProblem=await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      })
      res.status(200).send("Problem saved Successfully")
    }
    catch(err){
        console.log("Error: ",err);
    }
}
const problemUpdate=async(req,res)=>{
 const{id}=req.params
 const {title,description,difficulty,tags,visibleTestCases,
        hiddenTestCases,startCode,referenceSolution,problemCreator}=req.body
        try{
          // console.log(_id)
          if(!id){
           return res.status(400).send("Id is missing")
          }
          console.log(id)
          const prob= await Problem.findById(id);
          if(!prob){
            return res.status(404).send("ID is not present")
          }
            for (const {language,completeCode} of referenceSolution){
              //source_code
              //language_id
              //stdin:
              //expected_output
              const languageId=getLanguagebyID(language);
              //i am creating a batch submission
              const submissions=visibleTestCases.map((testcases)=>({
               source_code:completeCode,
               language_id:languageId,
               stdin:testcases.input,
               expected_output:testcases.output
              }));
              const submitResult=await submitBatch(submissions)
              const resultToken=submitResult.map((value)=>value.token)
              //["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
              const TestResult= await submitToken(resultToken)
              for(const test of TestResult){
                if(test.status_id!=3){
                  return res.status(400).send("Error Occured")
                }
              }
            }
            const newprob= await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})
            //runvalidators ,check for the validators like length, enum, max,min in each field of models and then updates
            //new is true, so that newly updated problem can be returned
            res.status(200).send(newprob)
           }
        catch(err){
           res.status(500).send("Error occured"+err)
        }
}
const problemDelete=async(req,res)=>{
  const{id}=req.params
  console.log(id)
  try{
    if(!id){
      return res.status(400).send("ID is missing")
    }
    const prob= await Problem.findById(id);
          if(!prob){
            return res.status(404).send("ID is not present")
          }
    const deletedprob =await Problem.findByIdAndDelete(id)
    if(!deletedprob)
      return res.status(404).send("Problem is missing")
    res.status(200).send("Successfully deleted")
   }
   catch(err){
    res.status(500).send("Error occured"+err)
   }
}
const problemfetch=async(req,res)=>{
  const{id}=req.params
  try{
    if(!id){
      res.status(400).send("ID is missing")
    }
    const prob= await Problem.findById(id);
          if(!prob){
            return res.status(404).send("ID is not present")
          }
    const findprob =await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution')
    // another way is if in .select('-hiddenTestCases') ,like in such a way it's written ,then everything 
    //except th field with '-' sign will be printed
    if(!findprob)
      return res.status(404).send("Problem is missing")
    res.status(200).send(findprob)
   }
   catch(err){
    res.status(500).send("Error occured"+err)
   }
}
const problemFetchAll=async(req,res)=>{
  try{
    const prob= await Problem.find({}).select('_id title difficulty tags');
          if(prob.length==0){
            return res.status(404).send("Problems are not present")
          }
    res.status(200).send(prob)
   }
   catch(err){
    res.status(500).send("Error occured"+err)
   }
}
const solvedAllProblem=async(req,res)=>{
  try{
    const userId=req.result._id;
    const user=await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id title difficulty tags"
    })
    const count=req.result.problemSolved.length;
    res.status(200).send(user);    
  }
  catch(err){
    res.status(500).send("Server error")
  }
}
const submittedProblem=async(req,res)=>{
  try{
    const userId=req.result._id
    const problemId=req.params.pid
    const ans=await submission.find({userId,problemId})
    if(ans.length==0)
      res.status(200).send("No submission is present")
    res.status(200).send(ans)
  }
  catch(err){
   res.status(500).send("Internal Server error")
  }
}
export {createProblem,problemUpdate,problemDelete,problemfetch,problemFetchAll,solvedAllProblem,submittedProblem}