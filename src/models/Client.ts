import mongoose from "mongoose";
import ClientType from "./ClientType"; // Import the ClientType model

const ClientSchema = new mongoose.Schema({
  client_id: { type: String, required: true, unique: true },
  client_name: { type: String, required: true },
  client_fullname: { type: String, required: true },

  client_type: {
    type: String,
    ref: "ClientType",
    validate: {
      validator: async function (value: string) {
        // Check if the provided client_type exists in the ClientType model
        const existingType = await ClientType.findOne({ client_name: value });
        return !!existingType; // Return true if it exists, false otherwise
      },
      message: (props: any) => `${props.value} is not a valid client type.`,
    },
  },
  email: { type: String, unique: true },
  contact: { type: Number },
  keam_code: { type: String },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },
});

export default mongoose.models.Client || mongoose.model("Client", ClientSchema);
