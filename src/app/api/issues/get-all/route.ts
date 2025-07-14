import { connect } from "@/db/dbConfig";
import Issue from "@/models/Issue";

import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const issues = await Issue.find();
    return NextResponse.json({ issues });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
