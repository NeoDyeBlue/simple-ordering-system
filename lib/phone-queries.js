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

export async function getAllPhones(_query, _options) {
  await dbConnect();
  let response = {
    brand: "all",
    phones: [],
  };

  function formatter(data) {
    console.log(data);
    let dataSplit = data.split(",");
    let entries = dataSplit.map((data) => data.split("_"));
    let formattedValue = null;
    let result = entries.map(([key, value]) => {
      if (value.includes("~")) {
        formattedValue = value.split("~");
        if (key == "createdAt" || key == "updatedAt") {
          return [
            key,
            {
              [formattedValue[0]]: new Date(Number(formattedValue[1])),
            },
          ];
        }
        return [
          key,
          {
            [formattedValue[0]]: isNan(formattedValue[1])
              ? formattedValue[1]
              : Number(formattedValue[1]),
          },
        ];
      }

      return [key, value];
    });

    return result;
  }

  const query = {
    ...(_query ? Object.fromEntries(formatter(_query)) : {}),
  };

  const options = {
    ...(_options ? Object.fromEntries(formatter(_options)) : {}),
    // select: "name image variations",
    populate: {
      path: "brand",
      select: "name",
      model: Brand,
    },
  };

  // console.log(query, options);

  try {
    if (!query.brand || query.brand == "all") {
      delete query.brand;
      const result = await Phone.paginate(query, options);
      response.phones = result.docs;
    } else {
      const brandItem = await Brand.findOne({ name: query.brand })
        .select("name")
        .exec();
      if (brandItem) {
        response.brand = brandItem.name;
        const result = await Phone.paginate(
          { ...query, brand: brandItem._id },
          options
        );
        response.phones = result.docs;
      }
    }
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
      }).populate({ path: "brand", select: "name", model: Brand });

      await newPhone.save();
      response.phone = newPhone;
      response.success = true;
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}

export async function updatePhone(id, body) {
  await dbConnect();
  let response = {};

  if (body.modelName) {
    try {
      let modelNameExists = await Phone.exists({
        $and: [{ name: body.modelName }, { _id: { $ne: id } }],
      }).exec();

      if (modelNameExists) {
        response = {
          success: false,
          exists: true,
          message: "model name already exists",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  try {
    let newImage = "";
    let phoneChanges = null;
    if (body.image) {
      await cloudinary.uploader
        .upload(body.image.url, {
          quality: "auto:low",
          public_id: body.image.id,
        })
        .then((result) => {
          newImage = { id: body.image.id, url: result.url };
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (newImage) {
      phoneChanges = await Phone.findByIdAndUpdate(
        id,
        {
          name: body.modelName,
          brand: body.brand,
          image: newImage,
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
        },
        { new: true }
      )
        .populate({ path: "brand", select: "name", model: Brand })
        .exec();
    } else {
      phoneChanges = await Phone.findByIdAndUpdate(
        id,
        {
          name: body.modelName,
          brand: body.brand,
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
        },
        { new: true }
      )
        .populate({ path: "brand", select: "name", model: Brand })
        .exec();
    }

    response = {
      success: true,
      phone: phoneChanges,
    };

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllPhonesByBrand(brandName) {
  await dbConnect();
  let response = {
    brand: "",
    phones: [],
  };
  let brandItem = null;

  try {
    brandItem = await Brand.findOne({ name: brandName }).select("name").exec();
    response.brand = brandItem.name;
    response.phones = await Phone.find({ brand: brandItem._id })
      .select("name image variations")
      .exec();
  } catch (err) {
    console.log(err);
  }
  return response;
}

export async function getPhone(id) {
  let response = {};

  try {
    const phone = await Phone.findById(id);
    response.phone = phone;
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function deletePhone(id, body) {
  await dbConnect();
  let response = {};
  try {
    await cloudinary.uploader.destroy(body.id).then((result) => {
      response.deletedImage = result;
      cloudinary.api
        .delete_folder(`emphoneum/phone/${id}`)
        .then((result) => {
          response.deletedImageFolder = result;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    await Phone.findByIdAndDelete(id);
    response.deleted = true;
  } catch (err) {
    console.log(err);
  }

  return response;
}
