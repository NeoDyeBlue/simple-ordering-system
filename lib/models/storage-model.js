import mongoose from "mongoose";

const storageSchema = mongoose.Schema({
  phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
  storage: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
});

export default mongoose.models.Storage ||
  mongoose.model("Storage", storageSchema);
