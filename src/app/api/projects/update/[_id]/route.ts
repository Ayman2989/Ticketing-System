import { connect } from "@/db/dbConfig";
import Project from "@/models/Project";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
  try {
    const { project_name, status } = await req.json();

    const oldProject = await Project.findById(_id);
    const oldProjectName = oldProject.project_name;

    const updatedProject = await Project.findByIdAndUpdate(
      _id,
      { project_name, status },
      { new: true }
    );

    if (!updatedProject) {
      return NextResponse.json({ message: "item not found" });
    }

    const updatedTicket = await Ticket.updateMany(
      { project: oldProjectName },
      { $set: { project: project_name } }
    );

    if (updatedTicket.matchedCount === 0) {
      console.warn("No related projects found to update.");
    }

    return NextResponse.json({ message: "project update", updatedProject });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
