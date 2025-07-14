import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(req: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      message: "logged out",
      success: true,
    });

    // Clear token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
      path: "/", // Ensure it clears from all paths
    });
    response.cookies.set("role", "", {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
      path: "/", // Ensure it clears from all paths
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "An error occurred",
        success: false,
      },
      { status: 500 }
    );
  }
}
