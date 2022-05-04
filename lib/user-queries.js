import mongoose from "mongoose";
import { generate } from "text-to-image";
import dbConnect from "./database";
import User from "./models/user-model";
import { compare, hash } from "bcrypt";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function checkUser(emailOrPhone, password) {
  await dbConnect();
  let response = {
    userId: "",
    userExists: false,
    credentialsMatch: false,
    role: "",
  };
  try {
    const data = await User.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
    })
      .select(["phoneNumber", "email", "role", "password"])
      .exec();

    if (data) {
      response.userExists = true;
      if (await compare(password, data.password)) {
        response.userId = data._id;
        response.credentialsMatch = true;
        response.role = data.role;
      }
    }
  } catch (err) {
    console.log(err);
  }

  return response;
}

export async function addUser(body) {
  await dbConnect();
  let response = {
    success: false,
    userId: null,
    existing: {
      phoneNumber: false,
      email: false,
    },
  };

  try {
    const phoneNumberExists = await User.exists({
      phoneNumber: body.phoneNumber,
    }).exec();

    if (phoneNumberExists) {
      response.existing.phoneNumber = true;
    }
  } catch (err) {
    console.log("phoneNumber exists query", err);
  }

  try {
    const emailExists = await User.exists({
      email: body.email,
    }).exec();

    if (emailExists) {
      response.existing.email = true;
    }
  } catch (err) {
    console.log(err);
  }

  if (!response.existing.username && !response.existing.email) {
    try {
      let id = new mongoose.Types.ObjectId();
      let imageUrl = "";
      let imageId = "";
      let max = 256;
      let textColor = "";
      let red = Math.floor(Math.random() * max);
      let green = Math.floor(Math.random() * max);
      let blue = Math.floor(Math.random() * max);

      if (
        Math.sqrt(red ** 2 * 0.241 + green ** 2 * 0.691 + blue ** 2 * 0.068) >
        145
      ) {
        textColor = "black";
      } else {
        textColor = "white";
      }

      const initial_image = await generate(body.firstname.charAt(0), {
        bgColor: `rgb(${red} ${green} ${blue})`,
        textColor,
        textAlign: "center",
        maxWidth: 100,
        customHeight: 100,
        verticalAlign: "center",
        fontSize: 48,
      });

      await cloudinary.uploader
        .upload(initial_image, {
          folder: `emphoneum/users/${id}`,
          quality: "auto:good",
        })
        .then((result) => {
          imageId = result.public_id;
          imageUrl = result.url;
        })
        .catch((err) => {
          console.log("Error in cloudinary", err);
        });

      const newUser = new User({
        _id: id,
        firstname: body.firstname,
        lastname: body.lastname,
        phoneNumber: body.phoneNumber,
        email: body.email,
        address: body.address,
        password: body.password,
        role: "client",
        image: { id: imageId, url: imageUrl },
      });

      await newUser.save();
      response.userId = newUser._id;
      response.success = true;
    } catch (err) {
      console.log(err);
    }
  }
  return response;
}

export async function updateUserInfo(id, body) {
  await dbConnect();
  let response = {};

  if (body.toUpdate == "basicInfo") {
    try {
      if (body.data.phoneNumber) {
        let phoneNumberExists = await User.exists({
          $and: [{ phoneNumber: body.data.phoneNumber }, { _id: { $ne: id } }],
        }).exec();

        if (phoneNumberExists) {
          response = {
            success: false,
            field: "phoneNumber",
            exists: true,
            message: "the phone number is already in use",
          };

          return response;
        }
      }

      if (body.data.email) {
        let emailExists = await User.exists({
          $and: [{ email: body.data.email }, { _id: { $ne: id } }],
        }).exec();

        if (emailExists) {
          response = {
            success: false,
            field: "email",
            exists: true,
            message: "the email is already in use",
          };

          return response;
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else if (body.toUpdate == "password") {
    try {
      const { password } = await User.findById(id).select("password").exec();
      console.log(password, body.data.password, body.data.newPassword);
      if (!(await compare(body.data.password, password))) {
        response = {
          success: false,
          field: "password",
          match: false,
          message: "wrong password",
        };

        return response;
      } else {
        body.data.password = await hash(body.data.newPassword, 10);
        delete body.data.newPassword;
      }
    } catch (err) {
      console.log(err);
    }
  } else if (body.toUpdate == "image") {
    let newImage = "";
    await cloudinary.uploader
      .upload(body.data.image.url, {
        quality: "auto:good",
        public_id: body.data.image.id,
      })
      .then((result) => {
        newImage = { id: body.data.image.id, url: result.url };
      })
      .catch((error) => {
        console.log(error);
      });
    body.data.image = newImage;
  }

  try {
    let userChanges = null;
    userChanges = await User.findByIdAndUpdate(
      id,
      {
        ...body.data,
      },
      { new: true }
    )
      .select(
        Object.keys(body.data).filter(
          (key) => key !== "password" || key !== "newPassword"
        )
      )
      .exec();

    response = {
      success: true,
      updatedInfo: userChanges,
    };

    // console.log(response);

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getWishlist(id) {
  await dbConnect();
  let response = {
    wishlist: [],
  };

  try {
    response.wishlist = await User.findById(id)
      .select("wishlist")
      .populate("wishlist")
      .exec();
  } catch (err) {
    console.log(err);
  }
}

export async function getUserBasicInfo(id) {
  await dbConnect();
  let response = {};

  let data = null;

  try {
    data = await User.findById(id)
      .select(["-wishlist", "-password", "-orders"])
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (data) {
    response = data;
  }

  return response;
}

export async function getAllUsers(role) {
  await dbConnect();
  let result = {};

  try {
    let users = await User.find({ role })
      .select("image firstname lastname email phoneNumber address")
      .exec();
    result.users = users;
  } catch (err) {
    console.log(err);
  }

  return result;
}
