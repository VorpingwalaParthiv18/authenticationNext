import dbConnect from "@/lib/mongoose";
import User from "@/model/User.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const { id } = await params;
    console.log("Received ID:", id);
    const user = await User.findOne({ email: id }).select("-password");
    console.log("User fetched by email:", user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        user,
        message: "User fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 },
    );
  }
  // await dbConnect();
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;
  // if (!token) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  // const decode = jwt.verify(
  //   token,
  //   process.env.JWT_SECRET || "your-secret-key",
  // ) as { userId: string };

  // const user = await User.findById(decode.userId).select("-password");

  // if (!user) {
  //   return NextResponse.json({ message: "User not found" }, { status: 404 });
  // }

  // let users;
  // if (user.roleLevel === 3) {
  //   // Superadmin sees all users except themselves
  //   users = await User.find({ _id: { $ne: user._id } }).select("-password");
  // } else if (user.roleLevel === 2) {
  //   // Admin sees non-superadmin users
  //   users = await User.find({
  //     role: { $ne: "superadmin" },
  //     _id: { $ne: user._id },
  //   }).select("-password");
  // } else {
  //   // Regular users don't see user list
  //   return NextResponse.json(
  //     {
  //       message: "You are not authorized to access this resource",
  //     },
  //     { status: 403 },
  //   );
  // }

  // if (!users || users.length === 0) {
  //   return NextResponse.json(
  //     {
  //       users: [],
  //       message: "No users available",
  //     },
  //     { status: 200 },
  //   );
  // }

  // return NextResponse.json(
  //   {
  //     users,
  //     currentUser: user,
  //     message: "Users fetched successfully",
  //   },
  //   { status: 200 },
  // );
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //     return NextResponse.json(
  //       { message: "Internal server error", error: (error as Error).message },
  //       { status: 500 },
  //     );
  //   }
}
