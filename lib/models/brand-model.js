import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  {
    collation: { locale: "en", strength: 2 },
    timestamps: true,
  }
);

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
