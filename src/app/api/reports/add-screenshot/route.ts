import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

connect();

export const POST = async (req: Request) => {
  try {
    const { userId, image } = await req.json();

    if (!userId || !image) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert base64 image to Buffer
    const buffer = Buffer.from(image.split(",")[1], "base64");

    // Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

    // Find the report for the user and date
    let report = await Report.findOne({ userId, date: currentDate });

    if (report) {
      // Update the existing report by adding the new screenshot
      report.attachment.push(buffer);
    } else {
      // Create a new report if one doesn't exist
      report = new Report({
        userId,
        date: currentDate,
        activeTime: 0,
        idleTime: 0,
        attachment: [buffer],
      });
    }

    await report.save();

    return NextResponse.json({
      success: true,
      message: "Screenshot added successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save screenshot",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
