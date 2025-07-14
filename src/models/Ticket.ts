import mongoose from "mongoose";
import Client from "./Client";
import Module from "./Module";
import Issue from "./Issue";
import Project from "./Project";
import User from "./User";

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingClient = await Client.findOne({ client_name: value });
        return !!existingClient;
      },
      message: (props: any) => `${props.value} is not a valid client.`,
    },
    required: true,
  },
  tags: { type: String },
  mode_of_ticket: {
    type: String,
    enum: ["Email", "Phone", "Whatsapp-Personal", "Whatsapp-Group"],
  },
  status: {
    type: String,
    enum: [
      "New",
      "Pending",
      "Testing",
      "Dropped",
      "Completed",
      "Not Required",
      "No Issue",
      "Not Started",
      "In Progress",
    ],
    default: "New",
  },
  module: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingModule = await Module.findOne({ module_name: value });
        return !!existingModule;
      },
      message: (props: any) => `${props.value} is not a valid module.`,
    },
  },
  issue_date: { type: Date, default: Date.now },
  priority: { type: String, enum: ["High", "Medium", "Low"] },
  issue_type: {
    type: String,

    validate: {
      validator: async function (value: string) {
        const existingIssue = await Issue.findOne({ issue: value });
        return !!existingIssue;
      },
      message: (props: any) => `${props.value} is not a valid issue.`,
    },
    required: true,
  },
  project: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingProject = await Project.findOne({ project_name: value });
        return !!existingProject;
      },
      message: (props: any) => `${props.value} is not a valid project`,
    },
  },
  assigned_to: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingUser = await User.findOne({ employee_name: value });
        return !!existingUser;
      },
      message: (props: any) => `${props.value} is not a valid user`,
    },
    required: true,
  },
  created_by: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingUser = await User.findOne({ employee_name: value });
        return !!existingUser;
      },
      message: (props: any) => `${props.value} is not a valid user`,
    },
    required: true,
  },
  remarks: { type: String },

  coordinator: {
    type: String,
    validate: {
      validator: async function (value: string) {
        const existingUser = await User.findOne({ employee_name: value });
        return !!existingUser;
      },
      message: (props: any) => `${props.value} is not a valid user`,
    },
    required: true,
  },
  point_of_contact: { type: String },
  client_contact_number: { type: Number },
  link: { type: String },
  completion_time: { type: String },
  expert_estimation: { type: String },
  dueDate: { type: Date },
  completed_date: { type: Date },
  ticket_description: { type: String },
  resolution_points: { type: String },
  previous_assigned_user: { type: String },
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
