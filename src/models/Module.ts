import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
  module_name: { type: String, required: true, unique: true },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
});

export default mongoose.models.Module || mongoose.model("Module", ModuleSchema);
