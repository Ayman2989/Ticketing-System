import { connect } from "@/db/dbConfig"; // Your database configuration file
import ClientType from "@/models/ClientType";
import { NextRequest, NextResponse } from "next/server";
import Client from "@/models/Client";

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
    const oldClientType = await ClientType.findById(_id);
    const oldClientTypeName = oldClientType.client_name;
    const deletedClientType = await ClientType.findByIdAndDelete(_id);

    if (!deletedClientType) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    const updatedClient = await Client.updateMany(
      { client_type: oldClientTypeName },
      { $set: { client_type: oldClientTypeName + " (Deleted Client Type)" } }
    );
    if (updatedClient.matchedCount === 0) {
      console.warn("No related users found to update.");
    }
    return NextResponse.json(
      {
        success: true,
        message: "Ticket deleted successfully",
        deletedClientType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the ClientType",
      },
      { status: 500 }
    );
  }
};
