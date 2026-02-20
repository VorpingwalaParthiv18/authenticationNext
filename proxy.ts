import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  const { pathname } = request.nextUrl;

  // If user is trying to access dashboard without token, redirect to sign-in
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If user is authenticated and tries to access sign-in/sign-up, redirect to dashboard
  if (
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) &&
    token
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

//  Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};
