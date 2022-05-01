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
        response.userId = data._userId;
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
          quality: "auto:low",
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

  if (body.username) {
    try {
      let phoneNumberExists = await User.exists({
        $and: [{ phoneNumber: body.phoneNumber }, { _id: { $ne: id } }],
      }).exec();

      if (phoneNumberExists) {
        response = {
          success: false,
          field: "phoneNumber",
          exists: true,
          message: "the phone number is already in use by others",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (body.email) {
    try {
      let emailExists = await User.exists({
        $and: [{ email: body.email }, { _id: { $ne: id } }],
      }).exec();

      if (emailExists) {
        response = {
          success: false,
          field: "email",
          exists: true,
          message: "the email is already in use by others",
        };

        return response;
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (body.password) {
    try {
      const data = await User.findById(id).select("password").exec();
      const passwordMatch = await compare(body.password, data.password);
      if (!passwordMatch) {
        response = {
          success: false,
          field: "password",
          match: false,
          message: "wrong password",
        };

        return response;
      } else {
        body.password = await hash(body.newPassword, 10);
        delete body.newPassword;
      }
    } catch (err) {
      console.log(err);
    }
  }

  try {
    let newImage = "";
    let userChanges = null;
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
      userChanges = await User.findByIdAndUpdate(
        id,
        {
          ...body,
          image: newImage,
        },
        { new: true }
      )
        .select([
          "phoneNumber",
          "email",
          "fullname",
          "firstname",
          "lastname",
          "address",
          "image",
        ])
        .exec();
    } else {
      userChanges = await User.findByIdAndUpdate(
        id,
        {
          ...body,
        },
        { new: true }
      )
        .select([
          "phoneNumber",
          "email",
          "fullname",
          "firstname",
          "lastname",
          "address",
          "image",
        ])
        .exec();
    }

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
  let response = {
    success: false,
    userData: {},
  };

  let data = null;

  try {
    data = await User.findById(id)
      .select([
        "phoneNumber",
        "email",
        "fullname",
        "firstname",
        "lastname",
        "address",
        "image",
      ])
      .exec();
  } catch (err) {
    console.log(err);
  }

  if (data) {
    response.success = true;
    response.userData = data;
  }

  return response;
}
