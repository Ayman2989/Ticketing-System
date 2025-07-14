import { connect } from "@/db/dbConfig"; // Your database configuration file
import Ticket from "@/models/Ticket";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connect();

// Delete Ticket API
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  const { _id } = params;

  // Validate the ID format (ObjectId for MongoDB)
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ticket ID format" },
      { status: 400 }
    );
  }

  try {
    // Find and delete the ticket
    const oldUser = await User.findById(_id);
    const oldUserName = oldUser.employee_name;
    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    const updatedTicket = await Ticket.updateMany(
      {
        $or: [{ assigned_to: oldUserName }, { coordinator: oldUserName }],
      },
      {
        $set: {
          assigned_to: oldUserName + "(Deleted User)",
          coordinator: oldUserName + "(Deleted User)",
        },
      }
    );
    if (updatedTicket.matchedCount === 0) {
      console.warn("No related users found to update.");
    }
    return NextResponse.json(
      { success: true, message: "Ticket deleted successfully", deletedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the ticket",
      },
      { status: 500 }
    );
  }
};
