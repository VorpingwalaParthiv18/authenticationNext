import dbConnect from "@/lib/mongoose";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
    const {email,password} = await req.json();
    
    if(!email || !password){
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }
    const user = await User.findOne({email});
    if(!user){
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 400 }
        );
    }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for user:", email);
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );
        console.log("User signed in successfully:", email);

        return NextResponse.json(
            { token, message: "Sign in successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error signing in:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}