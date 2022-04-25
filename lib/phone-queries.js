import mongoose from "mongoose";
import dbConnect from "./database";
import Phone from "./models/phone-model";
import Brand from "./models/brand-model";
import Storage from "./models/storage-model";
import Color from "./models/color-model";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getAllPhones() {
  await dbConnect();
  let response = {
    phones: [],
  };

  try {
    response.phones = await Phone.find({})
      .populate({ path: "storages", match: {} })
      .populate("colors")
      .populate("quantities.storage")
      .exec();
  } catch (err) {
    console.log(err);
  }
}
