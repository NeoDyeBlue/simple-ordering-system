import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ["admin", "client"],
    },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    password: { type: String, required: true, trim: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Phone" }],
    cart: [
      {
        phone: { type: mongoose.Schema.Types.ObjectId, ref: "Phone" },
        variation: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Phone.variations",
        },
        color: { type: mongoose.Schema.Types.ObjectId, ref: "Phone.colors" },
      },
    ],
  },
  {
    timestamps: true,
    getters: true,
    virtuals: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
    collation: { locale: "en", strength: 2 },
  }
);

userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

export default mongoose.models.User || mongoose.model("User", userSchema);
