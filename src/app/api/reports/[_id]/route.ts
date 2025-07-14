import { connect } from "@/db/dbConfig";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

connect();

const convertTime = (seconds: number) => {
  if (seconds < 60) return `${seconds} sec${seconds > 1 ? "s" : ""}`;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? hours + " hour" + (hours > 1 ? "s" : "") : ""} ${
    minutes > 0 ? minutes + " min" + (minutes > 1 ? "s" : "") : ""
  }`.trim();
};

export const GET = async (
  req: Request,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;

  try {
    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const report = await Report.findById(_id);
    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    // Convert the report to an object and transform attachment buffers to Base64
    const formattedReport = {
      ...report.toObject(),
      activeTime: convertTime(report.activeTime),
      idleTime: convertTime(report.idleTime),
      attachment: report.attachment.map(
        (buffer: Buffer) => `data:image/png;base64,${buffer.toString("base64")}`
      ),
    };

    return NextResponse.json({
      success: true,
      report: formattedReport,
      name: report.userId + `'s Report`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
