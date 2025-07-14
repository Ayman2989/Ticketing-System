import { connect } from "@/db/dbConfig";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;

  console.log(_id);

  // Validate ID format
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    // Parse request body
    const { selectedUser } = await req.json();

    // Find the existing ticket
    const ticket = await Ticket.findById(_id);
    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Store the previous assigned user
    const previousAssignedUser = ticket.assigned_to;

    // Update ticket
    ticket.previous_assigned_user = previousAssignedUser;
    ticket.assigned_to = selectedUser;

    await ticket.save();

    return NextResponse.json({
      success: true,
      message: "Ticket transferred successfully",
      updatedTicket: ticket,
    });
  } catch (error) {
    console.error("Error transferring ticket:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
