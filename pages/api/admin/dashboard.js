import mongoose from "mongoose";
import dbConnect from "../../../lib/database";
import Phone from "../../../lib/models/phone-model";
import Order from "../../../lib/models/order-model";
import User from "../../../lib/models/user-model";
import Brand from "../../../lib/models/brand-model";

export default async function handler(req, res) {
  await dbConnect();
  let response = {};

  if (req.method !== "GET") {
    return res.status(405).json({ mesasge: "method not allowed" });
  }

  response.phoneCount = await Phone.countDocuments({}).exec();
  response.orderCount = await Order.countDocuments({
    status: "pending",
  }).exec();
  response.userCount = await User.countDocuments({ role: "client" }).exec();
  response.brandCount = await Brand.countDocuments({}).exec();

  res.status(200).json(response);
}
