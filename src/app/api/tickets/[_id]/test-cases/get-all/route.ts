import { connect } from "@/db/dbConfig";
import TestCase from "@/models/TestCase";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  try {
    const { _id } = params;

    // Validate the ticket ID format
    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket ID format" },
        { status: 400 }
      );
    }

    // Check if the ticket exists
    const ticketExists = await Ticket.findById(_id);
    if (!ticketExists) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Find all test cases related to the ticket ID
    const testCases = await TestCase.find({ ticketId: _id });

    return NextResponse.json({
      success: true,
      message: "Test cases fetched successfully",
      testCases,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
