import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod'
//Schema Validation for signup
const SignUpSchema=z.object({
  firstName:z.string().min(3,"FirstName should atleast be of three characters"),
  emaiId: z.email(),
  password:z.string().min(8,"Password should be of atleast 8 characters")
})
function SignUp(){
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({resolver: zodResolver(SignUpSchema)});
  return(
    <>
    <form onSubmit={handleSubmit((data)=> console.log(data))} className="min-h-screen flex flex-col justify-center items-center gap-y-6 max-w-xl ml-150">
      <input {...register('firstName')} type="text" placeholder="Enter name"/>
      {errors.firstName && (<span>{errors.firstName.message}</span>)}
      <input {...register('email')} type="text" placeholder="Enter email"/>
      <input {...register('password')} type="password" placeholder="Enter password"/>
      <button type="submit" className="btn btn-lg">Submit</button>
    </form>
    </>
  )
}
export default SignUp
// import { useState } from "react"

// function SignUp(){
//   const [name,setname]=useState('')
//   const [email,setemail]=useState('')
//   const [password,setpassword]=useState('')
//   const handleSubmit=(e)=>{
//     e.preventdefault()
//     //validation
//   }
//   return(
//     <>
//     <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center">
//       <input type="text" value={name} placeholder="Enter your name" onChange={(e)=>setname(e.target.value)}/>
//       <input type="text" value={email} placeholder="Enter your email" onChange={(e)=>setemail(e.target.value)}/>
//       <input type="text" value={password} placeholder="Enter your name" onChange={(e)=>setpassword(e.target.value)}/>
//       <button type="submit">Submit</button>
//     </form>
//     </>
//   )
// }
