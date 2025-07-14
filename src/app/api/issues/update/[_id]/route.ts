import { connect } from "@/db/dbConfig";
import Issue from "@/models/Issue";
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
    const { issue, status } = await req.json();

    const oldIssue = await Issue.findById(_id);

    if (!oldIssue) {
      NextResponse.json(
        { success: false, message: "issue not found" },
        { status: 404 }
      );
    }

    const oldIssueName = oldIssue.issue;

    const updatedIssue = await Issue.findByIdAndUpdate(
      _id,
      { issue, status },
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json({ message: "item not found" });
    }

    const updatedTicket = await Ticket.updateMany(
      { issue_type: oldIssueName },
      { $set: { issue_type: issue } }
    );

    if (updatedTicket.matchedCount === 0) {
      console.warn("No related clients found to update.");
    }

    return NextResponse.json({ message: "Issue update", updatedIssue });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }
};
