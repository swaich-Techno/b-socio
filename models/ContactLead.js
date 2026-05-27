import mongoose from "mongoose";

const ContactLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    businessName: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    serviceRequired: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    source: { type: String, default: "bsocio.in" }
  },
  { timestamps: true }
);

export default mongoose.models.ContactLead || mongoose.model("ContactLead", ContactLeadSchema);
