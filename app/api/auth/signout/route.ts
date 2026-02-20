import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Delete the token cookie
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return NextResponse.json({ message: "Signed out successfully" });
}
