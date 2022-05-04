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

export async function updateOrder(orderId, phoneId, variationId) {
  let result = {};

  try {
    const phone = await Phone.findById(phoneId)
      .select("variations name")
      .exec();
    // console.log(checkPhone);
    const orderVariation = phone.variations.find(
      (variation) => variation._id == variationId
    );
    if (orderVariation.quantity == 0) {
      const rom =
        orderVariation.rom >= 1000
          ? `${orderVariation.rom / 1000}TB`
          : `${orderVariation.rom}GB`;
      const ram = `${orderVariation.ram}GB`;
      return {
        success: false,
        outOfStock: true,
        message: `${phone.name}'s ${rom} / ${ram} variation is out of stock`,
      };
    }
  } catch (err) {
    console.log(err);
  }

  try {
    const updatePhone = await Phone.updateOne(
      {
        "variations._id": variationId,
      },
      {
        $inc: {
          "variations.$[el].quantity": -1,
        },
      },
      {
        arrayFilters: [{ "el._id": variationId, "el.quantity": { $gt: 0 } }],
        new: true,
      }
    ).exec();
  } catch (err) {
    console.log(err);
  }

  try {
    let orderUpdate = await Order.findByIdAndUpdate(orderId, {
      status: "approved",
    })
      .select("status")
      .exec();

    result.success = true;
    result.order = orderUpdate;

    console.log(result);
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
    result.orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "phone",
        select: "image name variations status colors",
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
    let orderExists = await Order.exists({
      $and: [
        { phone: body.phone },
        { variation: body.variation, color: body.color },
      ],
    }).exec();
    if (orderExists) {
      result.success = false;
      result.orderExists = true;
      result.message = "order exists";

      return result;
    }
  } catch (err) {
    console.log(err);
  }

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
