import { connect } from "@/db/dbConfig";
import FAQ from "@/models/FAQ";
import { NextResponse } from "next/server";

connect();

export const GET = async () => {
  try {
    const faqs = await FAQ.find();

    // Convert each FAQ attachment to Base64 if it exists
    const formattedFaqs = faqs.map((faq) => ({
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
      attachment: faq.attachment
        ? `data:image/jpeg;base64,${faq.attachment.toString("base64")}`
        : null,
      createdAt: faq.createdAt,
    }));

    return NextResponse.json({
      success: true,
      message: "FAQs fetched successfully",
      FAQS: formattedFaqs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
