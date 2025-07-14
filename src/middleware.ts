import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  // Retrieve the token from cookies
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  if (!token) {
    // Redirect to the login page if the token is missing
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!role) {
    // Redirect to the login page if the token is missing
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (role !== "Admin") {
    // Allow access to /login and /tickets/* paths for non-Admin users
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/tickets")
    ) {
      return NextResponse.next();
    }
    // Redirect to the login page if the role is not Admin and the path is not allowed
    return NextResponse.redirect(new URL("/tickets", req.url));
  }
  try {
    // Optionally: Verify token validity here (if needed)
    // const isValid = jwt.verify(token, process.env.TOKEN_SECRET!);
    // if (!isValid) throw new Error("Invalid token");
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token:", error);
    // Redirect to login page on error
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Match all routes under `/tickets`
export const config = {
  matcher: [
    "/tickets/:path*", // Matches /tickets and its subpaths
    "/clients/:path*", // Matches /clients and its subpaths
    "/users/:path*", // Matches /users and its subpaths
    "/client-types/:path*", // Matches /users and its subpaths
    "/issues/:path*", // Matches /users and its subpaths
    "/modules/:path*", // Matches /users and its subpaths
    "/projects/:path*", // Matches /users and its subpaths
    "/statistics/:path*", // Matches /users and its subpaths
    "/reports/:path*", // Matches /users and its subpaths
  ],
};
