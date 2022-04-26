import mongoose from "mongoose";
import dbConnect from "./database";
import Brand from "./models/brand-model";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function addBrand(body) {
  await dbConnect();
  let response = {
    success: false,
    exists: false,
    brand: null,
  };

  try {
    const brandExists = await Brand.exists({
      name: body.brandName,
    }).exec();

    if (brandExists) {
      response.exists = true;
    }
  } catch (err) {
    console.log("brand exists query", err);
  }

  if (!response.exists) {
    try {
      let id = new mongoose.Types.ObjectId();
      let imageUrl = "";
      let imageId = "";

      await cloudinary.uploader
        .upload(body.image, {
          folder: `emphoneum/brand/${id}`,
          quality: "auto:low",
        })
        .then((result) => {
          imageId = result.public_id;
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log("Error in cloudinary", err);
        });

      const newBrand = new Brand({
        _id: id,
        name: body.brandName,
        image: { id: imageId, url: imageUrl },
      });

      await newBrand.save();
      response.brand = newBrand;
      response.success = true;
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}

export async function getBrand(id) {
  let response = {};

  try {
    const brand = await Brand.findById(id);
    response.brand = brand;
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function updateBrand(id, body) {
  await dbConnect();
  let response = {};

  if (body.brandName) {
    try {
      let brandNameExists = await Brand.exists({
        $and: [{ name: body.brandName }, { _id: { $ne: id } }],
      }).exec();

      if (brandNameExists) {
        response = {
          success: false,
          exists: true,
          message: "brand name already exists",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  try {
    let newImage = "";
    let brandChanges = null;
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
      brandChanges = await Brand.findByIdAndUpdate(
        id,
        {
          name: body.brandName,
          image: newImage,
        },
        { new: true }
      ).exec();
    } else {
      brandChanges = await Brand.findByIdAndUpdate(
        id,
        {
          name: body.brandName,
        },
        { new: true }
      ).exec();
    }

    response = {
      success: true,
      brand: brandChanges,
    };

    // console.log(response);

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteBrand(id, body) {
  await dbConnect();
  let response = {};
  try {
    await cloudinary.uploader.destroy(body.id).then((result) => {
      response.deletedImage = result;
      cloudinary.api
        .delete_folder(`emphoneum/brand/${id}`)
        .then((result) => {
          response.deletedImageFolder = result;
        })
        .catch((error) => {
          console.log(error);
        });
    });
    await Brand.findByIdAndDelete(id);
    response.deleted = true;
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function getAllBrands() {
  await dbConnect();
  let response = {
    brands: null,
  };

  try {
    response.brands = await Brand.find({}).sort({ createdAt: -1 }).exec();
  } catch (err) {
    console.log(err);
  }

  return response;
}
