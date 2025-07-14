import { connect } from "@/db/dbConfig";
import Module from "@/models/Module";

import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const modules = await Module.find();
    return NextResponse.json({ modules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
