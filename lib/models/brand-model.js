import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  {
    collation: { locale: "en", strength: 2 },
  }
);

export default mongoose.models.Brand || mongoose.model("Brand", brandSchema);
