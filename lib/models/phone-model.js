import mongoose from "mongoose";

const phoneSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    storages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Storage" }],
    colors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Colors" }],
    quantities: [
      {
        storage: { type: mongoose.Schema.Types.ObjectId, ref: "Storage" },
        color: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
        quantity: { type: Number, required: true, default: 0 },
      },
    ],
    specs: {
      operatingSystem: { type: String, required: true, trim: true },
      screenSize: {
        inches: { type: Number, required: true, trim: true },
        dimensions: { type: String, required: true, trim: true },
      },
      battery: {
        capacity: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
      },
      camera: {
        main: { type: String, required: true, trim: true },
        resolution: { type: String, required: true, trim: true },
        mainAndRear: { type: String, required: true, trim: true },
      },
      chipset: { type: String, required: true, trim: true },
      cpu: { type: String, required: true, trim: true },
      gpu: { type: String, required: true, trim: true },
      cardSlot: { type: String, required: true, trim: true },
      usb: { type: String, required: true, trim: true },
      sensors: { type: String, required: true, trim: true },
      network: { type: String, required: true, trim: true },
    },
    images: [
      {
        forColor: { type: mongoose.Schema.Types.ObjectId, ref: "Color" },
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    collation: { locale: "en", strength: 2 },
  }
);

export default mongoose.models.Phone || mongoose.model("Phone", phoneSchema);
