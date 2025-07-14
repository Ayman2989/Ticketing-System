import { connect } from "@/db/dbConfig";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;

  // Validate the ID (check if it's a valid MongoDB ObjectId format)
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
  try {
    const ticket = await Ticket.findById(_id);
    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "ticet not found" },
        { status: 404 }
      );
    }

    // Return the entire client and its name separately
    return NextResponse.json({
      success: true,
      name: ticket.title, // used for the breadcrumbs
      ticket, // Includes the entire client object
    });
  } catch (error: any) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
};
