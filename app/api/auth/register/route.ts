import dbConnect from "@/lib/mongoose";
import User from "@/model/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, role } = await req.json();

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 200 },
    );
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let users;
    if (user.roleLevel === 3) {
      // Superadmin sees all users except themselves
      users = await User.find({ _id: { $ne: user._id } }).select("-password");
    } else if (user.roleLevel === 2) {
      // Admin sees non-superadmin users
      users = await User.find({
        role: { $ne: "superadmin" },
        _id: { $ne: user._id },
      }).select("-password");
    } else {
      // Regular users don't see user list
      return NextResponse.json(
        {
          message: "You are not authorized to access this resource",
        },
        { status: 403 },
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          users: [],
          message: "No users available",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        users,
        currentUser: user,
        message: "Users fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 },
    );
  }
}
