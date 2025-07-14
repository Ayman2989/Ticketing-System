import { connect } from "@/db/dbConfig";
import Client from "@/models/Client";
import ClientType from "@/models/ClientType";
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
    const { client_name, description, status } = await req.json();

    // Fetch the old ClientType to get the old client_name
    const oldClientType = await ClientType.findById(_id);
    if (!oldClientType) {
      return NextResponse.json(
        { success: false, message: "ClientType not found" },
        { status: 404 }
      );
    }

    const oldClientName = oldClientType.client_name;

    const updatedClientType = await ClientType.findByIdAndUpdate(
      _id,
      { client_name, description, status },
      { new: true }
    );

    if (!updatedClientType) {
      return NextResponse.json({ message: "item not found" });
    }

    const updateResult = await Client.updateMany(
      { client_type: oldClientName }, // Match old client_name
      { $set: { client_type: client_name } } // Update to the new client_name
    );

    console.log("Update Result:", updateResult);

    if (updateResult.matchedCount === 0) {
      console.warn("No related clients found to update.");
    }

    return NextResponse.json({
      success: true,
      message: "ClientType and related Clients updated successfully",
      updatedClientType,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
