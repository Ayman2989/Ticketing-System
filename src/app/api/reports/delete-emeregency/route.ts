import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

connect();

export const DELETE = async () => {
  try {
    const date = "2025-05-03";
    const userId = "002";

    const deletedReport = await Report.deleteOne({ userId, date });

    if (deletedReport.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No report found for the given userId and date.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Report for userId ${userId} on ${date} deleted successfully.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete report",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
