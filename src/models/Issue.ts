import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
  issue: { type: String, required: true, unique: true },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
});

export default mongoose.models.Issue || mongoose.model("Issue", IssueSchema);
