import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

connect();

// Convert seconds to hours and minutes
const convertTime = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec${seconds > 1 ? "s" : ""}`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") : ""} ${
    minutes > 0 ? minutes + " min" + (minutes > 1 ? "s" : "") : ""
  }`.trim();
};

export const GET = async () => {
  try {
    const reports = await Report.find()
      .select("_id userId activeTime idleTime date createdAt")
      .slice("attachment", 1);

    const formattedReports = reports.map((report) => ({
      ...report.toObject(),
      activeTime: convertTime(report.activeTime),
      idleTime: convertTime(report.idleTime),
      // Convert Buffer images to base64 for frontend display
      attachment: report.attachment.map(
        (buffer: Buffer) => `data:image/png;base64,${buffer.toString("base64")}`
      ),
    }));

    // Cleanup: remove attachments of reports older than a week
    // Cleanup: remove attachments of reports older than 7 full days using createdAt
    const now = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - 7);

    // Convert to YYYY-MM-DD format for accurate string comparison
    const cutoffString = cutoffDate.toISOString().split("T")[0]; // e.g., "2025-04-10"

    const outdatedReports = await Report.find({
      date: { $lt: cutoffString },
    });

    await Promise.all(
      outdatedReports.map((report) =>
        Report.findByIdAndUpdate(report._id, {
          $set: { attachment: [] },
        })
      )
    );

    return NextResponse.json({ reports: formattedReports });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reports",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
