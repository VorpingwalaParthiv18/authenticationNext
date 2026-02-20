import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/model/User.model";
import dbConnect from "@/lib/mongoose";
import Todo from "@/model/Todo.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log("Token from cookie:", token);
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    // console.log("Decoded token:", decode);
    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    const newTodo = new Todo({
      title,
      createdBy: user._id,
    });

    await newTodo.save();
    return NextResponse.json(
      { message: "Todo saved successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    console.log("Token from cookie:", token);
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    // console.log("Decoded token:", decode);
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const todos = await Todo.find({ createdBy: user._id });
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
