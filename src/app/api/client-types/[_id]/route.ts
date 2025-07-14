import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig"; // Assuming you have a db connection utility
import ClientType from "@/models/ClientType"; // Assuming you have a Client model

connect(); // Connect to your database

export async function GET(
  req: NextRequest,
  { params }: { params: { _id: string } }
) {
  // const role = req.cookies.get("role");
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
    const clientType = await ClientType.findById(_id);

    if (!clientType) {
      return NextResponse.json(
        { success: false, message: "Client-type not found" },
        { status: 404 }
      );
    }

    // Return the entire client and its name separately
    return NextResponse.json({
      success: true,
      name: clientType.client_name, // used for the breadcrumbs
      clientType, // Includes the entire client object
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
