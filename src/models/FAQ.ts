import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  attachment: { type: Buffer },
});

export default mongoose.models.FAQSchema ||
  mongoose.model("FAQSchema", FAQSchema);
