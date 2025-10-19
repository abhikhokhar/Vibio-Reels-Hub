import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/api/auth") ||
      pathname === "/login" ||
      pathname === "/register"
    ) {
      return NextResponse.next();
    }

    const token = req.nextauth?.token;

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, 
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except Next.js internals & static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
