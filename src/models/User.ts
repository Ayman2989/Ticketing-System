import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  employee_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Admin", "Developer", "Tester", "Manager", "Client", "Support"],
  },
  contact_number: { type: Number, required: true },
  designation: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"] },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
