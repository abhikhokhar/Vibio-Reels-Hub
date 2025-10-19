import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname, origin } = req.nextUrl;

    // ✅ Allow public routes (login, register, API auth)
    if (
      pathname.startsWith("/api/auth") ||
      pathname === "/login" ||
      pathname === "/register"
    ) {
      return NextResponse.next();
    }

    // ✅ Check if user has a valid token
    const token = req.nextauth?.token;

    if (!token) {
      // ✅ Always build absolute redirect URL safely
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // optional: return after login
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // we'll handle manually
    },
  }
);

export const config = {
  matcher: [
    // Match all routes except Next.js internals & static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
