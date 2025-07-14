import { connect } from "@/db/dbConfig";
import TestCase from "@/models/TestCase";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  try {
    const formData = await req.formData();
    console.log("Request Body:", formData);

    const { _id } = params;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const attachment = formData.get("attachment") as File | null;
    const tested_by = formData.get("tested_by") as string;
    const serial_no = formData.get("serial_no") as string;
    const scenario = formData.get("scenario") as string;
    const precondition = formData.get("precondition") as string;
    const steps = formData.get("steps") as string;
    const data = formData.get("data") as string;
    const expected_result = formData.get("expected_result") as string;
    const actual_result = formData.get("actual_result") as string;
    const defect_id = formData.get("defect_id") as string;
    const bug_severity = formData.get("bug_severity") as string;
    const bug_priority = formData.get("bug_priority") as string;
    const comments = formData.get("comments") as string;

    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket ID format" },
        { status: 400 }
      );
    }
    const ticketExists = await Ticket.findById(_id);
    if (!ticketExists) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    let attachmentBuffer = null;

    if (attachment) {
      try {
        const arrayBuffer = await attachment.arrayBuffer();
        attachmentBuffer = Buffer.from(arrayBuffer);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "Error processing attachment" },
          { status: 400 }
        );
      }
    }

    const newTestCase = new TestCase({
      title,
      description,
      status,
      attachment: attachmentBuffer,
      ticketId: _id,
      tested_by,
      serial_no,
      scenario,
      precondition,
      steps,
      data,
      expected_result,
      actual_result,
      defect_id,
      bug_severity,
      bug_priority,
      comments,
    });
    const savedTestCase = await newTestCase.save();

    return NextResponse.json({
      message: "Test Case Created",
      success: true,
      testCase: savedTestCase,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
