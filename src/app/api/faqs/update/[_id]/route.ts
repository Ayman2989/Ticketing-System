import { connect } from "@/db/dbConfig";
import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { _id: string } }
) => {
  try {
    await connect(); // Ensure DB connection

    const { _id } = params;

    // Validate MongoDB ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(_id)) {
      return NextResponse.json(
        { success: false, message: "Invalid FAQ ID format" },
        { status: 400 }
      );
    }

    // Parse formData
    const formData = await req.formData();
    console.log("Update Request Body:", formData);

    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const attachment = formData.get("attachment") as File | null;

    // Get the existing FAQ
    const existingFAQ = await FAQ.findById(_id);
    if (!existingFAQ) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    let attachmentBuffer = existingFAQ.attachment; // Keep old attachment if no new one is provided

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
    const updateData: any = { question, answer };
    if (attachmentBuffer) {
      updateData.attachment = attachmentBuffer;
    }

    // Update FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(_id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Ensure validation
    });

    if (!updatedFAQ) {
      return NextResponse.json(
        { success: false, message: "FAQ update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFAQ,
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
