import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
    variation: {
      type: mongoose.Schema.Types.ObjectId
    },
    color: { type: mongoose.Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
