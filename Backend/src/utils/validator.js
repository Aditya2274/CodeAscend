import validator from "validator"

const validate=(data)=>{
  const mandatoryfield =['firstName','emailId','password']
  const IsAllowed=mandatoryfield.every((k)=>Object.keys(data).includes(k));
  if(!IsAllowed)
     throw new Error("some field Missing")
  if(!validator.isEmail(data.emailId))
     throw new Error("EmailId Invalid")
  if(!validator.isStrongPassword(data.password))
    throw new Error("Weak Password")
     
}
export default  validate