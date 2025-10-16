import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authOptions } from "@/lib/auth";  // <-- if you defined your options in a separate file

// Create handler
const handler = NextAuth(authOptions);

// Export both GET and POST methods for Next.js App Router
export { handler as GET, handler as POST };
