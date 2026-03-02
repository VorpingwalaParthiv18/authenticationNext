import dbConnect from "@/lib/mongoose";
import Todo from "@/model/Todo.model";
import User from "@/model/User.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // console.log("Token from cookie:", token);
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    // // console.log("Decoded token:", decode);
    const user = await User.findById(decode.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // console.log("User from DB:", user);
    if (user.roleLevel < 3) {
      return NextResponse.json(
        { message: "this user can't be accessed to create the todo" },
        { status: 401 },
      );
    }

    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    // Find the target user by email
    const targetUser = await User.findOne({ email: id });
    if (!targetUser) {
      return NextResponse.json(
        { message: "Target user not found" },
        { status: 404 },
      );
    }

    const newTodo = new Todo({
      title,
      id: new Date().getTime().toString(),
      createdBy: targetUser._id,
      createdRoleLevel: targetUser.roleLevel,
    });

    await newTodo.save();
    return NextResponse.json(
      { message: "Todo saved successfully", todo: newTodo },
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Find user by email
    const user = await User.findOne({ email: id });
    console.log("User from DB:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user._id;
    console.log("Received ID:", id, "User ID:", userId);

    // Find all todos for this user
    const todos = await Todo.find({ createdBy: userId });

    return NextResponse.json({ todos: todos || [] }, { status: 200 });

    // await dbConnect();
    // const cookieStore = await cookies();
    // const token = cookieStore.get("token")?.value;
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    // console.log("Token from cookie:", token);
    // const decode = jwt.verify(
    //   token,
    //   process.env.JWT_SECRET || "your-secret-key",
    // ) as { userId: string };

    // console.log("Decoded token:", decode);
    // const user = await User.findById(decode.userId).select("-password");
    // if (!user) {
    //   return NextResponse.json({ message: "User not found" }, { status: 404 });
    // }

    // // const todos = await Todo.find({ createdBy: user._id });
    // const todos = await Todo.find();
    // return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
