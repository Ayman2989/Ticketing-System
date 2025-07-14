import { connect } from "@/db/dbConfig";
import TestCase from "@/models/TestCase";
import { NextRequest, NextResponse } from "next/server";

connect();

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: string; test_case_id: string } }
) => {
  try {
    const { _id, test_case_id } = params;

    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ticket ID format" },
        { status: 400 }
      );
    }
    if (!/^[0-9a-fA-F]{24}$/.test(test_case_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid test case ID format" },
        { status: 400 }
      );
    }

    // Parse formData (Same as in `POST`)
    const formData = await req.formData();
    console.log("Update Request Body:", formData);

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

    // Construct the update object
    const updateData: any = {};

    const assignIfValid = (key: string, value: FormDataEntryValue | null) => {
      if (value !== null && value !== undefined && value !== "") {
        updateData[key] = value;
      }
    };

    assignIfValid("title", title);
    assignIfValid("description", description);
    assignIfValid("status", status);
    assignIfValid("tested_by", tested_by);
    assignIfValid("serial_no", serial_no);
    assignIfValid("scenario", scenario);
    assignIfValid("precondition", precondition);
    assignIfValid("steps", steps);
    assignIfValid("data", data);
    assignIfValid("expected_result", expected_result);
    assignIfValid("actual_result", actual_result);
    assignIfValid("defect_id", defect_id);
    assignIfValid("bug_severity", bug_severity);
    assignIfValid("bug_priority", bug_priority);
    assignIfValid("comments", comments);

    if (attachmentBuffer) {
      updateData.attachment = attachmentBuffer;
    }

    // Update test case
    const updatedTestCase = await TestCase.findByIdAndUpdate(
      test_case_id,
      updateData,
      { new: true } // Return updated document
    );

    if (!updatedTestCase) {
      return NextResponse.json(
        { success: false, message: "Test case not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Test case updated successfully",
        updatedTestCase,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
