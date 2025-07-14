import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const TestCaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ticketId: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["Failed", "Passed"],
    default: "Failed",
  },
  attachment: { type: Buffer },
  tested_by: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingTester = await mongoose
          .model("User")
          .findOne({ employee_name: value });
        return !!existingTester;
      },
    },
  },
  serial_no: {
    type: String,
    required: true,
    unique: true,
  },
  scenario: {
    type: String,
  },
  precondition: {
    type: String,
  },
  steps: {
    type: String,
  },
  data: {
    type: String,
  },
  expected_result: {
    type: String,
  },
  actual_result: {
    type: String,
  },
  defect_id: {
    type: String,
  },
  bug_severity: {
    type: String,
  },
  bug_priority: {
    type: String,
  },
  comments: {
    type: String,
  },
});

export default mongoose.models.TestCase ||
  mongoose.model("TestCase", TestCaseSchema);
