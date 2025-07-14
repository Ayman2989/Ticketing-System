import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig"; // Assuming you have a db connection utility
import Client from "@/models/Client"; // Assuming you have a Client model

connect(); // Connect to your database

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  // Validate the ID (check if it's a valid MongoDB ObjectId format)
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    // Fetch the client from the database
    const client = await Client.findById(_id);

    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    // Return the entire client and its name separately
    return NextResponse.json({
      success: true,
      name: client.client_name, // used for the breadcrumbs
      client, // Includes the entire client object
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
