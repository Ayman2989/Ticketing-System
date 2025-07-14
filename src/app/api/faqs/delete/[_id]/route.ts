import { connect } from "@/db/dbConfig";
import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

connect();

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  try {
    const { _id } = params;

    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return {
        status: 400,
        json: { success: false, message: "Invalid FAQ ID format" },
      };
    }
    const deletedFAQ = await FAQ.findByIdAndDelete(_id);

    if (!deletedFAQ) {
      return {
        status: 404,
        json: { success: false, message: "FAQ not found" },
      };
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete FAQ",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
