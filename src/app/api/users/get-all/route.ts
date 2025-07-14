import User from "@/models/User";
import { connect } from "../../../../db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async () => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, { password: 0 }).lean(); // Exclude password field for security

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
};
