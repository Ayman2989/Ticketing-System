import { connect } from "@/db/dbConfig";
import Client from "@/models/Client";
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
    const {
      client_id,
      client_name,
      client_fullname,
      client_type,
      email,
      contact,
      keam_code,
      status,
    } = await req.json();

    const oldClient = await Client.findById(_id);

    if (!oldClient) {
      return NextResponse.json(
        { success: false, message: "ClientType not found" },
        { status: 404 }
      );
    }

    const oldClientName = oldClient.client_name;

    const updatedClient = await Client.findByIdAndUpdate(
      _id,
      {
        client_id,
        client_name,
        client_fullname,
        client_type,
        email,
        contact,
        keam_code,
        status,
      },
      { new: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ message: "item not found" });
    }

    const updatedTicket = await Ticket.updateMany(
      { client: oldClientName },
      { $set: { client: client_name } }
    );

    if (updatedTicket.matchedCount === 0) {
      console.warn("No related clients found to update.");
    }

    return NextResponse.json({ message: "ticket update", updatedClient });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
