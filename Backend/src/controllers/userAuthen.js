import User from "../models/user.js";
import validate from "../utils/validator.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import client from "../config/redis.js";
import submission from "../models/Submission.js";
const register=async(req,res)=>{
    try{
         console.log("JWT_TOKEN available in register:", !!process.env.JWT_TOKEN)
    //validate
    console.log(5)
     validate(req.body)
    const{firstName,emailId,password}=req.body
    req.body.password=await bcrypt.hash(password,10);
    const user=await User.create(req.body)
    const token=jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_TOKEN,{expiresIn: 60*60});
    // res.cookie('token',token,{expire : new Date(Date.now())})
    res.cookie('token',token,{maxAge: 60*60*1000})
    res.status(201).send("User Registered successfully")
    }
    catch(err){
        console.log("Error: "+err.message)
        res.status(400).send("Error occured")
    }
}
const login=async(req,res)=>{
    try{
        const {emailId,password}=req.body
        if(!emailId){
            throw new Error("Invalid Credentials")
        }
        if(!password){
            throw new Error("Invalid Credentials")
        }
        const user=await User.findOne({emailId})
         const match=bcrypt.compare(password,user.password)
         if(!match){
            throw new Error("Invalid Password")
         }
         const reply={
            firstName:  user.firstName,
            emailId: user.emailId,
            _id: user._id
         }
         if (!process.env.JWT_TOKEN) return res.status(500).send("Server misconfiguration: JWT_TOKEN not set")
          const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_TOKEN,{expiresIn: 60*60});
          res.cookie('token',token,{maxAge: 60*60*1000})
          res.status(201).json({
            user:reply,
            message:"Login successfull"
          })
    }
    catch(err){
        res.status(401).send("Error: "+err)
    }
}
const logout=async(req,res)=>{
    try{
       //validate the token
       const {token}=req.cookies
       if (!token) return res.status(400).send("No token provided")
       if (!process.env.JWT_TOKEN) return res.status(500).send("Server misconfiguration: JWT_TOKEN not set")
       //Token add kr dunga Redis kai blocklist main
       const payload=jwt.decode(token)
       await client.set(`token:${token}`,'Blocked')
       await client.expireAt(`token:${token}`,payload.exp)
       //Cookies ko clear kr dena....
       res.cookie("token",null,{expires: new Date(Date.now())})
       res.send("Logged out successfully")
    }
    catch(err){
        res.status(503).send("Error: "+err)
    }
}
const adminRegister=async(req,res)=>{
    try{
         console.log("JWT_TOKEN available in register:", !!process.env.JWT_TOKEN)
    //validate
    console.log(5)
    validate(req.body)
    const{firstName,emailId,password}=req.body
    if(req.result.role!='admin')
        throw new Error("Role is user can't be registered as an admin")
    req.body.password=await bcrypt.hash(password,10);
    const user=await User.create(req.body)
    const token=jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_TOKEN,{expiresIn: 60*60});
    // res.cookie('token',token,{expire : new Date(Date.now())})
    res.cookie('token',token,{maxAge: 60*60*1000})
    res.status(201).send("User Registered successfully")
    }
    catch(err){
        console.log("Error: "+err.message)
        res.status(400).send("Error occured")
    }
}
const deleteprofile=async(req,res)=>{
    try{
      const userId=req.result._id
    //UserSchema sai delete
    await User.findByIdAndDelete(userId)// when this userId is deleted,then  userschema.post is activated b/c of findoneand delete
     //submission schema sai bhi delete kro
    //  await submission.deleteMany({userId}) , i already created a post function in schema so that i don't have to use 
    // this function here 
     res.status(200).send("Deleted successfully")
    }
    catch(err){
        res.status(500).send("Internal Server Error")
    }
}
export {register,login,logout,adminRegister,deleteprofile}