import { connect } from "@/db/dbConfig";
import Module from "@/models/Module";

import { NextRequest, NextResponse } from "next/server";

connect();
export const POST = async (req: NextRequest) => {
  try {
    const { module_name, status } = await req.json();
    const newModule = new Module({
      module_name,
      status,
    });
    const savedModule = await newModule.save();
    return NextResponse.json({
      message: "Module Created",
      success: true,
      savedModule,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
