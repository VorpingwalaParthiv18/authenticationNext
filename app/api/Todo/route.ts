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
    console.log("User from DB:", user);
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

    const newTodo = new Todo({
      title,
      id: new Date().getTime().toString(),
      createdBy: user._id,
      createdRoleLevel: user.roleLevel,
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

export async function GET(request: NextRequest) {
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

    console.log("Decoded token:", decode);
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const todos = await Todo.find({ createdBy: user._id });
    // const todos = await Todo.find();
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Implement update functionality here
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const verfiyToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    // console.log(verifyToken);
    const user = await User.findById(verfiyToken?.userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "unAuthorized " }, { status: 401 });
    }

    if (user.roleLevel < 2) {
      return NextResponse.json(
        { message: "this user can't be accessed to edit the todo" },
        { status: 401 },
      );
    }

    const { id, title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }
    const updatedTodo = await Todo.findOneAndUpdate(
      { id },
      { title },
      { new: true },
    );

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    updatedTodo.save();
    return NextResponse.json(
      { message: "Todo updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Implement delete functionality here
  try {
    await dbConnect();  
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const verfiyToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as { userId: string };

    const user = await User.findById(verfiyToken?.userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "unAuthorized " }, { status: 401 });
    }
    if (user.roleLevel < 2) {
      return NextResponse.json(
        { message: "this user can't be accessed to edit the todo" },
        { status: 401 },
      );
    }

    const { id } = await request.json();
    const deletedTodo = await Todo.findOneAndDelete({
      id,
    });
    console.log("Deleted todo:", deletedTodo);
    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }
    deletedTodo.save();
    return NextResponse.json(
      { message: "Todo deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in Todo route:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
