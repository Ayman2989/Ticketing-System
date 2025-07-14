import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    activeTime: { type: Number, required: true }, // in seconds
    idleTime: { type: Number, required: true }, // in seconds
    date: { type: String, required: true }, // YYYY-MM-DD
    attachment: [{ type: Buffer, required: false }], // array of buffers
    visit: [{ type: String, required: false }], // array of strings
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
