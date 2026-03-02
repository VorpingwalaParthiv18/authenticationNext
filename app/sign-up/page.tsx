"use client";

import Input from "@/components/Input";
import InputButton from "@/components/InputButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";
import { validatorSchema } from "@/lib/validators/password";

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
};
const ROLE_VALUES = [
  { id: "", value: "Select Role" },
  { id: "superadmin", value: "SuperAdmin" },
  { id: "admin", value: "Admin" },
  { id: "user", value: "User" },
];

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [role, setRole] = useState("");
  const router = useRouter();

  const validateForm = (): boolean => {
    const result = validatorSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    console.log("Validation result:", result);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        console.log("Validation error:", err);
        const field = err.path[0] as keyof FieldErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Handle form submission logic here
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        // Redirect to dashboard only after successful registration
        console.log("Sign-up successful:", data);
        router.push("/dashboard");
      } else {
        // Handle sign-up error, e.g., show error message
        toast.error(data.message || "Sign-up failed");
      }
    } catch (error) {
      toast.error("An error occurred during sign-in");
      console.error("An error occurred during sign-in:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign Up
          </h1>
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter Your First Name"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Enter Your Last Name"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <select
                // placeholder="Enter Your role"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition duration-200 text-black"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              >
                {ROLE_VALUES.map((r, index) => {
                  return (
                    <option key={index} value={r.id}>
                      {r.value}
                    </option>
                  );
                })}
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <InputButton type="submit" text="Sign Up" />
            <p className="text-black">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-900">
                Sign In
              </Link>
            </p>
            <ToastContainer />
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
