import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
    storage: { type: mongoose.Schema.Types.ObjectId, ref: "Storage" },
    color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
