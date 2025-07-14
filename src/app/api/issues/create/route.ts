import { connect } from "@/db/dbConfig";
import Issue from "@/models/Issue";

import { NextRequest, NextResponse } from "next/server";

connect();
export const POST = async (req: NextRequest) => {
  try {
    const { issue, status } = await req.json();
    const newIssue = new Issue({
      issue,
      status,
    });
    const savedIssue = await newIssue.save();
    return NextResponse.json({
      message: "Issue Created",
      success: true,
      savedIssue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
