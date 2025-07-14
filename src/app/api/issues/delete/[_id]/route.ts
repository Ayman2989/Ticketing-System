import { connect } from "@/db/dbConfig"; // Your database configuration file
import Ticket from "@/models/Ticket";
import Issue from "@/models/Issue";
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
    const oldIssue = await Issue.findById(_id);
    const oldIssueName = oldIssue.issue;
    const deletedIssue = await Issue.findByIdAndDelete(_id);

    if (!deletedIssue) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    const updatedTicket = await Ticket.updateMany(
      {
        $or: [{ assigned_to: oldIssueName }, { coordinator: oldIssueName }],
      },
      {
        $set: {
          assigned_to: oldIssueName + "(Deleted Issue)",
          coordinator: oldIssueName + "(Deleted Issue)",
        },
      }
    );
    if (updatedTicket.matchedCount === 0) {
      console.warn("No related users found to update.");
    }
    return NextResponse.json(
      { success: true, message: "Ticket deleted successfully", deletedIssue },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the Issue",
      },
      { status: 500 }
    );
  }
};
