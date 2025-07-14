import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const { userId, date, activeTime, idleTime } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Store session data in MongoDB
    await Report.findOneAndUpdate(
      { userId, date },
      { $set: { activeTime, idleTime } },
      { upsert: true }
    );

    // ✅ Return a success response
    return NextResponse.json(
      { success: true, message: "Report updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the report",
      },
      { status: 500 }
    );
  }
};
