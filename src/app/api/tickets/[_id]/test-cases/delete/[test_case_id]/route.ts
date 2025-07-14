import { connect } from "@/db/dbConfig";
import TestCase from "@/models/TestCase";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { _id: string; test_case_id: string } }
) => {
  const { _id, test_case_id } = params;
  if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ticket ID format" },
      { status: 400 }
    );
  }
  if (!/^[0-9a-fA-F]{24}$/.test(test_case_id)) {
    return NextResponse.json(
      { success: false, message: "Invalid testcase ID format" },
      { status: 400 }
    );
  }
  try {
    const deletedTestCase = await TestCase.findByIdAndDelete(test_case_id);
    if (!deletedTestCase) {
      return NextResponse.json(
        { success: false, message: "Test case not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Test case deleted successfully",
        deletedTestCase,
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
