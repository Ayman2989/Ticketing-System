import { connect } from "@/db/dbConfig";
import TestCase from "@/models/TestCase";
import Ticket from "@/models/Ticket";
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (
  req: NextRequest,
  { params }: { params: { _id: string; test_case_id: string } }
) => {
  try {
    const { _id, test_case_id } = params;

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

    // Find the test case by its ID and ticket ID
    const testCase = await TestCase.findOne({
      _id: test_case_id,
      ticketId: _id,
    });

    if (!testCase) {
      return NextResponse.json(
        { success: false, message: "Test case not found" },
        { status: 404 }
      );
    }

    let attachmentBase64 = null;
    if (testCase.attachment) {
      attachmentBase64 = `data:image/jpeg;base64,${testCase.attachment.toString(
        "base64"
      )}`;
    }

    return NextResponse.json({
      success: true,
      message: "Test case fetched successfully",
      testCase: {
        title: testCase.title,
        description: testCase.description,
        status: testCase.status,
        attachment: attachmentBase64, // Returning attachment as Base64
        tested_by: testCase.tested_by,
        serial_no: testCase.serial_no,
        scenario: testCase.scenario,
        precondition: testCase.precondition,
        steps: testCase.steps,
        data: testCase.data,
        expected_result: testCase.expected_result,
        actual_result: testCase.actual_result,
        defect_id: testCase.defect_id,
        bug_severity: testCase.bug_severity,
        bug_priority: testCase.bug_priority,
        comments: testCase.comments,
      },
      name: testCase.title,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
