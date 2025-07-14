import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    project_name: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
