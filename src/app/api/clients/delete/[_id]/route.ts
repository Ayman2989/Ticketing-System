import { connect } from "@/db/dbConfig"; // Your database configuration file
import Ticket from "@/models/Ticket";
import Client from "@/models/Client";
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
    const oldClient = await Client.findById(_id);
    const oldClientName = oldClient.client_name;
    const deletedClient = await Client.findByIdAndDelete(_id);

    if (!deletedClient) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    const updatedTicket = await Ticket.updateMany(
      {
        $or: [{ client: oldClientName }],
      },
      {
        $set: {
          client: oldClientName + "(Deleted Client)",
        },
      }
    );
    if (updatedTicket.matchedCount === 0) {
      console.warn("No related users found to update.");
    }
    return NextResponse.json(
      { success: true, message: "Ticket deleted successfully", deletedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the Client",
      },
      { status: 500 }
    );
  }
};
