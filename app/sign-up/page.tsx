"use client";

import Input from "@/components/Input"
import InputButton from "@/components/InputButton"
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";



const page = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        try{

          // Handle form submission logic here
          const response = await fetch("/api/register",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ firstName, lastName, email, password }),
        });
        const data = await response.json();
        if(response.ok){
          toast.success(data.message);
            // Handle successful sign-in, e.g., store token, redirect, etc.
            console.log("Sign-in successful:", data);
        }
        else{
            // Handle sign-in error, e.g., show error message
            console.error("Sign-in failed:", data);
          }
        }
        catch(error){
              toast.error("An error occurred during sign-in");
            console.error("An error occurred during sign-in:", error);
        }
    }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h1>
          <div className="space-y-4">
          <div>
            <Input type="text" placeholder="Enter Your First Name" onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
          </div>
          <div>
            <Input type="text" placeholder="Enter Your Last Name" onChange={(e) => setLastName(e.target.value)} value={lastName}/>
          </div>
          <div>
            <Input type="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
          </div>
          <div>
            <Input type="password" placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>
            <InputButton type="submit" text="Sign Up"/>
            <ToastContainer />
          </div>
        </div>
      </div>
    </form>
  )
}

export default page