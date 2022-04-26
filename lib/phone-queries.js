import mongoose from "mongoose";
import dbConnect from "./database";
import Phone from "./models/phone-model";
import Brand from "./models/brand-model";
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
      .populate({ path: "brand", model: Brand })
      .exec();
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function addPhone(body) {
  await dbConnect();
  let response = {
    success: false,
    exists: false,
    phone: null,
  };

  try {
    const phoneExists = await Phone.exists({
      name: body.modelName,
    }).exec();

    if (phoneExists) {
      response.exists = true;
    }
  } catch (err) {
    console.log("phone exists query", err);
  }

  if (!response.exists) {
    try {
      let id = new mongoose.Types.ObjectId();
      let imageUrl = "";
      let imageId = "";

      await cloudinary.uploader
        .upload(body.image, {
          folder: `emphoneum/phone/${id}`,
          quality: "auto:low",
        })
        .then((result) => {
          imageId = result.public_id;
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log("Error in cloudinary", err);
        });

      const newPhone = await new Phone({
        _id: id,
        name: body.modelName,
        brand: body.brand,
        image: { id: imageId, url: imageUrl },
        variations: [...body.variations],
        colors: [...body.colors],
        specs: {
          operatingSystem: body.os,
          screenSize: {
            inches: body.screenSizeInches,
            resolution: body.screenResolution,
          },
          battery: {
            capacity: body.batteryCapacity,
            type: body.batteryType,
          },
          camera: {
            main: body.cameraMain,
            resolution: body.cameraResolution,
          },
          chipset: body.chipset,
          cpu: body.cpu,
          gpu: body.gpu,
          usb: body.usb,
          cardSlot: body.cardSlot,
          sensors: body.sensors,
          network: body.network,
        },
      }).populate("brand");

      await newPhone.save();
      response.phone = newPhone;
      response.success = true;
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}
