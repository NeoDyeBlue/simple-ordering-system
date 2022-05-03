import mongoose from "mongoose";
import dbConnect from "./database";
import Phone from "./models/phone-model";
import Brand from "./models/brand-model";
import Order from "./models/order-model";
import User from "./models/user-model";

export async function getAllOrders() {
  await dbConnect();
  let result = {
    success: false,
  };

  try {
    result.orders = await Order.find()
      .populate({
        path: "user",
        select: "firstname lastname email phoneNumber address",
        model: User,
      })
      .populate({
        path: "phone",
        select: "name brand variations colors",
        model: Phone,
      })
      .exec();

    result.orders = await Brand.populate(result.orders, {
      path: "phone.brand",
      select: "name",
    });

    result.success = true;
  } catch (err) {
    console.log(err);
  }

  return result;
}

export async function getOrders(userId) {
  await dbConnect();
  let result = {
    success: false,
  };

  try {
    result.orders = await Order.find({ user: userId }).populate({
      path: "phone",
      select: "image name variations colors",
    });
    result.success = true;
  } catch (err) {
    console.log(err);
  }

  return result;
}

export async function addOrder(userId, body) {
  let result = {
    success: false,
  };

  try {
    const newOrder = await new Order({
      user: userId,
      phone: body.phone,
      status: "pending",
      variation: body.variation,
      color: body.color,
    });
    //   .populate({ path: "variation", model: Phone })
    //   .populate({ path: "color", model: Phone });

    await newOrder.save();
    result.newOrder = newOrder;
    result.success = true;
  } catch (err) {
    console.log(err);
  }

  return result;
}
