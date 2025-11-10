import Problem from "../models/problem.js";
import submission from "../models/Submission.js";
import {getLanguagebyID,submitBatch,submitToken} from "../utils/ProblemUtility.js";
const submitCode=async(req,res)=>{
try{
  const userId=req.result._id;
  console.log('keys:', Object.keys(req.result));
console.log('_id:', req.result._id);
console.log('id:', req.result.id);
  const problemId=req.params.id;
  const{code,language}=req.body;
  if(!userId||!problemId||!code||!language){
    return res.status(400).send("Some field is missing")
  }
  //Fetch the problem from database
  const problem=await Problem.findById(problemId)
  //apne submision ko pehle store kr du pehle
  const submittedResult=await submission.create({
    userId,
    problemId,
    code,
    language,
    testCasesPassed:0,
    status:'pending',
    testCasesTotal:problem.hiddenTestCases.length
  })
   console.log("dummy")
  //Now ,we have to submit the code to Judge0 
  const languageId=getLanguagebyID(language);
  //i am creating a batch submission
  const submissions=problem.hiddenTestCases.map((testcases)=>({
   source_code:code,
   language_id:languageId,
   stdin:testcases.input,
   expected_output:testcases.output
  }));
  //submit the code to judge0 in Batch
  const submitResult=await submitBatch(submissions)
  //fetch out the result token from submitResult
  const resultToken=submitResult.map((value)=>value.token)
  //now submit token to fetch the status_id and store it in testresult
  const TestResult= await submitToken(resultToken)
  let testCasesPassed=0;
  let runtime=0;
  let memory=0;
  let status='accepted'
  let errorMessage=null;
  for(const test of TestResult){
    if(test.status_id==3){
        testCasesPassed++;
      runtime=runtime+parseFloat(test.time)
      memory=Math.max(memory,test.memory)
    }
    else{
      if(test.status_id==4){
        status='error'
        errorMessage=test.stderr 
      }
      else{
        status='wrong'
      }
    }
  }
  //Judge0 ko submit krna hain
  submittedResult.testCasesPassed=testCasesPassed;
  submittedResult.status=status;
  submittedResult.errorMessage=errorMessage;
  submittedResult.runtime=runtime;
  submittedResult.memory=memory;
  await submittedResult.save();
  //Problem Id ko insert krenge UserSchema kai problemsolved main ,if it is already not present there
  if(!req.result.problemSolved.includes(problemId)){
    req.result.problemSolved.push(problemId)
    await req.result.save();
  }
  //req.result is a Mongoose document (you used User.findById in middleware without .lean()),
  // so modifying it and calling req.result.save() will persist changes.
  res.status(201).send(submittedResult);
}
catch(err){
 res.status(500).send("Internal Server Error"+err)
}
}
const runCode=async(req,res)=>{
try{
  const userId=req.result._id;
  const problemId=req.params.id;
  const{code,language}=req.body;
  if(!userId||!problemId||!code||!language){
    return res.status(400).send("Some field is missing")
  }
  //Fetch the problem from database
  const problem=await Problem.findById(problemId)
   console.log("dummy")
  //Now ,we have to submit the code to Judge0 
  const languageId=getLanguagebyID(language);
  //i am creating a batch submission
  const submissions=problem.visibleTestCases.map((testcases)=>({
   source_code:code,
   language_id:languageId,
   stdin:testcases.input,
   expected_output:testcases.output
  }));
  //submit the code to judge0 in Batch
  const submitResult=await submitBatch(submissions)
  //fetch out the result token from submitResult
  const resultToken=submitResult.map((value)=>value.token)
  //now submit token to fetch the status_id and store it in testresult
  const TestResult= await submitToken(resultToken)
  res.status(201).send(TestResult);
}
catch(err){
 res.status(500).send("Internal Server Error"+err)
}
}
export {submitCode,runCode}