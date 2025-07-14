import mongoose from "mongoose";

const ClientTypeSchema = new mongoose.Schema({
  client_name: { type: String, required: true, unique: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", // Default to 'active' if no value is provided
    required: true,
  },
});

export default mongoose.models.ClientType ||
  mongoose.model("ClientType", ClientTypeSchema);
