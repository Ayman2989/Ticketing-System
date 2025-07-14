import { connect } from "@/db/dbConfig";
import Module from "@/models/Module";
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
    const { module_name, status } = await req.json();

    const oldModule = await Module.findById(_id);

    if (!oldModule) {
      NextResponse.json({ message: "no module" });
    }

    const oldModuleName = oldModule.module_name;

    const updatedModule = await Module.findByIdAndUpdate(
      _id,
      { module_name, status },
      { new: true }
    );

    if (!updatedModule) {
      return NextResponse.json({ message: "item not found" });
    }

    const updatedTicket = await Ticket.updateMany(
      { module: oldModuleName },
      { $set: { module: module_name } }
    );

    if (updatedTicket.matchedCount === 0) {
      console.warn("No related modules found to update.");
    }

    return NextResponse.json({ message: "Module update", updatedModule });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
