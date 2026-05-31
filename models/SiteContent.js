import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    hero: { type: mongoose.Schema.Types.Mixed, default: {} },
    images: { type: mongoose.Schema.Types.Mixed, default: {} },
    contact: { type: mongoose.Schema.Types.Mixed, default: {} },
    cta: { type: mongoose.Schema.Types.Mixed, default: {} },
    homeServices: { type: [mongoose.Schema.Types.Mixed], default: [] },
    services: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);
