import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextRequest, NextResponse } from "next/server";

connect();

const convertTime = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec${seconds > 1 ? "s" : ""}`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") : ""} ${
    minutes > 0 ? minutes + " min" + (minutes > 1 ? "s" : "") : ""
  }`.trim();
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId, date } = await req.json(); // date = "2025-02-17"

    if (!userId || !date) {
      return NextResponse.json(
        { error: "Missing userId or date" },
        { status: 400 }
      );
    }

    const report = await Report.findOne({
      userId,
      date,
    });

    if (!report) {
      return NextResponse.json(
        { message: "No Work Time found" },
        { status: 404 }
      );
    }

    const completedShift = report.activeTime > 28800 ? true : false; // 8 hours = 28800 seconds

    return NextResponse.json(
      {
        workTime: convertTime(report.activeTime),
        completedShift: completedShift,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err },
      { status: 500 }
    );
  }
};
