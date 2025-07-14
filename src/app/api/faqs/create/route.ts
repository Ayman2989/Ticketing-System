import { connect } from "@/db/dbConfig";
import FAQ from "@/models/FAQ";
import { NextRequest, NextResponse } from "next/server";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    const attachment = formData.get("attachment") as File | null;

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

    // ✅ Ensure we always create the FAQ, even if there's no attachment
    const newFAQ = new FAQ({
      question,
      answer,
      attachment: attachmentBuffer || null, // Store null if no attachment
    });

    const savedFAQ = await newFAQ.save();

    return NextResponse.json({
      message: "FAQ Created",
      success: true,
      FAQ: savedFAQ,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
};
