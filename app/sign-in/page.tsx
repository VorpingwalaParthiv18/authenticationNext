'use client'
import Input from "@/components/Input"
import InputButton from "@/components/InputButton"
import { ToastContainer,toast } from "react-toastify";
import { useState } from "react";

const page = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try{

            const response = await fetch("/api/signin",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if(response.ok){
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
        }
            catch(error){
                toast.error("An error occurred during sign-in");
                console.log("Error during sign-in:",error);
            }
    }
            
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
         
          <div>
            <Input type="email" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
          </div>
          <div>
            <Input type="password" placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>
          <InputButton type="submit" text="Sign In" />
            <ToastContainer />
          <p>Other sign-in option</p>

        </form>
      </div>
    </div>
  )
}


export default page
    