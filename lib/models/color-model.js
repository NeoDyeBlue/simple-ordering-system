import mongoose from "mongoose";

const colorSchema = mongoose.Schema({
  phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
  name: { type: String, required: true, trim: true },
  hexValue: { type: String, required: true, trim: true },
});

export default mongoose.models.Color || mongoose.model("Color", colorSchema);
