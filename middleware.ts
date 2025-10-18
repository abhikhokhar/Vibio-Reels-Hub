import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // ✅ Allow public routes (login, register, API auth)
    if (
      pathname.startsWith("/api/auth") ||
      pathname === "/login" ||
      pathname === "/register"
    ) {
      return NextResponse.next();
    }

    // ✅ Check if the user is authenticated
    const token = req.nextauth?.token;

    if (!token) {
      // ✅ Redirect to login if no session
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // ✅ Allow access if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // we'll handle auth manually above
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except Next.js internals & static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
