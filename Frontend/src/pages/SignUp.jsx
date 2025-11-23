import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.email("Invalid Email"),
  password: z.string().min(8, "Password is to weak")
});

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = (data) => {
    console.log(data);

    // Backend data ko send kar dena chaiye?
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"> {/* Centering container */}
      <div className="card w-96 bg-base-100 shadow-xl"> {/* Existing card styling */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">CodeAscend</h2> {/* Centered title */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}
            <div className="form-control">
              <label className="label mb-1">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered ${errors.firstName && 'input-error'}`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="form-control  mt-4">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered ${errors.emailId && 'input-error'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password && 'input-error'}`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
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
