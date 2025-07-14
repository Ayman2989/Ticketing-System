import User from "@/models/User";
import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Set to 24:00 (midnight of today)

  const diffMs = midnight.getTime() - now.getTime(); // Difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000); // Convert to seconds

  return diffSec;
}

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    // check if user exist

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "userd oesnt exist" }, { status: 400 });
    }
    console.log("user exist");

    //check password

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "wrong pasword" }, { status: 400 });
    }
    // token
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const secondsUntilMidnight = getSecondsUntilMidnight();

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: secondsUntilMidnight, // Token expires at midnight
    });

    const response = NextResponse.json({
      message: "logged in",
      success: true,
      user,
    });

    response.cookies.set("token", token, {
      httpOnly: true, // For security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent cross-site request forgery
      path: "/", // Make the cookie available on all routes
      maxAge: secondsUntilMidnight, // Cookie also expires at midnight
    });
    response.cookies.set("role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: secondsUntilMidnight, // Cookie also expires at midnight
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
};
