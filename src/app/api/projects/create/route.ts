import { connect } from "@/db/dbConfig";
import Project from "@/models/Project";

import { NextRequest, NextResponse } from "next/server";

connect();
export const POST = async (req: NextRequest) => {
  try {
    const { project_name, status } = await req.json();
    const newProject = new Project({
      project_name,
      status,
    });
    const savedProject = await newProject.save();
    return NextResponse.json({
      message: "Project Created",
      success: true,
      savedProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
